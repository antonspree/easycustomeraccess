import { mkdirSync } from "node:fs"
import path from "node:path"
import postgres, { type Sql } from "postgres"

type SqliteStmt = {
  all: (...params: unknown[]) => unknown[]
  run: (...params: unknown[]) => { changes: number }
}

type SqliteDb = {
  exec: (sql: string) => void
  prepare: (sql: string) => SqliteStmt
}

const globalForQuery = globalThis as unknown as {
  sqlite?: SqliteDb
  pg?: Sql
  ready?: Promise<void>
}

function databaseUrl() {
  const value = process.env.DATABASE_URL?.trim()
  return value || null
}

export function usesPostgres() {
  return Boolean(databaseUrl())
}

async function sqlite() {
  if (!globalForQuery.sqlite) {
    const { DatabaseSync } = await import("node:sqlite")
    const file = process.env.ECA_DB_PATH || path.join(process.cwd(), "data", "eca.sqlite")
    mkdirSync(path.dirname(file), { recursive: true })
    const db = new DatabaseSync(file) as unknown as SqliteDb
    db.exec("PRAGMA foreign_keys = ON")
    globalForQuery.sqlite = db
  }
  return globalForQuery.sqlite
}

function pg() {
  if (!globalForQuery.pg) {
    const connection = databaseUrl()
    if (!connection) throw new Error("DATABASE_URL fehlt")
    globalForQuery.pg = postgres(connection, { max: 1, ssl: "require", prepare: false })
  }
  return globalForQuery.pg
}

function toPg(sql: string) {
  let index = 0
  return sql.replace(/\?/g, () => `$${++index}`)
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
    id TEXT PRIMARY KEY,
    agency_id TEXT NOT NULL,
    expires_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    agency_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS setups (
    id TEXT PRIMARY KEY,
    agency_id TEXT NOT NULL,
    customer_id TEXT NOT NULL UNIQUE,
    token TEXT NOT NULL UNIQUE,
    opened_at TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS setup_providers (
    setup_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    position INTEGER NOT NULL,
    PRIMARY KEY (setup_id, provider_id)
  )`,
  `CREATE TABLE IF NOT EXISTS step_confirmations (
    setup_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    step_id TEXT NOT NULL,
    confirmed_at TEXT NOT NULL,
    PRIMARY KEY (setup_id, provider_id, step_id)
  )`,
]

async function migrate() {
  if (usesPostgres()) {
    const sql = pg()
    for (const statement of statements) await sql.unsafe(statement)
    return
  }
  const db = await sqlite()
  for (const statement of statements) db.exec(statement)
}

async function ready() {
  if (!globalForQuery.ready) globalForQuery.ready = migrate()
  await globalForQuery.ready
}

export async function many<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  await ready()
  if (usesPostgres()) {
    return (await pg().unsafe(toPg(sql), params as never[])) as unknown as T[]
  }
  const db = await sqlite()
  return db.prepare(sql).all(...params) as T[]
}

export async function one<T>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await many<T>(sql, params)
  return rows[0] ?? null
}

export async function run(sql: string, params: unknown[] = []) {
  await ready()
  if (usesPostgres()) {
    await pg().unsafe(toPg(sql), params as never[])
    return
  }
  const db = await sqlite()
  db.prepare(sql).run(...params)
}

export async function transaction<T>(fn: () => Promise<T>): Promise<T> {
  await ready()
  if (usesPostgres()) {
    const sql = pg()
    return sql.begin(async (tx) => {
      const previous = globalForQuery.pg
      globalForQuery.pg = tx as unknown as Sql
      try {
        return await fn()
      } finally {
        globalForQuery.pg = previous
      }
    }) as Promise<T>
  }
  const db = await sqlite()
  db.exec("BEGIN")
  try {
    const result = await fn()
    db.exec("COMMIT")
    return result
  } catch (error) {
    db.exec("ROLLBACK")
    throw error
  }
}
