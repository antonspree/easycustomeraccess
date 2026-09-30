import { getProvider } from "@/lib/providers/catalog"
import { providerStatus } from "@/lib/providers/status-rules"

export { providerStatus }

export type ConfirmationRef = {
  providerId: string
  stepId: string
  confirmedEmail?: string
  confirmedAt?: string
}

export type ProviderProgressInput = {
  providerId: string
  position: number
  confirmations: ConfirmationRef[]
}

export function confirmedStepIds(
  providerId: string,
  confirmations: ConfirmationRef[],
) {
  const definition = getProvider(providerId)
  const known = new Set(definition?.steps.map((step) => step.id) ?? [])
  return confirmations
    .filter((item) => item.providerId === providerId && known.has(item.stepId))
    .map((item) => item.stepId)
}

export function progressForProvider(input: {
  providerId: string
  opened: boolean
  confirmations: ConfirmationRef[]
}) {
  const definition = getProvider(input.providerId)
  const totalSteps = definition?.steps.length ?? 0
  const done = new Set(confirmedStepIds(input.providerId, input.confirmations))
  const confirmedCount = done.size
  return {
    definition,
    confirmedCount,
    totalSteps,
    status: providerStatus({
      opened: input.opened,
      confirmedCount,
      totalSteps,
    }),
  }
}

export function setupProgress(input: {
  opened: boolean
  providers: ProviderProgressInput[]
}) {
  const ordered = [...input.providers].sort((a, b) => a.position - b.position)
  let confirmed = 0
  let total = 0
  const providers = ordered.map((provider) => {
    const progress = progressForProvider({
      providerId: provider.providerId,
      opened: input.opened,
      confirmations: provider.confirmations,
    })
    confirmed += progress.confirmedCount
    total += progress.totalSteps
    return { ...provider, ...progress }
  })
  return { confirmed, total, providers }
}

export function findNextStep(input: {
  providers: ProviderProgressInput[]
}) {
  const ordered = [...input.providers].sort((a, b) => a.position - b.position)
  for (const provider of ordered) {
    const definition = getProvider(provider.providerId)
    if (!definition) continue
    const done = new Set(
      confirmedStepIds(provider.providerId, provider.confirmations),
    )
    for (const step of definition.steps) {
      if (!done.has(step.id)) {
        return {
          provider,
          definition,
          step,
          confirmedInProvider: done.size,
          totalInProvider: definition.steps.length,
        }
      }
    }
  }
  return null
}
