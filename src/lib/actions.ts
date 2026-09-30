"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { afterConsent } from "@/lib/providers/adapter"
import { getProvider } from "@/lib/providers/catalog"
import { findNextStep, progressForProvider } from "@/lib/providers/status"
import { isEmail, normalizeEmail } from "@/lib/text"
import {
  clearSessionCookie,
  requireSession,
  setSessionCookie,
} from "@/lib/auth"
import {
  authenticateMember,
  confirmStep,
  createAgency,
  createCustomerWithSetup,
  createSession,
  getCustomerForAgency,
  getSetupByToken,
  type MemberRole,
} from "@/lib/db"
import {
  acceptInvitation,
  acceptMemberInvite,
  addProvidersToSetup,
  blockStep,
  changePassword,
  createAnotherSetup,
  createMemberInvite,
  notifyAgency,
  removeMember,
  renameCustomer,
  resolveBlock,
  revokeInvite,
  setCustomerArchived,
  updateAgencyProfile,
} from "@/lib/workspace"

export type FormState = { error?: string; saved?: string }

function cleanName(
  value: FormDataEntryValue | null,
  label: string,
  max: number,
): { ok: true; name: string } | { ok: false; error: string } {
  const name = String(value ?? "").trim().replace(/\s+/g, " ")
  if (name.length < 2) {
    return { ok: false, error: `${label} braucht mindestens 2 Zeichen.` }
  }
  if (name.length > max) return { ok: false, error: `${label} ist zu lang.` }
  return { ok: true, name }
}

function ownerGuard(role: MemberRole) {
  if (role !== "inhaber") {
    return "Nur die Inhaberin oder der Inhaber darf das."
  }
  return null
}

export async function registerAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const agencyName = cleanName(formData.get("agencyName"), "Der Agenturname", 80)
  if (!agencyName.ok) return { error: agencyName.error }
  const email = normalizeEmail(String(formData.get("email") ?? ""))
  if (!isEmail(email)) return { error: "Bitte eine gültige E-Mail-Adresse eintragen." }
  const password = String(formData.get("password") ?? "")
  const passwordAgain = String(formData.get("passwordAgain") ?? "")
  if (password.length < 8) {
    return { error: "Das Passwort braucht mindestens 8 Zeichen." }
  }
  if (password !== passwordAgain) {
    return { error: "Die Passwörter stimmen nicht überein." }
  }

  const created = await createAgency({
    name: agencyName.name,
    email,
    password,
  })
  if (!created.ok) return { error: created.error }
  const session = await createSession(created.member.id, created.agency.id)
  await setSessionCookie(session.token)
  redirect("/uebersicht")
}

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""))
  const password = String(formData.get("password") ?? "")
  const found = await authenticateMember(email, password)
  if (!found) return { error: "E-Mail oder Passwort ist nicht richtig." }
  const session = await createSession(found.member.id, found.agency.id)
  await setSessionCookie(session.token)
  redirect("/uebersicht")
}

export async function logoutAction() {
  await clearSessionCookie()
  redirect("/anmelden")
}

export async function createSetupAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { agency } = await requireSession()
  const customerName = cleanName(formData.get("customerName"), "Der Kundenname", 120)
  if (!customerName.ok) return { error: customerName.error }
  const email = normalizeEmail(String(formData.get("email") ?? ""))
  if (!isEmail(email)) {
    return { error: "Bitte eine gültige E-Mail-Adresse des Kunden eintragen." }
  }
  const providerIds = formData.getAll("providerId").map(String)
  const created = await createCustomerWithSetup({
    agencyId: agency.id,
    name: customerName.name,
    email,
    providerIds,
  })
  if (!created.ok) return { error: created.error }
  revalidatePath("/uebersicht")
  redirect(`/kunden/${created.customer.id}`)
}

