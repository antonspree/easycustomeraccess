import type { Metadata } from "next"
import { AgencyProfileForm, PasswordForm } from "@/components/agency-forms"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireSession } from "@/lib/auth"
import { getAdapter } from "@/lib/providers/adapter"
import { providers } from "@/lib/providers/catalog"

export const metadata: Metadata = { title: "Agentur" }
export const dynamic = "force-dynamic"

export default async function AgencySettingsPage() {
  const { agency, member } = await requireSession()
  const owner = member.role === "inhaber"

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-16 px-6 py-12">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl">Agentur</h1>
        <p className="text-sm text-muted-foreground">
          Angemeldet als {member.name} ({member.email}).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>
            Der Name erscheint für die Kundschaft. Die Einladungsadresse ist die Adresse, die bei den Anbietern eingetragen wird.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {owner ? (
            <AgencyProfileForm
              name={agency.name}
              email={agency.email}
              logoUrl={agency.logoUrl}
              bannerUrl={agency.bannerUrl}
            />
          ) : (
            <div className="flex flex-col gap-1 text-sm">
              <p>{agency.name}</p>
              <p className="text-muted-foreground">Einladungsadresse {agency.email}</p>
              <p className="text-muted-foreground">Ändern kann das die Inhaberin oder der Inhaber.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Passwort</CardTitle>
          <CardDescription>Gilt nur für Ihre eigene Anmeldung.</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Anbindungen</CardTitle>
          <CardDescription>
            Jeder Anbieter im Katalog hängt an einem Adapter. Heute führt jeder Adapter nur durch die Schritte.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {providers.map((provider) => {
            const adapter = getAdapter(provider.adapterId)
            return (
              <div key={provider.id} className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex flex-col">
                  <p className="font-medium">{provider.name}</p>
                  <p className="text-sm text-muted-foreground">Adapter {adapter.id}</p>
                </div>
                <Badge variant="outline">
                  {adapter.createsResources ? "Legt Ressourcen an" : "Nur Anleitung"}
                </Badge>
              </div>
            )
          })}
          <p className="text-sm text-muted-foreground">
            Ein späterer Adapter kann nach der vollständigen Bestätigung eine Organisation oder ein Projekt anlegen. Dafür braucht es dann Zugangsdaten des Anbieters. Diese Version speichert keine API-Schlüssel und erfindet keine externen Kennungen.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
