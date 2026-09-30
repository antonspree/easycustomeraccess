import { getDb } from "@/lib/db"
import { getProvider } from "@/lib/providers/catalog"
import { providerStatus } from "@/lib/providers/status-rules"
import type { ProviderStatus } from "@/lib/providers/types"

type AgencyListRow = {
  id: string
  name: string
  email: string
  created_at: string
  owner_email: string | null
  member_count: number
  customer_count: number
}

type SetupRow = {
  id: string
  agency_id: string
  customer_id: string
  opened_at: string | null
  customer_name: string
  customer_email: string
  archived_at: string | null
}

type ProviderRow = { setup_id: string; provider_id: string; position: number }
type ConfirmationRow = { setup_id: string; provider_id: string; step_id: string }

function statusFor(providerId: string, opened: boolean, stepIds: string[]): ProviderStatus {
  const definition = getProvider(providerId)
  const known = new Set(definition?.steps.map((step) => step.id) ?? [])
  const confirmedCount = stepIds.filter((id) => known.has(id)).length
  return providerStatus({
    opened,
    confirmedCount,
    totalSteps: definition?.steps.length ?? 0,
  })
}

async function loadSetups() {
  const setups = await getDb()
    .prepare(
      `SELECT s.id, s.agency_id, s.customer_id, s.opened_at, c.name AS customer_name, c.email AS customer_email, c.archived_at
       FROM setups s JOIN customers c ON c.id = s.customer_id`,
    )
    .all() as SetupRow[]
  const providers = await getDb()
    .prepare("SELECT setup_id, provider_id, position FROM setup_providers")
    .all() as ProviderRow[]
  const confirmations = await getDb()
    .prepare("SELECT setup_id, provider_id, step_id FROM step_confirmations")
    .all() as ConfirmationRow[]
  return setups.map((setup) => {
    const opened = Boolean(setup.opened_at)
    const ownProviders = providers
      .filter((provider) => provider.setup_id === setup.id)
      .sort((a, b) => a.position - b.position)
      .map((provider) => {
        const steps = confirmations
          .filter((item) => item.setup_id === setup.id && item.provider_id === provider.provider_id)
          .map((item) => item.step_id)
        const status = statusFor(provider.provider_id, opened, steps)
        return {
          providerId: provider.provider_id,
          name: getProvider(provider.provider_id)?.name ?? provider.provider_id,
          status,
        }
      })
    const open = ownProviders.some((provider) => provider.status !== "fertig")
    return { ...setup, opened, providers: ownProviders, open }
  })
}

export async function adminOverview() {
  const agencies = await getDb()
    .prepare(
      `SELECT a.id, a.name, a.email, a.created_at,
              (SELECT m.email FROM members m WHERE m.agency_id = a.id AND m.role = 'inhaber' ORDER BY m.created_at LIMIT 1) AS owner_email,
              (SELECT count(*) FROM members m WHERE m.agency_id = a.id) AS member_count,
              (SELECT count(*) FROM customers c WHERE c.agency_id = a.id AND c.archived_at IS NULL) AS customer_count
       FROM agencies a
       ORDER BY a.created_at DESC`,
    )
    .all() as AgencyListRow[]
  const customers = await getDb()
    .prepare("SELECT count(*) AS count FROM customers WHERE archived_at IS NULL")
    .get() as { count: number }
  const setups = await loadSetups()
  return {
    agencyCount: agencies.length,
    customerCount: Number(customers.count),
    openSetupCount: setups.filter((setup) => setup.open && !setup.archived_at).length,
    agencies: agencies.map((agency) => ({
      id: agency.id,
      name: agency.name,
      email: agency.email,
      ownerEmail: agency.owner_email,
      memberCount: Number(agency.member_count),
      customerCount: Number(agency.customer_count),
    })),
  }
}

export async function adminAgency(agencyId: string) {
  const agency = await getDb()
    .prepare(
      `SELECT a.id, a.name, a.email, a.created_at,
              (SELECT m.email FROM members m WHERE m.agency_id = a.id AND m.role = 'inhaber' ORDER BY m.created_at LIMIT 1) AS owner_email
       FROM agencies a WHERE a.id = ?`,
    )
    .get(agencyId) as (AgencyListRow & { owner_email: string | null }) | undefined
  if (!agency) return null
  const members = await getDb()
    .prepare(
      "SELECT id, name, email, role, created_at FROM members WHERE agency_id = ? ORDER BY created_at",
    )
    .all(agencyId) as { id: string; name: string; email: string; role: string; created_at: string }[]
  const setups = (await loadSetups()).filter((setup) => setup.agency_id === agencyId)
  const customers = await getDb()
    .prepare(
      "SELECT id, name, email, archived_at FROM customers WHERE agency_id = ? ORDER BY created_at DESC",
    )
    .all(agencyId) as { id: string; name: string; email: string; archived_at: string | null }[]
  return {
    id: agency.id,
    name: agency.name,
    email: agency.email,
    ownerEmail: agency.owner_email,
    members: members.map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role === "inhaber" ? "Inhaber" : "Mitarbeiter",
    })),
    customers: customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      archived: Boolean(customer.archived_at),
      setups: setups
        .filter((setup) => setup.customer_id === customer.id)
        .map((setup) => ({
          id: setup.id,
          open: setup.open,
          providers: setup.providers,
        })),
    })),
  }
}
