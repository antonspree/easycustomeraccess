export type TemplateVars = {
  customerEmail: string
  agencyEmail: string
  customerName: string
  agencyName: string
}

export function fillTemplate(text: string, vars: TemplateVars) {
  return text
    .replaceAll("{customerEmail}", vars.customerEmail)
    .replaceAll("{agencyEmail}", vars.agencyEmail)
    .replaceAll("{customerName}", vars.customerName)
    .replaceAll("{agencyName}", vars.agencyName)
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso))
}
