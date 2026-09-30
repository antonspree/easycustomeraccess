"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { afterConsent } from "@/lib/providers/adapter"
import { getProvider } from "@/lib/providers/catalog"
import { findNextStep, progressForProvider } from "@/lib/providers/status"
import { isEmail, normalizeEmail } from "@/lib/text"
import {
  clearSessionCookie,
  requireAgency,
  setSessionCookie,
} from "@/lib/auth"
import {
  authenticateAgency,
  confirmStep,
  createAgency,
  createCustomerWithSetup,
  createSession,
  getSetupByToken,
} from "@/lib/db"

export type FormState = { error?: string }

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

  const created = createAgency({
    name: agencyName.name,
    email,
    password,
  })
  if (!created.ok) return { error: created.error }
  const session = createSession(created.agency.id)
  await setSessionCookie(session.token)
  redirect("/uebersicht")
}

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""))
  const password = String(formData.get("password") ?? "")
  const agency = authenticateAgency(email, password)
  if (!agency) return { error: "E-Mail oder Passwort ist nicht richtig." }
  const session = createSession(agency.id)
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
  const agency = await requireAgency()
  const customerName = cleanName(formData.get("customerName"), "Der Kundenname", 120)
  if (!customerName.ok) return { error: customerName.error }
  const email = normalizeEmail(String(formData.get("email") ?? ""))
  if (!isEmail(email)) {
    return { error: "Bitte eine gültige E-Mail-Adresse des Kunden eintragen." }
  }
  const providerIds = formData.getAll("providerId").map(String)
  const created = createCustomerWithSetup({
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
  const loaded = getSetupByToken(token)
  if (!loaded) return { error: "Dieser Link ist ungültig." }

  const next = findNextStep({ providers: loaded.setup.providers })
  if (!next || next.definition.id !== providerId || next.step.id !== stepId) {
    return { error: "Dieser Schritt ist gerade nicht an der Reihe." }
  }

  const saved = confirmStep({
    setupId: loaded.setup.id,
    agencyId: loaded.setup.agencyId,
    providerId,
    stepId,
    confirmedEmail: loaded.customer.email,
  })
  if (!saved.ok) return { error: saved.error }

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
    const definition = getProvider(providerId)
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
  redirect(`/einrichten/${token}`)
}
