export type GuideVars = {
  email: string
  agency: string
  agencyEmail: string
}

export type StepImage = {
  src: string
  alt: string
  kind: "screenshot" | "schematic"
  caption?: string
}

export type Step = {
  id: string
  sentence: string
  title: string
  minutes: number
  url?: string
  urlLabel?: string
  intro: string
  substeps: string[]
  tips?: string[]
  pitfalls?: string[]
  doneWhen: string
  help?: string
  image?: StepImage
}

export type ProviderDefinition = {
  id: string
  name: string
  summary: string
  more: string
  steps: Step[]
}

const PLACEHOLDERS = ["{email}", "{agency}", "{agencyEmail}"] as const

export function fill(text: string, vars: GuideVars) {
  return text
    .replaceAll("{email}", vars.email)
    .replaceAll("{agency}", vars.agency)
    .replaceAll("{agencyEmail}", vars.agencyEmail)
}

export function fillStrings<T>(value: T, vars: GuideVars): T {
  if (typeof value === "string") return fill(value, vars) as T
  if (Array.isArray(value)) return value.map((item) => fillStrings(item, vars)) as T
  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value)) {
      next[key] = fillStrings(item, vars)
    }
    return next as T
  }
  return value
}

export function minutesFor(definitions: ProviderDefinition[]) {
  return definitions.reduce((sum, provider) => sum + provider.steps.reduce((inner, step) => inner + step.minutes, 0), 0)
}

export function placeholderTokens(text: string) {
  return [...text.matchAll(/\{[a-zA-Z]+\}/g)].map((match) => match[0])
}

export function allowedPlaceholders() {
  return PLACEHOLDERS
}
