import type { Metadata } from "next"
import Link from "next/link"
import { UsersIcon } from "lucide-react"
import { RefreshButton } from "@/components/refresh-button"
import { StatusBadge } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
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
import { Input } from "@/components/ui/input"
import { requireSession } from "@/lib/auth"
import { listCustomersForAgency } from "@/lib/db"
import { inviteLines } from "@/lib/invitations"
import { setupProgress } from "@/lib/providers/status"

export const metadata: Metadata = { title: "Übersicht" }
export const dynamic = "force-dynamic"

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; archiv?: string }>
}) {
  const { agency } = await requireSession()
  const params = await searchParams
  const archived = params.archiv === "1"
  const query = (params.q ?? "").trim().toLowerCase()
  const customers = listCustomersForAgency(agency.id, archived).filter((customer) => {
    if (!query) return true
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query)
    )
  })

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl">
            {archived ? "Archiv" : "Kunden"} von {agency.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Andere Agenturen sehen diese Liste nicht. Der Stand aktualisiert sich, wenn der Kunde einen Schritt bestätigt.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <RefreshButton />
          <Button
            variant="outline"
            render={<Link href={archived ? "/uebersicht" : "/uebersicht?archiv=1"} />}
          >
            {archived ? "Aktive Kunden" : "Archiv"}
          </Button>
          <Button render={<Link href="/kunden/neu" />}>Neuer Kunde</Button>
        </div>
      </div>

      <form action="/uebersicht" className="flex flex-col gap-2 sm:flex-row">
        {archived ? <input type="hidden" name="archiv" value="1" /> : null}
        <Input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Name oder E-Mail"
          aria-label="Kunden suchen"
        />
        <Button type="submit" variant="outline">
          Suchen
        </Button>
      </form>

      {customers.length === 0 ? (
        <Empty className="border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UsersIcon />
            </EmptyMedia>
            <EmptyTitle>
              {query ? "Kein Treffer" : archived ? "Archiv ist leer" : "Noch keine Kunden"}
            </EmptyTitle>
            <EmptyDescription>
              {query
                ? `Nichts passt auf „${params.q?.trim()}“.`
                : archived
                  ? "Archivierte Kunden erscheinen hier, sobald eine Inhaberin oder ein Inhaber sie ablegt."
                  : "Legen Sie eine Kundin oder einen Kunden an und wählen Sie die Anbieter, deren Konten auf deren Namen laufen sollen."}
            </EmptyDescription>
          </EmptyHeader>
          {!archived && !query ? (
            <EmptyContent>
              <Button render={<Link href="/kunden/neu" />}>Ersten Kunden anlegen</Button>
            </EmptyContent>
          ) : null}
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
                  const invites = inviteLines({
                    providers: setup.providers,
                    invitations: setup.invitations,
                  })
                  const stuck = setup.blocks.some((block) => !block.resolvedAt)
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
                      <div className="flex flex-wrap gap-2">
                        {invites.map((line) => (
                          <Badge
                            key={`${line.providerId}-${line.stepId}`}
                            variant={line.state === "angenommen" ? "secondary" : "outline"}
                          >
                            {line.providerName}:{" "}
                            {line.state === "angenommen"
                              ? "Einladung angenommen"
                              : "Einladung noch nicht angenommen"}
                          </Badge>
                        ))}
                        {stuck ? <Badge variant="destructive">Kommt nicht weiter</Badge> : null}
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
