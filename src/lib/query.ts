import { randomUUID } from "node:crypto"
import { mkdirSync } from "node:fs"
import path from "node:path"
import postgres, { type Sql, type TransactionSql } from "postgres"

type SqliteDb = {
  exec: (sql: string) => void
  prepare: (sql: string) => {
    get: (...params: unknown[]) => unknown
    all: (...params: unknown[]) => unknown[]
    run: (...params: unknown[]) => { changes: number }
  }
}

const globalForQuery = globalThis as unknown as {
  ecaSqlite?: SqliteDb
  ecaPg?: Sql
  ecaReady?: Promise<void>
  ecaTx?: TransactionSql | null
  ecaQueue?: Promise<void>
  ecaInTx?: boolean
}

function databaseUrl() {
  const url = process.env.DATABASE_URL?.trim()
  return url ? url : null
}

export function usesPostgres() {
  return Boolean(databaseUrl())
}

function sqlitePath() {
  if (process.env.ECA_DB_PATH) return process.env.ECA_DB_PATH
  const dir = path.join(process.cwd(), "data")
  mkdirSync(dir, { recursive: true })
  return path.join(dir, "eca.sqlite")
}

async function sqliteDb() {
  if (!globalForQuery.ecaSqlite) {
    const { DatabaseSync } = await import("node:sqlite")
    globalForQuery.ecaSqlite = new DatabaseSync(sqlitePath()) as unknown as SqliteDb
  }
  return globalForQuery.ecaSqlite
}

function pg() {
  if (!globalForQuery.ecaPg) {
    const url = databaseUrl()
    if (!url) throw new Error("DATABASE_URL fehlt.")
    globalForQuery.ecaPg = postgres(url, {
      max: 1,
      ssl: "require",
      prepare: false,
      idle_timeout: 20,
    })
  }
  return globalForQuery.ecaPg
}

function toPg(sql: string) {
  let index = 0
  return sql.replace(/\?/g, () => `$${++index}`)
}

function schedule<T>(fn: () => Promise<T>): Promise<T> {
  if (usesPostgres() || globalForQuery.ecaInTx) return fn()
  const previous = globalForQuery.ecaQueue ?? Promise.resolve()
  const run = previous.then(fn, fn)
  globalForQuery.ecaQueue = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

const statements = [
  `CREATE TABLE IF NOT EXISTS agencies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    agency_id TEXT NOT NULL REFERENCES agencies(id),
    expires_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    agency_id TEXT NOT NULL REFERENCES agencies(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE (agency_id, email)
  )`,
  `CREATE TABLE IF NOT EXISTS setups (
    id TEXT PRIMARY KEY,
    agency_id TEXT NOT NULL REFERENCES agencies(id),
    customer_id TEXT NOT NULL REFERENCES customers(id),
    token TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    opened_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS setup_providers (
    setup_id TEXT NOT NULL REFERENCES setups(id),
    provider_id TEXT NOT NULL,
    position INTEGER NOT NULL,
    PRIMARY KEY (setup_id, provider_id)
  )`,
  `CREATE TABLE IF NOT EXISTS step_confirmations (
    setup_id TEXT NOT NULL REFERENCES setups(id),
    provider_id TEXT NOT NULL,
    step_id TEXT NOT NULL,
    confirmed_email TEXT NOT NULL,
    confirmed_at TEXT NOT NULL,
    PRIMARY KEY (setup_id, provider_id, step_id)
  )`,
  `CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    agency_id TEXT NOT NULL REFERENCES agencies(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS member_invites (
    token TEXT PRIMARY KEY,
    agency_id TEXT NOT NULL REFERENCES agencies(id),
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL,
    accepted_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    agency_id TEXT NOT NULL REFERENCES agencies(id),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    href TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS notification_reads (
    notification_id TEXT NOT NULL REFERENCES notifications(id),
    member_id TEXT NOT NULL REFERENCES members(id),
    read_at TEXT NOT NULL,
    PRIMARY KEY (notification_id, member_id)
  )`,
  `CREATE TABLE IF NOT EXISTS step_blocks (
    setup_id TEXT NOT NULL REFERENCES setups(id),
    provider_id TEXT NOT NULL,
    step_id TEXT NOT NULL,
    note TEXT NOT NULL,
    created_at TEXT NOT NULL,
    resolved_at TEXT,
    PRIMARY KEY (setup_id, provider_id, step_id)
  )`,
  `CREATE TABLE IF NOT EXISTS invitation_checks (
    setup_id TEXT NOT NULL REFERENCES setups(id),
    provider_id TEXT NOT NULL,
    step_id TEXT NOT NULL,
    accepted_at TEXT NOT NULL,
    member_id TEXT NOT NULL REFERENCES members(id),
    PRIMARY KEY (setup_id, provider_id, step_id)
  )`,
]

async function columnExists(table: string, column: string) {
  if (usesPostgres()) {
    const rows = await pg()`
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = ${table} AND column_name = ${column}
    `
    return rows.length > 0
  }
  const db = await sqliteDb()
  const info = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]
  return info.some((entry) => entry.name === column)
}