export async function confirmStepAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const token = String(formData.get("token") ?? "")
  const providerId = String(formData.get("providerId") ?? "")
  const stepId = String(formData.get("stepId") ?? "")
  const loaded = await getSetupByToken(token)
  if (!loaded) return { error: "Dieser Link ist ungültig." }

  const next = findNextStep({ providers: loaded.setup.providers })
  if (!next || next.definition.id !== providerId || next.step.id !== stepId) {
    return { error: "Dieser Schritt ist gerade nicht an der Reihe." }
  }

  const saved = await confirmStep({
    setupId: loaded.setup.id,
    agencyId: loaded.setup.agencyId,
    providerId,
    stepId,
    confirmedEmail: loaded.customer.email,
  })
  if (!saved.ok) return { error: saved.error }

  await resolveBlock({ setupId: loaded.setup.id, providerId, stepId })

  const definition = getProvider(providerId)
  const providerName = definition?.name ?? providerId
  await notifyAgency({
    agencyId: loaded.setup.agencyId,
    title: `${loaded.customer.name}: Schritt bestätigt`,
    body: `${providerName}: ${next.step.title}. Bestätigt als ${loaded.customer.email}.`,
    href: `/kunden/${loaded.customer.id}`,
  })

  const progress = progressForProvider({
    providerId,
    opened: true,
    confirmations: [
      ...next.provider.confirmations,
      {
        providerId,
        stepId,
        confirmedEmail: loaded.customer.email,
        confirmedAt: new Date().toISOString(),
      },
    ],
  })
  if (progress.status === "fertig") {
    await notifyAgency({
      agencyId: loaded.setup.agencyId,
      title: `${loaded.customer.name}: ${providerName} ist fertig`,
      body: `Alle Schritte sind mit ${loaded.customer.email} bestätigt.`,
      href: `/kunden/${loaded.customer.id}`,
    })
    if (definition) {
      await afterConsent(definition.adapterId, {
        providerId,
        customer: { name: loaded.customer.name, email: loaded.customer.email },
        agency: { name: loaded.agency.name, email: loaded.agency.email },
        confirmedEmail: loaded.customer.email,
        confirmedAt: new Date().toISOString(),
      })
    }
  }

  revalidatePath(`/einrichten/${token}`)
  revalidatePath("/uebersicht")
  revalidatePath(`/kunden/${loaded.customer.id}`)
  revalidatePath("/benachrichtigungen")
  redirect(`/einrichten/${token}`)
}

export async function blockStepAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const token = String(formData.get("token") ?? "")
  const providerId = String(formData.get("providerId") ?? "")
  const stepId = String(formData.get("stepId") ?? "")
  const note = String(formData.get("note") ?? "").trim().replace(/\s+/g, " ")
  if (note.length < 4) {
    return { error: "Beschreiben Sie kurz, wo es hakt." }
  }
  if (note.length > 500) return { error: "Die Notiz ist zu lang." }

  const loaded = await getSetupByToken(token)
  if (!loaded) return { error: "Dieser Link ist ungültig." }
  const next = findNextStep({ providers: loaded.setup.providers })
  if (!next || next.definition.id !== providerId || next.step.id !== stepId) {
    return { error: "Dieser Schritt ist gerade nicht an der Reihe." }
  }

  await blockStep({
    setupId: loaded.setup.id,
    providerId,
    stepId,
    note,
  })
  await notifyAgency({
    agencyId: loaded.setup.agencyId,
    title: `${loaded.customer.name} kommt nicht weiter`,
    body: `${next.definition.name}, ${next.step.title}: ${note}`,
    href: `/kunden/${loaded.customer.id}`,
  })
  revalidatePath(`/einrichten/${token}`)
  revalidatePath(`/kunden/${loaded.customer.id}`)
  revalidatePath("/uebersicht")
  revalidatePath("/benachrichtigungen")
  redirect(`/einrichten/${token}`)
}

export async function renameCustomerAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { agency } = await requireSession()
  const customerId = String(formData.get("customerId") ?? "")
  const name = cleanName(formData.get("name"), "Der Name", 120)
  if (!name.ok) return { error: name.error }
  const saved = await renameCustomer({ agencyId: agency.id, customerId, name: name.name })
  if (!saved.ok) return { error: saved.error }
  revalidatePath(`/kunden/${customerId}`)
  revalidatePath("/uebersicht")
  return { saved: "Name gespeichert." }
}

export async function archiveCustomerAction(formData: FormData) {
  const { agency, member } = await requireSession()
  const denied = ownerGuard(member.role)
  if (denied) redirect("/uebersicht")
  const customerId = String(formData.get("customerId") ?? "")
  const archived = String(formData.get("archived") ?? "") === "1"
  await setCustomerArchived({ agencyId: agency.id, customerId, archived })
  revalidatePath("/uebersicht")
  revalidatePath(`/kunden/${customerId}`)
  redirect(archived ? "/uebersicht?archiv=1" : `/kunden/${customerId}`)
}

export async function addProvidersAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { agency } = await requireSession()
  const setupId = String(formData.get("setupId") ?? "")
  const customerId = String(formData.get("customerId") ?? "")
  const customer = await getCustomerForAgency(agency.id, customerId)
  if (!customer || customer.archivedAt || !customer.setups.some((setup) => setup.id === setupId)) {
    return { error: "Diese Einrichtung lässt sich nicht erweitern." }
  }
  const saved = await addProvidersToSetup({
    agencyId: agency.id,
    setupId,
    providerIds: formData.getAll("providerId").map(String),
  })
  if (!saved.ok) return { error: saved.error }
  revalidatePath(`/kunden/${customerId}`)
  revalidatePath("/uebersicht")
  redirect(`/kunden/${customerId}`)
}

export async function anotherSetupAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { agency } = await requireSession()
  const customerId = String(formData.get("customerId") ?? "")
  const saved = await createAnotherSetup({
    agencyId: agency.id,
    customerId,
    providerIds: formData.getAll("providerId").map(String),
  })
  if (!saved.ok) return { error: saved.error }
  revalidatePath(`/kunden/${customerId}`)
  revalidatePath("/uebersicht")
  redirect(`/kunden/${customerId}`)
}

