import type { Metadata } from "next"
import Link from "next/link"
import { UsersIcon } from "lucide-react"
import { RefreshButton } from "@/components/refresh-button"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { requireAgency } from "@/lib/auth"
import { listCustomersForAgency } from "@/lib/db"
import { setupProgress } from "@/lib/providers/status"

export const metadata: Metadata = { title: "Übersicht" }
export const dynamic = "force-dynamic"

export default async function OverviewPage() {
  const agency = await requireAgency()
  const customers = listCustomersForAgency(agency.id)

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl">Kunden von {agency.name}</h1>
          <p className="text-sm text-muted-foreground">
            Andere Agenturen sehen diese Liste nicht. Der Stand aktualisiert sich, wenn der Kunde einen Schritt bestätigt.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <RefreshButton />
          <Button render={<Link href="/kunden/neu" />}>Neuer Kunde</Button>
        </div>
      </div>

      {customers.length === 0 ? (
        <Empty className="border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UsersIcon />
            </EmptyMedia>
            <EmptyTitle>Noch keine Kunden</EmptyTitle>
            <EmptyDescription>
              Legen Sie eine Kundin oder einen Kunden an und wählen Sie die Anbieter, deren Konten auf deren Namen laufen sollen.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button render={<Link href="/kunden/neu" />}>Ersten Kunden anlegen</Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          {customers.map((customer) => (
            <Card key={customer.id}>
              <CardHeader>
                <CardTitle>
                  <Link href={`/kunden/${customer.id}`} className="underline-offset-4 hover:underline">
                    {customer.name}
                  </Link>
                </CardTitle>
                <CardDescription>{customer.email}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {customer.setups.map((setup) => {
                  const progress = setupProgress({
                    opened: Boolean(setup.openedAt),
                    providers: setup.providers,
                  })
                  return (
                    <div key={setup.id} className="flex flex-col gap-2">
                      <p className="text-sm text-muted-foreground">
                        {progress.confirmed} von {progress.total} Schritten bestätigt
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {progress.providers.map((provider) => (
                          <span key={provider.providerId} className="flex items-center gap-2">
                            <span className="text-sm">{provider.definition?.name ?? provider.providerId}</span>
                            <StatusBadge status={provider.status} />
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
