export type Confirmation = { providerId: string; stepId: string }

export type ProgressProvider = {
  id: string
  steps: { id: string; sentence: string }[]
}

export type Progress = {
  confirmed: number
  total: number
  openProviders: number
  next: { providerId: string; stepId: string; sentence: string } | null
}

export function progressFor(ordered: ProgressProvider[], confirmations: Confirmation[]): Progress {
  const done = new Set(confirmations.map((item) => `${item.providerId}:${item.stepId}`))
  let confirmed = 0
  let total = 0
  let openProviders = 0
  let next: Progress["next"] = null

  for (const provider of ordered) {
    total += provider.steps.length
    const confirmedHere = provider.steps.filter((step) => done.has(`${provider.id}:${step.id}`)).length
    confirmed += confirmedHere
    if (confirmedHere < provider.steps.length) {
      openProviders += 1
      if (!next) {
        const step = provider.steps.find((item) => !done.has(`${provider.id}:${item.id}`))
        if (step) next = { providerId: provider.id, stepId: step.id, sentence: step.sentence }
      }
    }
  }

  return { confirmed, total, openProviders, next }
}

export function openLabel(openProviders: number) {
  if (openProviders === 0) return "Keine offenen Anbieter"
  if (openProviders === 1) return "1 Anbieter offen"
  return `${openProviders} Anbieter offen`
}
