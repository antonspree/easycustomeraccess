import type { Metadata } from "next"
import Link from "next/link"
import { adminOverview } from "@/lib/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = { title: "Verwaltung" }
export const dynamic = "force-dynamic"

export default async function AdminHomePage() {
  const data = await adminOverview()
  const figures = [
    { label: "Agenturen", value: data.agencyCount },
    { label: "Kunden", value: data.customerCount },
    { label: "Offene Einrichtungen", value: data.openSetupCount },
  ]
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6">
      <h1 className="font-heading text-3xl">Plattform</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        {figures.map((figure) => (
          <Card key={figure.label}>
            <CardHeader>
              <CardDescription>{figure.label}</CardDescription>
              <CardTitle className="text-3xl">{figure.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Agenturen</CardTitle>
          <CardDescription>Inhaber-E-Mail, Team und aktive Kunden. Passwörter bleiben Prüfsummen und werden hier nicht gezeigt.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {data.agencies.length === 0 ? (
            <p className="text-sm text-muted-foreground">Noch keine Agentur registriert.</p>
          ) : (
            data.agencies.map((agency) => (
              <div key={agency.id} className="flex flex-wrap items-center gap-3 border-b pb-3 last:border-b-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{agency.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Inhaber {agency.ownerEmail ?? "ohne E-Mail"} · Einladung {agency.email}
                  </p>
                </div>
                <p className="text-sm">{agency.memberCount} im Team</p>
                <p className="text-sm">{agency.customerCount} Kunden</p>
                <Link href={`/verwaltung/agenturen/${agency.id}`} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                  Öffnen
                </Link>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