export async function acceptInvitationAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { agency, member } = await requireSession()
  const customerId = String(formData.get("customerId") ?? "")
  const saved = await acceptInvitation({
    setupId: String(formData.get("setupId") ?? ""),
    agencyId: agency.id,
    providerId: String(formData.get("providerId") ?? ""),
    stepId: String(formData.get("stepId") ?? ""),
    memberId: member.id,
  })
  if (!saved.ok) return { error: saved.error }
  revalidatePath(`/kunden/${customerId}`)
  revalidatePath("/uebersicht")
  return { saved: "Einladung als angenommen gespeichert." }
}

export async function resolveBlockAction(formData: FormData) {
  const { agency } = await requireSession()
  const customerId = String(formData.get("customerId") ?? "")
  const setupId = String(formData.get("setupId") ?? "")
  const customer = await getCustomerForAgency(agency.id, customerId)
  if (!customer?.setups.some((setup) => setup.id === setupId)) redirect("/uebersicht")
  await resolveBlock({
    setupId,
    providerId: String(formData.get("providerId") ?? ""),
    stepId: String(formData.get("stepId") ?? ""),
  })
  revalidatePath(`/kunden/${customerId}`)
  revalidatePath("/uebersicht")
  redirect(`/kunden/${customerId}`)
}

export async function inviteMemberAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { agency, member } = await requireSession()
  const denied = ownerGuard(member.role)
  if (denied) return { error: denied }
  const email = normalizeEmail(String(formData.get("email") ?? ""))
  if (!isEmail(email)) return { error: "Bitte eine gültige E-Mail-Adresse eintragen." }
  const created = await createMemberInvite({
    agencyId: agency.id,
    email,
    role: "mitarbeiter",
  })
  if (!created.ok) return { error: created.error }
  revalidatePath("/team")
  redirect("/team")
}

export async function revokeInviteAction(formData: FormData) {
  const { agency, member } = await requireSession()
  if (ownerGuard(member.role)) redirect("/team")
  await revokeInvite(agency.id, String(formData.get("token") ?? ""))
  revalidatePath("/team")
  redirect("/team")
}

export async function removeMemberAction(formData: FormData) {
  const { agency, member } = await requireSession()
  if (ownerGuard(member.role)) redirect("/team")
  await removeMember({
    agencyId: agency.id,
    memberId: String(formData.get("memberId") ?? ""),
    actorId: member.id,
  })
  revalidatePath("/team")
  redirect("/team")
}

export async function acceptTeamInviteAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = cleanName(formData.get("name"), "Der Name", 80)
  if (!name.ok) return { error: name.error }
  const password = String(formData.get("password") ?? "")
  const passwordAgain = String(formData.get("passwordAgain") ?? "")
  if (password.length < 8) {
    return { error: "Das Passwort braucht mindestens 8 Zeichen." }
  }
  if (password !== passwordAgain) {
    return { error: "Die Passwörter stimmen nicht überein." }
  }
  const token = String(formData.get("token") ?? "")
  const accepted = await acceptMemberInvite({ token, name: name.name, password })
  if (!accepted.ok) return { error: accepted.error }
  await notifyAgency({
    agencyId: accepted.member.agencyId,
    title: `${accepted.member.name} ist im Team`,
    body: `${accepted.member.email} hat die Einladung angenommen.`,
    href: "/team",
  })
  const session = await createSession(accepted.member.id, accepted.member.agencyId)
  await setSessionCookie(session.token)
  revalidatePath("/team")
  revalidatePath("/benachrichtigungen")
  redirect("/uebersicht")
}

export async function changePasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { member } = await requireSession()
  const currentPassword = String(formData.get("currentPassword") ?? "")
  const nextPassword = String(formData.get("nextPassword") ?? "")
  const again = String(formData.get("passwordAgain") ?? "")
  if (nextPassword.length < 8) {
    return { error: "Das neue Passwort braucht mindestens 8 Zeichen." }
  }
  if (nextPassword !== again) {
    return { error: "Die Passwörter stimmen nicht überein." }
  }
  const saved = await changePassword({
    memberId: member.id,
    currentPassword,
    nextPassword,
  })
  if (!saved.ok) return { error: saved.error }
  return { saved: "Passwort gespeichert." }
}

export async function updateAgencyProfileAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { agency, member } = await requireSession()
  const denied = ownerGuard(member.role)
  if (denied) return { error: denied }
  const name = cleanName(formData.get("name"), "Der Agenturname", 80)
  if (!name.ok) return { error: name.error }
  const email = normalizeEmail(String(formData.get("email") ?? ""))
  if (!isEmail(email)) return { error: "Bitte eine gültige Einladungsadresse eintragen." }
  const saved = await updateAgencyProfile({ agencyId: agency.id, name: name.name, email })
  if (!saved.ok) return { error: saved.error }
  revalidatePath("/agentur")
  revalidatePath("/uebersicht")
  return { saved: "Agentur gespeichert." }
}
