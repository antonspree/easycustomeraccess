const hex = /^#[0-9a-fA-F]{6}$/

export function parseBrandHex(value: unknown, fallback: string) {
  const raw = String(value ?? "").trim()
  return hex.test(raw) ? raw.toLowerCase() : fallback
}

export function contrastOn(color: string) {
  const n = Number.parseInt(color.slice(1), 16)
  const red = (n >> 16) & 255
  const green = (n >> 8) & 255
  const blue = n & 255
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000
  return luminance > 160 ? "#000000" : "#ffffff"
}
