import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AdminLoginForm } from "@/components/admin-login-form"
import { adminConfigured, readAdmin } from "@/lib/admin-auth"

export const metadata: Metadata = { title: "Verwaltung" }

export default async function AdminLoginPage() {
  if (await readAdmin()) redirect("/verwaltung")
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-10 px-6 py-16">
      <div className="flex flex-col gap-2">
        <p className="text-sm">EasyCustomerAccess</p>
        <h1 className="font-heading text-4xl">Verwaltung</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Plattformzugang, getrennt von den Agenturen. Agenturkonten sehen diesen Bereich nicht.
        </p>
      </div>
      {adminConfigured() ? null : (
        <p className="text-sm text-muted-foreground">
          Die Anmeldung wartet auf ADMIN_EMAIL und ADMIN_PASSWORD in der Umgebung des Hosts. Es liegt kein Passwort im Projekt.
        </p>
      )}
      <AdminLoginForm />
    </main>
  )
}
