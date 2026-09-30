import { randomBytes, randomUUID } from "node:crypto"
import { hashPassword, verifyPassword } from "@/lib/password"
import { getProvider, stepGrantsAccess } from "@/lib/providers/catalog"
import {
  findMemberByEmail,
  getDb,
  type Member,
  type MemberRole,
} from "@/lib/db"

function knownProviderIds(providerIds: string[]) {
  return [...new Set(providerIds)].filter((id) => getProvider(id))
}

export function addProvidersToSetup(input: {
  agencyId: string
  setupId: string
  providerIds: string[]
}) {
  const setup = getDb()
    .prepare("SELECT id FROM setups WHERE id = ? AND agency_id = ?")
    .get(input.setupId, input.agencyId) as { id: string } | undefined
  if (!setup) return { ok: false as const, error: "Diese Einrichtung gehört nicht zu Ihrer Agentur." }
  const existing = getDb()
    .prepare("SELECT provider_id, position FROM setup_providers WHERE setup_id = ?")
    .all(input.setupId) as { provider_id: string; position: number }[]
  const taken = new Set(existing.map((row) => row.provider_id))
  const fresh = knownProviderIds(input.providerIds).filter((id) => !taken.has(id))
  if (fresh.length === 0) {
    return { ok: false as const, error: "Wählen Sie mindestens einen neuen Anbieter." }
  }
  const start = existing.reduce((max, row) => Math.max(max, row.position), -1) + 1
  const insert = getDb().prepare(
    "INSERT INTO setup_providers (setup_id, provider_id, position) VALUES (?, ?, ?)",
  )
  fresh.forEach((providerId, index) => insert.run(input.setupId, providerId, start + index))
  return { ok: true as const }
}

export function createAnotherSetup(input: {
  agencyId: string
  customerId: string
  providerIds: string[]
}) {
  const customer = getDb()
    .prepare(
      "SELECT id FROM customers WHERE id = ? AND agency_id = ? AND archived_at IS NULL",
    )
    .get(input.customerId, input.agencyId) as { id: string } | undefined
  if (!customer) return { ok: false as const, error: "Dieser Kunde ist nicht aktiv." }
  const known = knownProviderIds(input.providerIds)
  if (known.length === 0) {
    return { ok: false as const, error: "Wählen Sie mindestens einen Anbieter." }
  }
  const setupId = randomUUID()
  const now = new Date().toISOString()
  const token = randomBytes(24).toString("base64url")
  const db = getDb()
  db.exec("BEGIN")
  try {
    db.prepare(
      "INSERT INTO setups (id, agency_id, customer_id, token, created_at, opened_at) VALUES (?, ?, ?, ?, ?, NULL)",
    ).run(setupId, input.agencyId, input.customerId, token, now)
    const insert = db.prepare(
      "INSERT INTO setup_providers (setup_id, provider_id, position) VALUES (?, ?, ?)",
    )
    known.forEach((providerId, position) => insert.run(setupId, providerId, position))
    db.exec("COMMIT")
  } catch (error) {
    db.exec("ROLLBACK")
    throw error
  }
  return { ok: true as const }
}

export function renameCustomer(input: { agencyId: string; customerId: string; name: string }) {
  const result = getDb()
    .prepare("UPDATE customers SET name = ? WHERE id = ? AND agency_id = ?")
    .run(input.name, input.customerId, input.agencyId)
  if (result.changes === 0) return { ok: false as const, error: "Kunde nicht gefunden." }
  return { ok: true as const }
}

export function setCustomerArchived(input: {
  agencyId: string
  customerId: string
  archived: boolean
}) {
  getDb()
    .prepare("UPDATE customers SET archived_at = ? WHERE id = ? AND agency_id = ?")
    .run(input.archived ? new Date().toISOString() : null, input.customerId, input.agencyId)
}

export function blockStep(input: {
  setupId: string
  providerId: string
  stepId: string
  note: string
}) {
  getDb()
    .prepare(
      `INSERT INTO step_blocks (setup_id, provider_id, step_id, note, created_at, resolved_at)
       VALUES (?, ?, ?, ?, ?, NULL)
       ON CONFLICT (setup_id, provider_id, step_id)
       DO UPDATE SET note = excluded.note, created_at = excluded.created_at, resolved_at = NULL`,
    )
    .run(input.setupId, input.providerId, input.stepId, input.note, new Date().toISOString())
}

export function resolveBlock(input: { setupId: string; providerId: string; stepId: string }) {
  getDb()
    .prepare(
      "UPDATE step_blocks SET resolved_at = ? WHERE setup_id = ? AND provider_id = ? AND step_id = ? AND resolved_at IS NULL",
    )
    .run(new Date().toISOString(), input.setupId, input.providerId, input.stepId)
}

