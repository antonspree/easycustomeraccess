import { randomBytes, randomUUID } from "node:crypto"
import { mkdirSync } from "node:fs"
import path from "node:path"
import { DatabaseSync } from "node:sqlite"
import { hashPassword, verifyPassword } from "@/lib/password"
import { getProvider } from "@/lib/providers/catalog"

export type Agency = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type MemberRole = "inhaber" | "mitarbeiter"

export type Member = {
  id: string
  agencyId: string
  name: string
  email: string
  role: MemberRole
  createdAt: string
}

export type Customer = {
  id: string
  agencyId: string
  name: string
  email: string
  createdAt: string
  archivedAt: string | null
}

export type SetupRecord = {
  id: string
  agencyId: string
  customerId: string
  token: string
  createdAt: string
  openedAt: string | null
}

export type StepConfirmation = {
  providerId: string
  stepId: string
  confirmedEmail: string
  confirmedAt: string
}

export type SetupProviderRecord = {
  providerId: string
  position: number
  confirmations: StepConfirmation[]
}

export type StepBlock = {
  providerId: string
  stepId: string
  note: string
  createdAt: string
  resolvedAt: string | null
}

export type InvitationAcceptance = {
  providerId: string
  stepId: string
  acceptedAt: string
  memberId: string
  memberName: string
}

export type SetupBundle = SetupRecord & {
  providers: SetupProviderRecord[]
  blocks: StepBlock[]
  invitations: InvitationAcceptance[]
}

type AgencyRow = {
  id: string
  name: string
  email: string
  password_hash: string
  created_at: string
}

type MemberRow = {
  id: string
  agency_id: string
  name: string
  email: string
  password_hash: string
  role: string
  created_at: string
}

type CustomerRow = {
  id: string
  agency_id: string
  name: string
  email: string
  created_at: string
  archived_at: string | null
}

type SetupRow = {
  id: string
  agency_id: string
  customer_id: string
  token: string
  created_at: string
  opened_at: string | null
}

type ProviderRow = {
  setup_id: string
  provider_id: string
  position: number
}

type ConfirmationRow = {
  setup_id: string
  provider_id: string
  step_id: string
  confirmed_email: string
  confirmed_at: string
}

const SCHEMA_VERSION = 2

const globalForDb = globalThis as unknown as {
  ecaDb?: DatabaseSync
  ecaSchema?: number
}

function databasePath() {
  if (process.env.ECA_DB_PATH) return process.env.ECA_DB_PATH
  const dir = path.join(process.cwd(), "data")
  mkdirSync(dir, { recursive: true })
  return path.join(dir, "eca.sqlite")
}

function columnExists(db: DatabaseSync, table: string, column: string) {
  const info = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]
  return info.some((entry) => entry.name === column)
}

