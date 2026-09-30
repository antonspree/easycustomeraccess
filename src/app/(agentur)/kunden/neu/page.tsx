import type { Metadata } from "next"
import { CreateSetupForm } from "@/components/create-setup-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireSession } from "@/lib/auth"

export const metadata: Metadata = { title: "Neuer Kunde" }

export default async function NewCustomerPage() {
  const { agency } = await requireSession()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Kunde und Einrichtung</CardTitle>
          <CardDescription>
            Das Konto gehört {agency.name} nicht. Die Person nutzt die eigene E-Mail und lädt {agency.email} ein.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateSetupForm agencyEmail={agency.email} />
        </CardContent>
      </Card>
    </div>
  )
}
