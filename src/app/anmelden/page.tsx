import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth-forms"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { readAgency } from "@/lib/auth"

export const metadata: Metadata = { title: "Anmelden" }

export default async function LoginPage() {
  if (await readAgency()) redirect("/uebersicht")

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Anmelden</CardTitle>
          <CardDescription>Mit der E-Mail und dem Passwort Ihrer Agentur.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  )
}
