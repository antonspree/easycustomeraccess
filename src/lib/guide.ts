import { getProvider, type ProviderDefinition, type Step } from "./catalog.ts"
import type { Confirmation } from "./progress.ts"

export type GuideStep = Step & { done: boolean; current: boolean }
export type GuideProvider = Omit<ProviderDefinition, "steps"> & {
  doneCount: number
  complete: boolean
  current: boolean
  steps: GuideStep[]
}

export type CurrentGuideStep = {
  provider: GuideProvider
  step: GuideStep
  index: number
  of: number
}

export function guideFor(providerIds: string[], confirmations: Confirmation[]) {
  const done = new Set(confirmations.map((item) => `${item.providerId}:${item.stepId}`))
  let currentKey: string | null = null

  const providers: GuideProvider[] = providerIds.flatMap((id) => {
    const definition = getProvider(id)
    if (!definition) return []
    const steps: GuideStep[] = definition.steps.map((step) => {
      const key = `${definition.id}:${step.id}`
      const isDone = done.has(key)
      const current = !isDone && !currentKey
      if (current) currentKey = key
      return { ...step, done: isDone, current }
    })
    return [
      {
        ...definition,
        steps,
        doneCount: steps.filter((step) => step.done).length,
        complete: steps.every((step) => step.done),
        current: steps.some((step) => step.current),
      },
    ]
  })

  const currentProvider = providers.find((provider) => provider.current) ?? null
  const currentStep = currentProvider?.steps.find((step) => step.current) ?? null
  const current: CurrentGuideStep | null =
    currentProvider && currentStep
      ? {
          provider: currentProvider,
          step: currentStep,
          index: currentProvider.steps.findIndex((step) => step.id === currentStep.id) + 1,
          of: currentProvider.steps.length,
        }
      : null

  return { providers, current }
}