export function acceptInvitation(input: {
  setupId: string
  agencyId: string
  providerId: string
  stepId: string
  memberId: string
}) {
  const owns = getDb()
    .prepare("SELECT 1 AS ok FROM setups WHERE id = ? AND agency_id = ?")
    .get(input.setupId, input.agencyId) as { ok: number } | undefined
  if (!owns) return { ok: false as const, error: "Diese Einrichtung gehört nicht zu Ihrer Agentur." }
  const confirmed = getDb()
    .prepare(
      "SELECT 1 AS ok FROM step_confirmations WHERE setup_id = ? AND provider_id = ? AND step_id = ?",
    )
    .get(input.setupId, input.providerId, input.stepId) as { ok: number } | undefined
  if (!confirmed) {
    return { ok: false as const, error: "Der Kunde hat die Einladung noch nicht bestätigt." }
  }
  const provider = getProvider(input.providerId)
  const step = provider?.steps.find((item) => item.id === input.stepId)
  if (!step || !stepGrantsAccess(step)) {
    return { ok: false as const, error: "Dieser Schritt ist keine Einladung." }
  }
  getDb()
    .prepare(
      `INSERT INTO invitation_checks (setup_id, provider_id, step_id, accepted_at, member_id)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT (setup_id, provider_id, step_id) DO NOTHING`,
    )
    .run(
      input.setupId,
      input.providerId,
      input.stepId,
      new Date().toISOString(),
      input.memberId,
    )
  return { ok: true as const }
}

export function notifyAgency(input: {
  agencyId: string
  title: string
  body: string
  href?: string
}) {
  getDb()
    .prepare(
      "INSERT INTO notifications (id, agency_id, title, body, href, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .run(
      randomUUID(),
      input.agencyId,
      input.title,
      input.body,
      input.href ?? null,
      new Date().toISOString(),
    )
}

export function listNotifications(memberId: string, agencyId: string) {
  return getDb()
    .prepare(
      `SELECT n.id, n.title, n.body, n.href, n.created_at, r.read_at
       FROM notifications n
       LEFT JOIN notification_reads r
         ON r.notification_id = n.id AND r.member_id = ?
       WHERE n.agency_id = ?
       ORDER BY n.created_at DESC
       LIMIT 50`,
    )
    .all(memberId, agencyId) as {
    id: string
    title: string
    body: string
    href: string | null
    created_at: string
    read_at: string | null
  }[]
}

export function countUnread(memberId: string, agencyId: string) {
  const row = getDb()
    .prepare(
      `SELECT COUNT(*) AS n
       FROM notifications n
       LEFT JOIN notification_reads r
         ON r.notification_id = n.id AND r.member_id = ?
       WHERE n.agency_id = ? AND r.read_at IS NULL`,
    )
    .get(memberId, agencyId) as { n: number }
  return row.n
}

export function markNotificationsRead(memberId: string, agencyId: string) {
  const unread = getDb()
    .prepare(
      `SELECT n.id FROM notifications n
       LEFT JOIN notification_reads r
         ON r.notification_id = n.id AND r.member_id = ?
       WHERE n.agency_id = ? AND r.read_at IS NULL`,
    )
    .all(memberId, agencyId) as { id: string }[]
  const insert = getDb().prepare(
    "INSERT INTO notification_reads (notification_id, member_id, read_at) VALUES (?, ?, ?)",
  )
  const now = new Date().toISOString()
  for (const item of unread) insert.run(item.id, memberId, now)
}

export function listMembers(agencyId: string) {
  const rows = getDb()
    .prepare(
      "SELECT id, agency_id, name, email, password_hash, role, created_at FROM members WHERE agency_id = ? ORDER BY created_at ASC",
    )
    .all(agencyId) as {
    id: string
    agency_id: string
    name: string
    email: string
    password_hash: string
    role: string
    created_at: string
  }[]
  return rows.map((row) => ({
    id: row.id,
    agencyId: row.agency_id,
    name: row.name,
    email: row.email,
    role: (row.role === "inhaber" ? "inhaber" : "mitarbeiter") as MemberRole,
    createdAt: row.created_at,
  }))
}

export function listInvites(agencyId: string) {
  return getDb()
    .prepare(
      "SELECT token, email, role, created_at, accepted_at FROM member_invites WHERE agency_id = ? ORDER BY created_at DESC",
    )
    .all(agencyId) as {
    token: string
    email: string
    role: string
    created_at: string
    accepted_at: string | null
  }[]
}

export function createMemberInvite(input: {
  agencyId: string
  email: string
  role: MemberRole
}) {
  if (findMemberByEmail(input.email)) {
    return { ok: false as const, error: "Diese E-Mail ist schon vergeben." }
  }
  const open = getDb()
    .prepare(
      "SELECT token FROM member_invites WHERE agency_id = ? AND email = ? AND accepted_at IS NULL",
    )
    .get(input.agencyId, input.email) as { token: string } | undefined
  if (open) return { ok: true as const, token: open.token }
  const token = randomBytes(24).toString("base64url")
  getDb()
    .prepare(
      "INSERT INTO member_invites (token, agency_id, email, role, created_at, accepted_at) VALUES (?, ?, ?, ?, ?, NULL)",
    )
    .run(token, input.agencyId, input.email, input.role, new Date().toISOString())
  return { ok: true as const, token }
}

