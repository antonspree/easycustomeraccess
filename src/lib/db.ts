import { randomBytes, randomUUID } from "node:crypto"
import { getProvider, providers } from "@/lib/catalog"
import { hashPassword, verifyPassword } from "@/lib/password"
import { progressFor, type ProgressProvider } from "@/lib/progress"
import { many, one, run, transaction } from "@/lib/query"
import { isEmail, normalizeEmail } from "@/lib/text"

type AgencyRow = { id: string; name: string; email: string; password_hash: string }

export async function registerAgency(input: { name: string; email: string; password: string }) {
  const email = normalizeEmail(input.email)
  const existing = await one("SELECT id FROM agencies WHERE email = ?", [email])
  if (existing) return { ok: false as const, error: "Diese E-Mail ist schon registriert." }
  const id = randomUUID()
  await run(
    "INSERT INTO agencies (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
    [id, input.name, email, hashPassword(input.password), new Date().toISOString()],
  )
  return { ok: true as const, id }
}

export async function authenticate(email: string, password: string) {
  const row = await one<AgencyRow>("SELECT id, name, email, password_hash FROM agencies WHERE email = ?", [
    normalizeEmail(email),
  ])
  if (!row || !verifyPassword(password, row.password_hash)) return null
  return { id: row.id, name: row.name, email: row.email }
}

export async function updateAgencyName(agencyId: string, name: string) {
  await run("UPDATE agencies SET name = ? WHERE id = ?", [name, agencyId])
}

export type CustomerListItem = {
  id: string
  name: string
  email: string
  confirmed: number
  total: number
  openProviders: number
}

function orderedProviders(ids: string[]): ProgressProvider[] {
  return ids.flatMap((id) => {
    const definition = getProvider(id)
    if (!definition) return []
    return [{ id: definition.id, steps: definition.steps }]
  })
}

export async function listCustomers(agencyId: string): Promise<CustomerListItem[]> {
  const customers = await many<{ id: string; name: string; email: string }>(
    "SELECT id, name, email FROM customers WHERE agency_id = ? ORDER BY created_at DESC",
    [agencyId],
  )
  const setups = await many<{ id: string; customer_id: string }>(
    "SELECT id, customer_id FROM setups WHERE agency_id = ?",
    [agencyId],
  )
  const providers = await many<{ setup_id: string; provider_id: string; position: number }>(
    `SELECT sp.setup_id, sp.provider_id, sp.position
     FROM setup_providers sp JOIN setups s ON s.id = sp.setup_id
     WHERE s.agency_id = ?`,
    [agencyId],
  )
  const confirmations = await many<{ setup_id: string; provider_id: string; step_id: string }>(
    `SELECT c.setup_id, c.provider_id, c.step_id
     FROM step_confirmations c JOIN setups s ON s.id = c.setup_id
     WHERE s.agency_id = ?`,
    [agencyId],
  )
  return customers.map((customer) => {
    const setup = setups.find((item) => item.customer_id === customer.id)
    const ids = providers
      .filter((item) => item.setup_id === setup?.id)
      .sort((a, b) => a.position - b.position)
      .map((item) => item.provider_id)
    const done = confirmations
      .filter((item) => item.setup_id === setup?.id)
      .map((item) => ({ providerId: item.provider_id, stepId: item.step_id }))
    const progress = progressFor(orderedProviders(ids), done)
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      confirmed: progress.confirmed,
      total: progress.total,
      openProviders: progress.openProviders,
    }
  })
}

export async function createCustomer(input: {
  agencyId: string
  name: string
  email: string
  providerIds: string[]
}) {
  const known = input.providerIds.filter((id) => getProvider(id))
  if (known.length === 0) return { ok: false as const, error: "Bitte mindestens einen Anbieter wählen." }
  const customerId = randomUUID()
  const setupId = randomUUID()
  const token = randomBytes(18).toString("base64url")
  const now = new Date().toISOString()
  await transaction(async () => {
    await run(
      "INSERT INTO customers (id, agency_id, name, email, created_at) VALUES (?, ?, ?, ?, ?)",
      [customerId, input.agencyId, input.name, normalizeEmail(input.email), now],
    )
    await run(
      "INSERT INTO setups (id, agency_id, customer_id, token, opened_at, created_at) VALUES (?, ?, ?, ?, NULL, ?)",
      [setupId, input.agencyId, customerId, token, now],
    )
    for (const [position, providerId] of known.entries()) {
      await run(
        "INSERT INTO setup_providers (setup_id, provider_id, position) VALUES (?, ?, ?)",
        [setupId, providerId, position],
      )
    }
  })
  return { ok: true as const, customerId }
}

export async function customerForAgency(agencyId: string, customerId: string) {
  const customer = await one<{ id: string; name: string; email: string }>(
    "SELECT id, name, email FROM customers WHERE id = ? AND agency_id = ?",
    [customerId, agencyId],
  )
  if (!customer) return null
  const setup = await one<{ id: string; token: string; opened_at: string | null }>(
    "SELECT id, token, opened_at FROM setups WHERE customer_id = ? AND agency_id = ?",
    [customerId, agencyId],
  )
  if (!setup) return null
  const rows = await many<{ provider_id: string; position: number }>(
    "SELECT provider_id, position FROM setup_providers WHERE setup_id = ? ORDER BY position",
    [setup.id],
  )
  const confirmations = await many<{ provider_id: string; step_id: string }>(
    "SELECT provider_id, step_id FROM step_confirmations WHERE setup_id = ?",
    [setup.id],
  )
  const providers = orderedProviders(rows.map((row) => row.provider_id))
  const progress = progressFor(
    providers,
    confirmations.map((row) => ({ providerId: row.provider_id, stepId: row.step_id })),
  )
  return { customer, token: setup.token, openedAt: setup.opened_at, progress, providers }
}

