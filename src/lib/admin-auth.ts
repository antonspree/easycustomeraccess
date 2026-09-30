import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const ADMIN_COOKIE = "eca_admin"
const twelveHours = 60 * 60 * 12

export function adminConfigured() {
  return Boolean(process.env.ADMIN_EMAIL?.trim() && process.env.ADMIN_PASSWORD)
}

function sameSecret(left: string, right: string) {
  const a = createHash("sha256").update(left).digest()
  const b = createHash("sha256").update(right).digest()
  return timingSafeEqual(a, b)
}

export function adminCredentialsMatch(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? ""
  const expectedPassword = process.env.ADMIN_PASSWORD ?? ""
  if (!expectedEmail || !expectedPassword) return false
  return sameSecret(email.trim().toLowerCase(), expectedEmail) && sameSecret(password, expectedPassword)
}

function sign(exp: number) {
  const body = String(exp)
  const sig = createHmac("sha256", process.env.ADMIN_PASSWORD ?? "").update(body).digest("base64url")
  return `${body}.${sig}`
}

export function adminCookieValue() {
  return sign(Date.now() + twelveHours * 1000)
}

export function adminCookieValid(value: string | undefined) {
  if (!value || !adminConfigured()) return false
  const [body, sig] = value.split(".")
  if (!body || !sig) return false
  const exp = Number(body)
  if (!Number.isFinite(exp) || exp < Date.now()) return false
  const expected = sign(exp).split(".")[1]
  const left = Buffer.from(sig)
  const right = Buffer.from(expected)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export async function readAdmin() {
  const jar = await cookies()
  return adminCookieValid(jar.get(ADMIN_COOKIE)?.value)
}

export async function requireAdmin() {
  if (!(await readAdmin())) redirect("/verwaltung/anmelden")
}

export async function setAdminCookie() {
  const jar = await cookies()
  jar.set(ADMIN_COOKIE, adminCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: twelveHours,
  })
}

export async function clearAdminCookie() {
  const jar = await cookies()
  jar.delete(ADMIN_COOKIE)
}