export function revokeInvite(agencyId: string, token: string) {
  getDb()
    .prepare(
      "DELETE FROM member_invites WHERE agency_id = ? AND token = ? AND accepted_at IS NULL",
    )
    .run(agencyId, token)
}

export function getOpenInvite(token: string) {
  const row = getDb()
    .prepare(
      `SELECT i.token, i.email, i.role, i.agency_id, a.name AS agency_name
       FROM member_invites i
       JOIN agencies a ON a.id = i.agency_id
       WHERE i.token = ? AND i.accepted_at IS NULL`,
    )
    .get(token) as
    | {
        token: string
        email: string
        role: string
        agency_id: string
        agency_name: string
      }
    | undefined
  if (!row) return null
  return {
    token: row.token,
    email: row.email,
    role: (row.role === "inhaber" ? "inhaber" : "mitarbeiter") as MemberRole,
    agencyId: row.agency_id,
    agencyName: row.agency_name,
  }
}

export function acceptMemberInvite(input: {
  token: string
  name: string
  password: string
}) {
  const invite = getOpenInvite(input.token)
  if (!invite) return { ok: false as const, error: "Diese Einladung ist nicht mehr gültig." }
  if (findMemberByEmail(invite.email)) {
    return { ok: false as const, error: "Diese E-Mail ist schon vergeben." }
  }
  const now = new Date().toISOString()
  const member: Member = {
    id: randomUUID(),
    agencyId: invite.agencyId,
    name: input.name,
    email: invite.email,
    role: invite.role,
    createdAt: now,
  }
  const db = getDb()
  db.exec("BEGIN")
  try {
    db.prepare(
      "INSERT INTO members (id, agency_id, name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).run(
      member.id,
      member.agencyId,
      member.name,
      member.email,
      hashPassword(input.password),
      member.role,
      member.createdAt,
    )
    db.prepare("UPDATE member_invites SET accepted_at = ? WHERE token = ?").run(now, input.token)
    db.exec("COMMIT")
  } catch (error) {
    db.exec("ROLLBACK")
    throw error
  }
  return { ok: true as const, member }
}

export function removeMember(input: { agencyId: string; memberId: string; actorId: string }) {
  if (input.memberId === input.actorId) {
    return { ok: false as const, error: "Sie können sich nicht selbst entfernen." }
  }
  const target = getDb()
    .prepare("SELECT role FROM members WHERE id = ? AND agency_id = ?")
    .get(input.memberId, input.agencyId) as { role: string } | undefined
  if (!target) return { ok: false as const, error: "Person nicht gefunden." }
  if (target.role === "inhaber") {
    const owners = getDb()
      .prepare("SELECT COUNT(*) AS n FROM members WHERE agency_id = ? AND role = 'inhaber'")
      .get(input.agencyId) as { n: number }
    if (owners.n <= 1) {
      return { ok: false as const, error: "Die letzte Inhaberin oder der letzte Inhaber bleibt." }
    }
  }
  const db = getDb()
  db.exec("BEGIN")
  try {
    db.prepare("UPDATE invitation_checks SET member_id = ? WHERE member_id = ?").run(
      input.actorId,
      input.memberId,
    )
    db.prepare("DELETE FROM notification_reads WHERE member_id = ?").run(input.memberId)
    db.prepare("DELETE FROM sessions WHERE member_id = ?").run(input.memberId)
    db.prepare("DELETE FROM members WHERE id = ? AND agency_id = ?").run(input.memberId, input.agencyId)
    db.exec("COMMIT")
  } catch (error) {
    db.exec("ROLLBACK")
    throw error
  }
  return { ok: true as const }
}

export function changePassword(input: {
  memberId: string
  currentPassword: string
  nextPassword: string
}) {
  const row = getDb()
    .prepare("SELECT password_hash FROM members WHERE id = ?")
    .get(input.memberId) as { password_hash: string } | undefined
  if (!row || !verifyPassword(input.currentPassword, row.password_hash)) {
    return { ok: false as const, error: "Das aktuelle Passwort stimmt nicht." }
  }
  getDb()
    .prepare("UPDATE members SET password_hash = ? WHERE id = ?")
    .run(hashPassword(input.nextPassword), input.memberId)
  return { ok: true as const }
}

export function updateAgencyProfile(input: {
  agencyId: string
  name: string
  email: string
}) {
  const taken = getDb()
    .prepare("SELECT id FROM agencies WHERE email = ? AND id <> ?")
    .get(input.email, input.agencyId) as { id: string } | undefined
  if (taken) return { ok: false as const, error: "Diese Einladungsadresse ist schon vergeben." }
  getDb()
    .prepare("UPDATE agencies SET name = ?, email = ? WHERE id = ?")
    .run(input.name, input.email, input.agencyId)
  return { ok: true as const }
}
