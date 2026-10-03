import { headers } from "next/headers"

export async function publicOrigin() {
  const headerList = await headers()
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost"
  const proto = headerList.get("x-forwarded-proto") ?? "http"
  return `${proto}://${host}`
}
