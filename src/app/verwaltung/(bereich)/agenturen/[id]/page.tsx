import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { StatusBadge } from "@/components/status-badge"
import { adminAgency } from "@/lib/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = { title: "Agentur" }
export const dynamic = "force-dynamic"

export default async function AdminAgencyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const agency = await adminAgency(id)
  if (!agency) notFound()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-12">
      <div className="flex flex-col gap-1">
        <Link href="/verwaltung" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          Alle Agenturen
        </Link>
        <h1 className="font-heading text-3xl">{agency.name}</h1>
        <p className="text-sm text-muted-foreground">
          Inhaber {agency.ownerEmail ?? "ohne E-Mail"} · Einladungsadresse {agency.email}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>Namen und E-Mails. Die Passwort-Prüfsumme bleibt in der Datenbank und wird nicht ausgelesen.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {agency.members.map((member) => (
            <div key={member.id} className="flex flex-wrap items-center gap-2 border-b pb-3 last:border-b-0 last:pb-0">
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.email}</p>
              <p className="text-sm">{member.role}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kunden und Einrichtungen</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {agency.customers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Keine Kunden.</p>
          ) : (
            agency.customers.map((customer) => (
              <div key={customer.id} className="flex flex-col gap-2 border-b pb-4 last:border-b-0 last:pb-0">
                <p className="font-medium">
                  {customer.name} <span className="font-normal text-muted-foreground">{customer.email}</span>
                  {customer.archived ? " · Archiv" : ""}
                </p>
                {customer.setups.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Keine Einrichtung.</p>
                ) : (
                  customer.setups.map((setup) => (
                    <div key={setup.id} className="flex flex-col gap-2">
                      <p className="text-sm">{setup.open ? "Offen" : "Fertig"}</p>
                      <div className="flex flex-wrap gap-2">
                        {setup.providers.map((provider) => (
                          <span key={provider.providerId} className="flex items-center gap-2">
                            <span className="text-sm">{provider.name}</span>
                            <span className="text-sm text-muted-foreground">·</span>
                            <StatusBadge status={provider.status} />
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
