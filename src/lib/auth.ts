import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { deleteSession, getSession } from "@/lib/db"

export const SESSION_COOKIE = "eca_session"

const fourteenDays = 60 * 60 * 24 * 14

export async function readSession() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null
  return await getSession(token)
}

export async function requireSession() {
  const session = await readSession()
  if (!session) redirect("/anmelden")
  return session
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
  if (token) await deleteSession(token)
  jar.delete(SESSION_COOKIE)
}
