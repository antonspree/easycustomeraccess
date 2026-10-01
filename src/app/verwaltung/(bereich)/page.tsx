import type { Metadata } from "next"
import Link from "next/link"
import { adminOverview } from "@/lib/admin"

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
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-12">
      <h1 className="font-heading text-4xl">Plattform</h1>
      <dl className="grid gap-10 sm:grid-cols-3">
        {figures.map((figure) => (
          <div key={figure.label} className="flex flex-col gap-2">
            <dt className="text-sm text-muted-foreground">{figure.label}</dt>
            <dd className="font-heading text-4xl">{figure.value}</dd>
          </div>
        ))}
      </dl>
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-2xl">Agenturen</h2>
          <p className="text-sm text-muted-foreground">
            Inhaber-E-Mail, Team und aktive Kunden. Passwörter bleiben Prüfsummen und werden hier nicht gezeigt.
          </p>
        </div>
        {data.agencies.length === 0 ? (
          <p className="text-sm text-muted-foreground">Noch keine Agentur registriert.</p>
        ) : (
          <div className="flex flex-col">
            {data.agencies.map((agency) => (
              <div key={agency.id} className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t py-6">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{agency.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Inhaber {agency.ownerEmail ?? "ohne E-Mail"} · Einladung {agency.email}
                  </p>
                </div>
                <p className="text-sm">{agency.memberCount} im Team</p>
                <p className="text-sm">{agency.customerCount} Kunden</p>
                <Link href={`/verwaltung/agenturen/${agency.id}`} className="text-sm underline underline-offset-4">
                  Öffnen
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
