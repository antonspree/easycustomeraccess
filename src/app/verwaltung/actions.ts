"use server"

import { redirect } from "next/navigation"
import {
  adminConfigured,
  adminCredentialsMatch,
  clearAdminCookie,
  setAdminCookie,
} from "@/lib/admin-auth"
import { normalizeEmail } from "@/lib/text"

export async function adminLoginAction(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  if (!adminConfigured()) {
    return { error: "Die Verwaltung wartet auf ADMIN_EMAIL und ADMIN_PASSWORD in der Umgebung." }
  }
  const email = normalizeEmail(String(formData.get("email") ?? ""))
  const password = String(formData.get("password") ?? "")
  if (!adminCredentialsMatch(email, password)) {
    return { error: "Anmeldung fehlgeschlagen." }
  }
  await setAdminCookie()
  redirect("/verwaltung")
}

export async function adminLogoutAction() {
  await clearAdminCookie()
  redirect("/verwaltung/anmelden")
}
