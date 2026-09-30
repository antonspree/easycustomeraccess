import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AdminLoginForm } from "@/components/admin-login-form"
import { adminConfigured, readAdmin } from "@/lib/admin-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = { title: "Verwaltung" }

export default async function AdminLoginPage() {
  if (await readAdmin()) redirect("/verwaltung")
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center gap-4 px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Verwaltung</CardTitle>
          <CardDescription>
            Plattformzugang, getrennt von den Agenturen. Agenturkonten sehen diesen Bereich nicht.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {adminConfigured() ? null : (
            <p className="text-sm text-muted-foreground">
              Die Anmeldung wartet auf ADMIN_EMAIL und ADMIN_PASSWORD in der Umgebung des Hosts. Es liegt kein Passwort im Projekt.
            </p>
          )}
          <AdminLoginForm />
        </CardContent>
      </Card>
    </main>
  )
}
