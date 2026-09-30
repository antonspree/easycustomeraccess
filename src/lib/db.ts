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

export type Customer = {
  id: string
  agencyId: string
  name: string
  email: string
  createdAt: string
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

export type SetupBundle = SetupRecord & {
  providers: SetupProviderRecord[]
}

type AgencyRow = {
  id: string
  name: string
  email: string
  password_hash: string
  created_at: string
}

type CustomerRow = {
  id: string
  agency_id: string
  name: string
  email: string
  created_at: string
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

const globalForDb = globalThis as unknown as { ecaDb?: DatabaseSync }

function databasePath() {
  if (process.env.ECA_DB_PATH) return process.env.ECA_DB_PATH
  const dir = path.join(process.cwd(), "data")
  mkdirSync(dir, { recursive: true })
  return path.join(dir, "eca.sqlite")
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
  `)
}

export function getDb() {
  if (!globalForDb.ecaDb) {
    const db = new DatabaseSync(databasePath())
    migrate(db)
    globalForDb.ecaDb = db
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

function toCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    agencyId: row.agency_id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
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

export function createAgency(input: {
  name: string
  email: string
  password: string
}) {
  const existing = findAgencyByEmail(input.email)
  if (existing) {
    return { ok: false as const, error: "Für diese E-Mail gibt es schon eine Agentur." }
  }
  const agency: AgencyRow = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    password_hash: hashPassword(input.password),
    created_at: new Date().toISOString(),
  }
  getDb()
    .prepare(
      "INSERT INTO agencies (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
    )
    .run(
      agency.id,
      agency.name,
      agency.email,
      agency.password_hash,
      agency.created_at,
    )
  return { ok: true as const, agency: toAgency(agency) }
}

export function authenticateAgency(email: string, password: string) {
  const row = findAgencyByEmail(email)
  if (!row || !verifyPassword(password, row.password_hash)) return null
  return toAgency(row)
}

export function createSession(agencyId: string) {
  const token = randomBytes(32).toString("base64url")
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString()
  getDb()
    .prepare(
      "INSERT INTO sessions (token, agency_id, expires_at) VALUES (?, ?, ?)",
    )
    .run(token, agencyId, expiresAt)
  return { token, expiresAt }
}

export function deleteSession(token: string) {
  getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token)
}

export function getAgencyBySession(token: string) {
  const row = getDb()
    .prepare(
      `SELECT a.id, a.name, a.email, a.password_hash, a.created_at, s.expires_at
       FROM sessions s
       JOIN agencies a ON a.id = s.agency_id
       WHERE s.token = ?`,
    )
    .get(token) as (AgencyRow & { expires_at: string }) | undefined
  if (!row) return null
  if (new Date(row.expires_at).getTime() < Date.now()) {
    deleteSession(token)
    return null
  }
  return toAgency(row)
}

export function findCustomerByEmail(agencyId: string, email: string) {
  const row = getDb()
    .prepare(
      "SELECT id, agency_id, name, email, created_at FROM customers WHERE agency_id = ? AND email = ?",
    )
    .get(agencyId, email) as CustomerRow | undefined
  return row ? toCustomer(row) : null
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
  const providers = loadProviders(rows.map((row) => row.id))
  return rows.map((row) => ({
    ...toSetup(row),
    providers: providers.get(row.id) ?? [],
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
      error: "Diese E-Mail ist bei Ihrer Agentur schon als Kunde angelegt.",
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
      "INSERT INTO customers (id, agency_id, name, email, created_at) VALUES (?, ?, ?, ?, ?)",
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

export function listCustomersForAgency(agencyId: string) {
  const customers = getDb()
    .prepare(
      "SELECT id, agency_id, name, email, created_at FROM customers WHERE agency_id = ? ORDER BY created_at DESC",
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
      "SELECT id, agency_id, name, email, created_at FROM customers WHERE agency_id = ? AND id = ?",
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
      "SELECT id, agency_id, name, email, created_at FROM customers WHERE id = ? AND agency_id = ?",
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
