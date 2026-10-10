import { randomBytes } from "node:crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { one, run } from "@/lib/query"

const cookieName = "blokr_session"
const fourteenDays = 60 * 60 * 24 * 14

type Agency = { id: string; name: string; email: string }

export async function readSession(): Promise<Agency | null> {
  const jar = await cookies()
  const id = jar.get(cookieName)?.value
  if (!id) return null
  const row = await one<Agency & { expires_at: string }>(
    `SELECT a.id, a.name, a.email, s.expires_at
     FROM sessions s JOIN agencies a ON a.id = s.agency_id
     WHERE s.id = ?`,
    [id],
  )
  if (!row) return null
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await run("DELETE FROM sessions WHERE id = ?", [id])
    return null
  }
  return { id: row.id, name: row.name, email: row.email }
}

export async function requireSession() {
  const agency = await readSession()
  if (!agency) redirect("/anmelden")
  return agency
}

export async function setSession(agencyId: string) {
  const id = randomBytes(24).toString("base64url")
  const expires = new Date(Date.now() + fourteenDays * 1000).toISOString()
  await run("INSERT INTO sessions (id, agency_id, expires_at) VALUES (?, ?, ?)", [id, agencyId, expires])
  const jar = await cookies()
  jar.set(cookieName, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: fourteenDays,
  })
}

export async function clearSession() {
  const jar = await cookies()
  const id = jar.get(cookieName)?.value
  if (id) await run("DELETE FROM sessions WHERE id = ?", [id])
  jar.delete(cookieName)
}
