import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { deleteSession, getAgencyBySession } from "@/lib/db"

export const SESSION_COOKIE = "eca_session"

const fourteenDays = 60 * 60 * 24 * 14

export async function readAgency() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null
  return getAgencyBySession(token)
}

export async function requireAgency() {
  const agency = await readAgency()
  if (!agency) redirect("/anmelden")
  return agency
}

export async function setSessionCookie(token: string) {
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: fourteenDays,
  })
}

export async function clearSessionCookie() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (token) deleteSession(token)
  jar.delete(SESSION_COOKIE)
}