async function ensureColumn(table: string, column: string, definition: string) {
  if (await columnExists(table, column)) return
  await rawExec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
}

async function rawExec(sql: string) {
  const parts = sql
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
  if (usesPostgres()) {
    const client = globalForQuery.ecaTx ?? pg()
    for (const part of parts) {
      if (part.startsWith("PRAGMA")) continue
      await client.unsafe(part)
    }
    return
  }
  const db = await sqliteDb()
  db.exec(sql)
}

async function migrate() {
  if (!usesPostgres()) {
    await rawExec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;")
  }
  for (const statement of statements) await rawExec(statement)
  await ensureColumn("customers", "archived_at", "TEXT")
  await ensureColumn("sessions", "member_id", "TEXT")

  const agencies = await manyRaw<{
    id: string
    name: string
    email: string
    password_hash: string
    created_at: string
  }>("SELECT id, name, email, password_hash, created_at FROM agencies")
  for (const agency of agencies) {
    const existing = await oneRaw<{ id: string }>(
      "SELECT id FROM members WHERE agency_id = ? LIMIT 1",
      [agency.id],
    )
    if (!existing) {
      await runRaw(
        "INSERT INTO members (id, agency_id, name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, 'inhaber', ?)",
        [
          randomUUID(),
          agency.id,
          agency.name,
          agency.email,
          agency.password_hash,
          agency.created_at,
        ],
      )
    }
  }
  await rawExec(`
    UPDATE sessions
    SET member_id = (
      SELECT id FROM members
      WHERE members.agency_id = sessions.agency_id AND members.role = 'inhaber'
      LIMIT 1
    )
    WHERE member_id IS NULL
  `)
}

export async function ready() {
  if (!globalForQuery.ecaReady) {
    globalForQuery.ecaReady = migrate().catch((error) => {
      globalForQuery.ecaReady = undefined
      throw error
    })
  }
  await globalForQuery.ecaReady
}

async function oneRaw<T>(sql: string, params: unknown[] = []) {
  if (usesPostgres()) {
    const client = globalForQuery.ecaTx ?? pg()
    const rows = await client.unsafe(toPg(sql), params as never[])
    return (rows[0] as T | undefined) ?? undefined
  }
  const db = await sqliteDb()
  return db.prepare(sql).get(...params) as T | undefined
}

async function manyRaw<T>(sql: string, params: unknown[] = []) {
  if (usesPostgres()) {
    const client = globalForQuery.ecaTx ?? pg()
    const rows = await client.unsafe(toPg(sql), params as never[])
    return rows as unknown as T[]
  }
  const db = await sqliteDb()
  return db.prepare(sql).all(...params) as T[]
}

async function runRaw(sql: string, params: unknown[] = []) {
  if (usesPostgres()) {
    const client = globalForQuery.ecaTx ?? pg()
    const rows = await client.unsafe(toPg(sql), params as never[])
    return { changes: rows.count }
  }
  const db = await sqliteDb()
  return { changes: db.prepare(sql).run(...params).changes }
}

export async function one<T>(sql: string, params: unknown[] = []) {
  await ready()
  return schedule(() => oneRaw<T>(sql, params))
}

export async function many<T>(sql: string, params: unknown[] = []) {
  await ready()
  return schedule(() => manyRaw<T>(sql, params))
}

export async function run(sql: string, params: unknown[] = []) {
  await ready()
  return schedule(() => runRaw(sql, params))
}

export async function transaction<T>(fn: () => Promise<T>) {
  if (usesPostgres()) {
    await ready()
    return pg().begin(async (tx) => {
      const previous = globalForQuery.ecaTx ?? null
      globalForQuery.ecaTx = tx
      try {
        return await fn()
      } finally {
        globalForQuery.ecaTx = previous
      }
    })
  }
  return schedule(async () => {
    await ready()
    const db = await sqliteDb()
    globalForQuery.ecaInTx = true
    db.exec("BEGIN")
    try {
      const value = await fn()
      db.exec("COMMIT")
      return value
    } catch (error) {
      db.exec("ROLLBACK")
      throw error
    } finally {
      globalForQuery.ecaInTx = false
    }
  })
}
