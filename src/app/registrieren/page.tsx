import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { RegisterForm } from "@/components/login-form"
import { readSession } from "@/lib/auth"

export const metadata: Metadata = { title: "Agentur registrieren" }

export default async function RegisterPage() {
  if (await readSession()) redirect("/uebersicht")
  return <RegisterForm />
}
