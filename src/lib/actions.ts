"use server"

import { redirect } from "next/navigation"
import { clearSession, requireSession, setSession } from "@/lib/auth"
import { authenticate, confirmStep, createCustomer, deleteCustomer, knownProviderIds, registerAgency, updateAgencyName, updateCustomer, validCustomerEmail } from "@/lib/db"
import { ratePassword } from "@/lib/password-strength"
import { cleanName, isEmail, normalizeEmail } from "@/lib/text"

export type FormState = { error?: string }

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = cleanName(String(formData.get("name") ?? ""))
  if (!name.ok) return { error: name.error }
  const email = normalizeEmail(String(formData.get("email") ?? ""))
  if (!isEmail(email)) return { error: "Bitte eine gültige E-Mail eintragen." }
  const password = String(formData.get("password") ?? "")
  const rating = ratePassword(password, { email, name: name.name })
  if (!rating.accepted) return { error: rating.hint }
  const created = await registerAgency({ name: name.name, email, password })
  if (!created.ok) return { error: created.error }
  await setSession(created.id)
  redirect("/uebersicht")
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""))
  const password = String(formData.get("password") ?? "")
  const agency = await authenticate(email, password)
  if (!agency) return { error: "Anmeldung fehlgeschlagen." }
  await setSession(agency.id)
  redirect("/uebersicht")
}

export async function logoutAction() {
  await clearSession()
  redirect("/")
}

export async function createCustomerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const agency = await requireSession()
  const name = cleanName(String(formData.get("name") ?? ""))
  if (!name.ok) return { error: name.error }
  const email = validCustomerEmail(String(formData.get("email") ?? ""))
  if (!email.ok) return { error: email.error }
  const providerIds = knownProviderIds(formData.getAll("providerId").map(String))
  const created = await createCustomer({
    agencyId: agency.id,
    name: name.name,
    email: email.email,
    providerIds,
  })
  if (!created.ok) return { error: created.error }
  redirect(`/kunden/${created.customerId}`)
}

export async function updateAgencyAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const agency = await requireSession()
  const name = cleanName(String(formData.get("name") ?? ""))
  if (!name.ok) return { error: name.error }
  await updateAgencyName(agency.id, name.name)
  redirect("/einstellungen")
}

export async function confirmStepAction(formData: FormData) {
  const token = String(formData.get("token") ?? "")
  const providerId = String(formData.get("providerId") ?? "")
  const stepId = String(formData.get("stepId") ?? "")
  const result = await confirmStep({ token, providerId, stepId })
  redirect(result.ok ? `/einrichten/${token}` : `/einrichten/${token}?hinweis=1`)
}

export async function updateCustomerAction(
  customerId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const agency = await requireSession()
  const name = cleanName(String(formData.get("name") ?? ""))
  if (!name.ok) return { error: name.error }
  const email = validCustomerEmail(String(formData.get("email") ?? ""))
  if (!email.ok) return { error: email.error }
  const providerIds = knownProviderIds(formData.getAll("providerId").map(String))
  const result = await updateCustomer({
    agencyId: agency.id,
    customerId,
    name: name.name,
    email: email.email,
    providerIds,
  })
  if (!result.ok) return { error: result.error }
  redirect(`/kunden/${customerId}`)
}

export async function deleteCustomerAction(customerId: string) {
  const agency = await requireSession()
  const result = await deleteCustomer(agency.id, customerId)
  if (!result.ok) throw new Error(result.error)
  redirect("/uebersicht")
}
