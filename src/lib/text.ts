export function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function cleanName(value: string, limit = 80) {
  const name = value.trim().replace(/\s+/g, " ")
  if (name.length < 2) return { ok: false as const, error: "Bitte einen Namen eintragen." }
  if (name.length > limit) return { ok: false as const, error: "Der Name ist zu lang." }
  return { ok: true as const, name }
}