function ensureColumn(db: DatabaseSync, table: string, column: string, definition: string) {
  if (!columnExists(db, table, column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
  }
}

function migrate(db: DatabaseSync) {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS agencies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      agency_id TEXT NOT NULL REFERENCES agencies(id),
      expires_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      agency_id TEXT NOT NULL REFERENCES agencies(id),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE (agency_id, email)
    );

    CREATE TABLE IF NOT EXISTS setups (
      id TEXT PRIMARY KEY,
      agency_id TEXT NOT NULL REFERENCES agencies(id),
      customer_id TEXT NOT NULL REFERENCES customers(id),
      token TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      opened_at TEXT
    );

    CREATE TABLE IF NOT EXISTS setup_providers (
      setup_id TEXT NOT NULL REFERENCES setups(id),
      provider_id TEXT NOT NULL,
      position INTEGER NOT NULL,
      PRIMARY KEY (setup_id, provider_id)
    );

    CREATE TABLE IF NOT EXISTS step_confirmations (
      setup_id TEXT NOT NULL REFERENCES setups(id),
      provider_id TEXT NOT NULL,
      step_id TEXT NOT NULL,
      confirmed_email TEXT NOT NULL,
      confirmed_at TEXT NOT NULL,
      PRIMARY KEY (setup_id, provider_id, step_id)
    );

    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      agency_id TEXT NOT NULL REFERENCES agencies(id),
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS member_invites (
      token TEXT PRIMARY KEY,
      agency_id TEXT NOT NULL REFERENCES agencies(id),
      email TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL,
      accepted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      agency_id TEXT NOT NULL REFERENCES agencies(id),
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      href TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notification_reads (
      notification_id TEXT NOT NULL REFERENCES notifications(id),
      member_id TEXT NOT NULL REFERENCES members(id),
      read_at TEXT NOT NULL,
      PRIMARY KEY (notification_id, member_id)
    );

    CREATE TABLE IF NOT EXISTS step_blocks (
      setup_id TEXT NOT NULL REFERENCES setups(id),
      provider_id TEXT NOT NULL,
      step_id TEXT NOT NULL,
      note TEXT NOT NULL,
      created_at TEXT NOT NULL,
      resolved_at TEXT,
      PRIMARY KEY (setup_id, provider_id, step_id)
    );

    CREATE TABLE IF NOT EXISTS invitation_checks (
      setup_id TEXT NOT NULL REFERENCES setups(id),
      provider_id TEXT NOT NULL,
      step_id TEXT NOT NULL,
      accepted_at TEXT NOT NULL,
      member_id TEXT NOT NULL REFERENCES members(id),
      PRIMARY KEY (setup_id, provider_id, step_id)
    );
  `)

  ensureColumn(db, "customers", "archived_at", "TEXT")
  ensureColumn(db, "sessions", "member_id", "TEXT")

  const agencies = db
    .prepare("SELECT id, name, email, password_hash, created_at FROM agencies")
    .all() as AgencyRow[]
  const insertMember = db.prepare(
    "INSERT INTO members (id, agency_id, name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, 'inhaber', ?)",
  )
  for (const agency of agencies) {
    const existing = db
      .prepare("SELECT id FROM members WHERE agency_id = ? LIMIT 1")
      .get(agency.id) as { id: string } | undefined
    if (!existing) {
      insertMember.run(
        randomUUID(),
        agency.id,
        agency.name,
        agency.email,
        agency.password_hash,
        agency.created_at,
      )
    }
  }

  db.exec(`
    UPDATE sessions
    SET member_id = (
      SELECT id FROM members
      WHERE members.agency_id = sessions.agency_id AND members.role = 'inhaber'
      LIMIT 1
    )
    WHERE member_id IS NULL
  `)
}

export function getDb() {
  if (!globalForDb.ecaDb) {
    globalForDb.ecaDb = new DatabaseSync(databasePath())
  }
  if (globalForDb.ecaSchema !== SCHEMA_VERSION) {
    migrate(globalForDb.ecaDb)
    globalForDb.ecaSchema = SCHEMA_VERSION
  }
  return globalForDb.ecaDb
}

function toAgency(row: AgencyRow): Agency {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
  }
}

function toMember(row: MemberRow): Member {
  return {
    id: row.id,
    agencyId: row.agency_id,
    name: row.name,
    email: row.email,
    role: row.role === "inhaber" ? "inhaber" : "mitarbeiter",
    createdAt: row.created_at,
  }
}

const customerColumns =
  "id, agency_id, name, email, created_at, archived_at"

function toCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    agencyId: row.agency_id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    archivedAt: row.archived_at,
  }
}

function toSetup(row: SetupRow): SetupRecord {
  return {
    id: row.id,
    agencyId: row.agency_id,
    customerId: row.customer_id,
    token: row.token,
    createdAt: row.created_at,
    openedAt: row.opened_at,
  }
}

export function findAgencyByEmail(email: string) {
  const row = getDb()
    .prepare(
      "SELECT id, name, email, password_hash, created_at FROM agencies WHERE email = ?",
    )
    .get(email) as AgencyRow | undefined
  return row ?? null
}

export function findMemberByEmail(email: string) {
  const row = getDb()
    .prepare(
      "SELECT id, agency_id, name, email, password_hash, role, created_at FROM members WHERE email = ?",
    )
    .get(email) as MemberRow | undefined
  return row ?? null
}

export function createAgency(input: {
  name: string
  email: string
  password: string
}) {
  if (findAgencyByEmail(input.email) || findMemberByEmail(input.email)) {
    return { ok: false as const, error: "Für diese E-Mail gibt es schon eine Agentur." }
  }
  const now = new Date().toISOString()
  const agency: AgencyRow = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    password_hash: hashPassword(input.password),
    created_at: now,
  }
  const member: MemberRow = {
    id: randomUUID(),
    agency_id: agency.id,
    name: input.name,
    email: input.email,
    password_hash: agency.password_hash,
    role: "inhaber",
    created_at: now,
  }
  const db = getDb()
  db.exec("BEGIN")
  try {
    db.prepare(
      "INSERT INTO agencies (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
    ).run(agency.id, agency.name, agency.email, agency.password_hash, agency.created_at)
    db.prepare(
      "INSERT INTO members (id, agency_id, name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).run(
      member.id,
      member.agency_id,
      member.name,
      member.email,
      member.password_hash,
      member.role,
      member.created_at,
    )
    db.exec("COMMIT")
  } catch (error) {
    db.exec("ROLLBACK")
    throw error
  }
  return { ok: true as const, agency: toAgency(agency), member: toMember(member) }
}

export function authenticateMember(email: string, password: string) {
  const row = findMemberByEmail(email)
  if (!row || !verifyPassword(password, row.password_hash)) return null
  const agency = getDb()
    .prepare("SELECT id, name, email, password_hash, created_at FROM agencies WHERE id = ?")
    .get(row.agency_id) as AgencyRow | undefined
  if (!agency) return null
  return { agency: toAgency(agency), member: toMember(row) }
}

export function createSession(memberId: string, agencyId: string) {
  const token = randomBytes(32).toString("base64url")
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString()
  getDb()
    .prepare(
      "INSERT INTO sessions (token, agency_id, expires_at, member_id) VALUES (?, ?, ?, ?)",
    )
    .run(token, agencyId, expiresAt, memberId)
  return { token, expiresAt }
}

export function deleteSession(token: string) {
  getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token)
}

export function getSession(token: string) {
  const row = getDb()
    .prepare(
      `SELECT s.expires_at,
              a.id AS agency_id, a.name AS agency_name, a.email AS agency_email,
              a.password_hash AS agency_password_hash, a.created_at AS agency_created_at,
              m.id AS member_id, m.name AS member_name, m.email AS member_email,
              m.password_hash AS member_password_hash, m.role AS member_role,
              m.created_at AS member_created_at
       FROM sessions s
       JOIN members m ON m.id = s.member_id
       JOIN agencies a ON a.id = m.agency_id
       WHERE s.token = ?`,
    )
    .get(token) as
    | {
        expires_at: string
        agency_id: string
        agency_name: string
        agency_email: string
        agency_password_hash: string
        agency_created_at: string
        member_id: string
        member_name: string
        member_email: string
        member_password_hash: string
        member_role: string
        member_created_at: string
      }
    | undefined
  if (!row) return null
  if (new Date(row.expires_at).getTime() < Date.now()) {
    deleteSession(token)
    return null
  }
  return {
    agency: toAgency({
      id: row.agency_id,
      name: row.agency_name,
      email: row.agency_email,
      password_hash: row.agency_password_hash,
      created_at: row.agency_created_at,
    }),
    member: toMember({
      id: row.member_id,
      agency_id: row.agency_id,
      name: row.member_name,
      email: row.member_email,
      password_hash: row.member_password_hash,
      role: row.member_role,
      created_at: row.member_created_at,
    }),
  }
}

export function findCustomerByEmail(agencyId: string, email: string) {
  const row = getDb()
    .prepare(
      `SELECT ${customerColumns} FROM customers WHERE agency_id = ? AND email = ?`,
    )
    .get(agencyId, email) as CustomerRow | undefined
  return row ? toCustomer(row) : null
}

function loadExtras(setupIds: string[]) {
  const blocks = new Map<string, StepBlock[]>()
  const invitations = new Map<string, InvitationAcceptance[]>()
  if (setupIds.length === 0) return { blocks, invitations }
  const placeholders = setupIds.map(() => "?").join(", ")
  const blockRows = getDb()
    .prepare(
      `SELECT setup_id, provider_id, step_id, note, created_at, resolved_at
       FROM step_blocks WHERE setup_id IN (${placeholders})`,
    )
    .all(...setupIds) as {
    setup_id: string
    provider_id: string
    step_id: string
    note: string
    created_at: string
    resolved_at: string | null
  }[]
  for (const row of blockRows) {
    const list = blocks.get(row.setup_id) ?? []
    list.push({
      providerId: row.provider_id,
      stepId: row.step_id,
      note: row.note,
      createdAt: row.created_at,
      resolvedAt: row.resolved_at,
    })
    blocks.set(row.setup_id, list)
  }
  const inviteRows = getDb()
    .prepare(
      `SELECT i.setup_id, i.provider_id, i.step_id, i.accepted_at, i.member_id, m.name AS member_name
       FROM invitation_checks i
       JOIN members m ON m.id = i.member_id
       WHERE i.setup_id IN (${placeholders})`,
    )
    .all(...setupIds) as {
    setup_id: string
    provider_id: string
    step_id: string
    accepted_at: string
    member_id: string
    member_name: string
  }[]
  for (const row of inviteRows) {
    const list = invitations.get(row.setup_id) ?? []
    list.push({
      providerId: row.provider_id,
      stepId: row.step_id,
      acceptedAt: row.accepted_at,
      memberId: row.member_id,
      memberName: row.member_name,
    })
    invitations.set(row.setup_id, list)
  }
  return { blocks, invitations }
}

function loadProviders(setupIds: string[]) {
  const providers = new Map<string, SetupProviderRecord[]>()
  const confirmations = new Map<string, StepConfirmation[]>()
  if (setupIds.length === 0) return providers

  const placeholders = setupIds.map(() => "?").join(", ")
  const providerRows = getDb()
    .prepare(
      `SELECT setup_id, provider_id, position FROM setup_providers WHERE setup_id IN (${placeholders}) ORDER BY position ASC`,
    )
    .all(...setupIds) as ProviderRow[]
  const confirmationRows = getDb()
    .prepare(
      `SELECT setup_id, provider_id, step_id, confirmed_email, confirmed_at
       FROM step_confirmations WHERE setup_id IN (${placeholders})`,
    )
    .all(...setupIds) as ConfirmationRow[]

  for (const row of confirmationRows) {
    const key = `${row.setup_id}:${row.provider_id}`
    const list = confirmations.get(key) ?? []
    list.push({
      providerId: row.provider_id,
      stepId: row.step_id,
      confirmedEmail: row.confirmed_email,
      confirmedAt: row.confirmed_at,
    })
    confirmations.set(key, list)
  }

  for (const row of providerRows) {
    const list = providers.get(row.setup_id) ?? []
    list.push({
      providerId: row.provider_id,
      position: row.position,
      confirmations:
        confirmations.get(`${row.setup_id}:${row.provider_id}`) ?? [],
    })
    providers.set(row.setup_id, list)
  }
  return providers
}

function bundlesFor(rows: SetupRow[]) {
  const ids = rows.map((row) => row.id)
  const providers = loadProviders(ids)
  const extras = loadExtras(ids)
  return rows.map((row) => ({
    ...toSetup(row),
    providers: providers.get(row.id) ?? [],
    blocks: extras.blocks.get(row.id) ?? [],
    invitations: extras.invitations.get(row.id) ?? [],
  }))
}

export function createCustomerWithSetup(input: {
  agencyId: string
  name: string
  email: string
  providerIds: string[]
}) {
  const duplicate = findCustomerByEmail(input.agencyId, input.email)
  if (duplicate) {
    return {
      ok: false as const,
      error: duplicate.archivedAt
        ? "Diese E-Mail liegt im Archiv. Stellen Sie den Kunden dort wieder her."
        : "Diese E-Mail ist bei Ihrer Agentur schon als Kunde angelegt.",
    }
  }

  const uniqueIds = [...new Set(input.providerIds)]
  const known = uniqueIds.filter((id) => getProvider(id))
  if (known.length === 0) {
    return { ok: false as const, error: "Wählen Sie mindestens einen Anbieter." }
  }

  const db = getDb()
  const customer: CustomerRow = {
    id: randomUUID(),
    agency_id: input.agencyId,
    name: input.name,
    email: input.email,
    created_at: new Date().toISOString(),
    archived_at: null,
  }
  const setup: SetupRow = {
    id: randomUUID(),
    agency_id: input.agencyId,
    customer_id: customer.id,
    token: randomBytes(24).toString("base64url"),
    created_at: customer.created_at,
    opened_at: null,
  }

  db.exec("BEGIN")
  try {
    db.prepare(
      "INSERT INTO customers (id, agency_id, name, email, created_at, archived_at) VALUES (?, ?, ?, ?, ?, NULL)",
    ).run(
      customer.id,
      customer.agency_id,
      customer.name,
      customer.email,
      customer.created_at,
    )
    db.prepare(
      "INSERT INTO setups (id, agency_id, customer_id, token, created_at, opened_at) VALUES (?, ?, ?, ?, ?, NULL)",
    ).run(setup.id, setup.agency_id, setup.customer_id, setup.token, setup.created_at)
    const insertProvider = db.prepare(
      "INSERT INTO setup_providers (setup_id, provider_id, position) VALUES (?, ?, ?)",
    )
    known.forEach((providerId, position) => {
      insertProvider.run(setup.id, providerId, position)
    })
    db.exec("COMMIT")
  } catch (error) {
    db.exec("ROLLBACK")
    throw error
  }

  return {
    ok: true as const,
    customer: toCustomer(customer),
    setup: bundlesFor([setup])[0],
  }
}

export function listCustomersForAgency(agencyId: string, archived = false) {
  const customers = getDb()
    .prepare(
      `SELECT ${customerColumns} FROM customers
       WHERE agency_id = ? AND archived_at IS ${archived ? "NOT NULL" : "NULL"}
       ORDER BY created_at DESC`,
    )
    .all(agencyId) as CustomerRow[]
  if (customers.length === 0) return []

  const ids = customers.map((customer) => customer.id)
  const placeholders = ids.map(() => "?").join(", ")
  const setups = getDb()
    .prepare(
      `SELECT id, agency_id, customer_id, token, created_at, opened_at
       FROM setups WHERE agency_id = ? AND customer_id IN (${placeholders})
       ORDER BY created_at ASC`,
    )
    .all(agencyId, ...ids) as SetupRow[]
  const bundled = bundlesFor(setups)
  return customers.map((customer) => ({
    ...toCustomer(customer),
    setups: bundled.filter((setup) => setup.customerId === customer.id),
  }))
}

export function getCustomerForAgency(agencyId: string, customerId: string) {
  const row = getDb()
    .prepare(
      `SELECT ${customerColumns} FROM customers WHERE agency_id = ? AND id = ?`,
    )
    .get(agencyId, customerId) as CustomerRow | undefined
  if (!row) return null
  const setups = getDb()
    .prepare(
      "SELECT id, agency_id, customer_id, token, created_at, opened_at FROM setups WHERE agency_id = ? AND customer_id = ? ORDER BY created_at ASC",
    )
    .all(agencyId, customerId) as SetupRow[]
  return { ...toCustomer(row), setups: bundlesFor(setups) }
}

export function getSetupByToken(token: string) {
  const setup = getDb()
    .prepare(
      "SELECT id, agency_id, customer_id, token, created_at, opened_at FROM setups WHERE token = ?",
    )
    .get(token) as SetupRow | undefined
  if (!setup) return null
  const customer = getDb()
    .prepare(
      `SELECT ${customerColumns} FROM customers WHERE id = ? AND agency_id = ?`,
    )
    .get(setup.customer_id, setup.agency_id) as CustomerRow | undefined
  const agency = getDb()
    .prepare(
      "SELECT id, name, email, password_hash, created_at FROM agencies WHERE id = ?",
    )
    .get(setup.agency_id) as AgencyRow | undefined
  if (!customer || !agency) return null
  return {
    setup: bundlesFor([setup])[0],
    customer: toCustomer(customer),
    agency: toAgency(agency),
  }
}

export function markSetupOpened(setupId: string, agencyId: string) {
  getDb()
    .prepare(
      "UPDATE setups SET opened_at = ? WHERE id = ? AND agency_id = ? AND opened_at IS NULL",
    )
    .run(new Date().toISOString(), setupId, agencyId)
}

export function confirmStep(input: {
  setupId: string
  agencyId: string
  providerId: string
  stepId: string
  confirmedEmail: string
}) {
  const owns = getDb()
    .prepare(
      `SELECT 1 AS ok FROM setup_providers sp
       JOIN setups s ON s.id = sp.setup_id
       WHERE sp.setup_id = ? AND sp.provider_id = ? AND s.agency_id = ?`,
    )
    .get(input.setupId, input.providerId, input.agencyId) as
    | { ok: number }
    | undefined
  if (!owns) return { ok: false as const, error: "Dieser Anbieter gehört nicht zur Einrichtung." }

  getDb()
    .prepare(
      `INSERT INTO step_confirmations (setup_id, provider_id, step_id, confirmed_email, confirmed_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT (setup_id, provider_id, step_id) DO NOTHING`,
    )
    .run(
      input.setupId,
      input.providerId,
      input.stepId,
      input.confirmedEmail,
      new Date().toISOString(),
    )
  return { ok: true as const }
}
