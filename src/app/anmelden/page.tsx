import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { readSession } from "@/lib/auth"

export const metadata: Metadata = { title: "Anmelden" }

export default async function LoginPage() {
  if (await readSession()) redirect("/uebersicht")
  return <LoginForm />
}