export async function setupByToken(token: string) {
  const setup = await one<{
    id: string
    agency_id: string
    opened_at: string | null
    customer_name: string
    customer_email: string
    agency_name: string
    agency_email: string
  }>(
    `SELECT s.id, s.agency_id, s.opened_at, c.name AS customer_name, c.email AS customer_email,
            a.name AS agency_name, a.email AS agency_email
     FROM setups s
     JOIN customers c ON c.id = s.customer_id
     JOIN agencies a ON a.id = s.agency_id
     WHERE s.token = ?`,
    [token],
  )
  if (!setup) return null
  const rows = await many<{ provider_id: string; position: number }>(
    "SELECT provider_id, position FROM setup_providers WHERE setup_id = ? ORDER BY position",
    [setup.id],
  )
  const confirmations = await many<{ provider_id: string; step_id: string }>(
    "SELECT provider_id, step_id FROM step_confirmations WHERE setup_id = ?",
    [setup.id],
  )
  const providerIds = rows.map((row) => row.provider_id)
  const mapped = confirmations.map((row) => ({ providerId: row.provider_id, stepId: row.step_id }))
  const progress = progressFor(orderedProviders(providerIds), mapped)
  return { setup, progress, providerIds, confirmations: mapped }
}

export async function markOpened(setupId: string) {
  await run("UPDATE setups SET opened_at = ? WHERE id = ? AND opened_at IS NULL", [
    new Date().toISOString(),
    setupId,
  ])
}

export async function confirmStep(input: { token: string; providerId: string; stepId: string }) {
  const loaded = await setupByToken(input.token)
  if (!loaded?.progress.next) return { ok: false as const }
  if (loaded.progress.next.providerId !== input.providerId || loaded.progress.next.stepId !== input.stepId) {
    return { ok: false as const }
  }
  await run(
    "INSERT INTO step_confirmations (setup_id, provider_id, step_id, confirmed_at) VALUES (?, ?, ?, ?)",
    [loaded.setup.id, input.providerId, input.stepId, new Date().toISOString()],
  )
  return { ok: true as const }
}

export function knownProviderIds(values: string[]) {
  const allowed = new Set(providers.map((provider) => provider.id))
  return values.filter((id) => allowed.has(id))
}

export function validCustomerEmail(value: string) {
  const email = normalizeEmail(value)
  if (!isEmail(email)) return { ok: false as const, error: "Bitte eine gültige E-Mail eintragen." }
  return { ok: true as const, email }
}

export async function updateCustomer(input: {
  agencyId: string
  customerId: string
  name: string
  email: string
  providerIds: string[]
}) {
  const customer = await one<{ id: string; agency_id: string }>(
    "SELECT id, agency_id FROM customers WHERE id = ? AND agency_id = ?",
    [input.customerId, input.agencyId],
  )
  if (!customer) return { ok: false as const, error: "Kunde nicht gefunden." }

  const known = input.providerIds.filter((id) => getProvider(id))
  if (known.length === 0) return { ok: false as const, error: "Bitte mindestens einen Anbieter wählen." }

  const setup = await one<{ id: string }>(
    "SELECT id FROM setups WHERE customer_id = ? AND agency_id = ?",
    [input.customerId, input.agencyId],
  )
  if (!setup) return { ok: false as const, error: "Setup nicht gefunden." }

  await transaction(async () => {
    await run("UPDATE customers SET name = ?, email = ? WHERE id = ?", [
      input.name,
      normalizeEmail(input.email),
      input.customerId,
    ])

    const existingProviders = await many<{ provider_id: string }>(
      "SELECT provider_id FROM setup_providers WHERE setup_id = ?",
      [setup.id],
    )
    const existingIds = new Set(existingProviders.map((p) => p.provider_id))
    const newIds = new Set(known)

    const removed = existingProviders.filter((p) => !newIds.has(p.provider_id))
    for (const { provider_id } of removed) {
      await run("DELETE FROM step_confirmations WHERE setup_id = ? AND provider_id = ?", [setup.id, provider_id])
      await run("DELETE FROM setup_providers WHERE setup_id = ? AND provider_id = ?", [setup.id, provider_id])
    }

    const added = known.filter((id) => !existingIds.has(id))
    const maxPosition =
      existingProviders.length > 0
        ? Math.max(
            ...(await many<{ position: number }>("SELECT position FROM setup_providers WHERE setup_id = ?", [
              setup.id,
            ])).map((p) => p.position),
          )
        : -1
    for (const [index, providerId] of added.entries()) {
      await run("INSERT INTO setup_providers (setup_id, provider_id, position) VALUES (?, ?, ?)", [
        setup.id,
        providerId,
        maxPosition + 1 + index,
      ])
    }
  })
  return { ok: true as const }
}

export async function deleteCustomer(agencyId: string, customerId: string) {
  const customer = await one<{ id: string; agency_id: string }>(
    "SELECT id, agency_id FROM customers WHERE id = ? AND agency_id = ?",
    [customerId, agencyId],
  )
  if (!customer) return { ok: false as const, error: "Kunde nicht gefunden." }

  const setup = await one<{ id: string }>(
    "SELECT id FROM setups WHERE customer_id = ? AND agency_id = ?",
    [customerId, agencyId],
  )
  if (!setup) return { ok: false as const, error: "Setup nicht gefunden." }

  await transaction(async () => {
    await run("DELETE FROM step_confirmations WHERE setup_id = ?", [setup.id])
    await run("DELETE FROM setup_providers WHERE setup_id = ?", [setup.id])
    await run("DELETE FROM setups WHERE id = ?", [setup.id])
    await run("DELETE FROM customers WHERE id = ?", [customerId])
  })
  return { ok: true as const }
}
