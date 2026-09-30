/**
 * Anbieter-Adapter.
 *
 * Diese Version legt nichts bei einem Anbieter an. Sie führt nur durch die
 * Schritte und speichert die Bestätigung. Ein späterer Adapter kann
 * `createsResources` auf true setzen und `provision` implementieren — die
 * Seiten und das Datenmodell bleiben gleich.
 */

export type ProvisionInput = {
  providerId: string
  customer: { name: string; email: string }
  agency: { name: string; email: string }
  confirmedEmail: string
  confirmedAt: string
}

export type ProvisionResult =
  | { created: false; reason: "guide-only" }
  | {
      created: true
      resources: Array<{
        kind: "organization" | "project" | "site" | "property"
        externalId: string
      }>
    }

export type ProviderAdapter = {
  id: string
  createsResources: boolean
  /** Nur setzen, wenn der Adapter nach vollständiger Zustimmung wirklich anlegen darf. */
  provision?: (input: ProvisionInput) => Promise<ProvisionResult>
}

const guideAdapter: ProviderAdapter = {
  id: "guide",
  createsResources: false,
}

const adapters = new Map<string, ProviderAdapter>([
  [guideAdapter.id, guideAdapter],
])

export function registerAdapter(adapter: ProviderAdapter) {
  adapters.set(adapter.id, adapter)
}

export function listAdapters() {
  return [...adapters.values()]
}

export function getAdapter(adapterId: string): ProviderAdapter {
  const adapter = adapters.get(adapterId)
  if (!adapter) {
    throw new Error(`Unbekannter Anbieter-Adapter: ${adapterId}`)
  }
  return adapter
}

export async function afterConsent(
  adapterId: string,
  input: ProvisionInput,
): Promise<ProvisionResult> {
  const adapter = getAdapter(adapterId)
  if (!adapter.createsResources || !adapter.provision) {
    return { created: false, reason: "guide-only" }
  }
  return adapter.provision(input)
}
