import { headers } from "next/headers"

export async function publicOrigin() {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "127.0.0.1:43127"
  const forwarded = h.get("x-forwarded-proto")
  const proto =
    forwarded ??
    (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https")
  return `${proto}://${host}`
}
