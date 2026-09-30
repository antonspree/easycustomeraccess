import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { RegisterForm } from "@/components/auth-forms"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { readSession } from "@/lib/auth"

export const metadata: Metadata = { title: "Agentur registrieren" }

export default async function RegisterPage() {
  if (await readSession()) redirect("/uebersicht")

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Agentur registrieren</CardTitle>
          <CardDescription>
            Die Anmeldung gilt nur für diese Agentur. Kunden melden sich hier nicht an.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </main>
  )
}
