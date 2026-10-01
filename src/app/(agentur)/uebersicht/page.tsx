import type { Metadata } from "next"
import Link from "next/link"
import { UsersIcon } from "lucide-react"
import { RefreshButton } from "@/components/refresh-button"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
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
  const customers = (await listCustomersForAgency(agency.id, archived)).filter((customer) => {
    if (!query) return true
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query)
    )
  })

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-12">
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
        <Empty>
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
        <div className="flex flex-col">
          {customers.map((customer) => (
            <article key={customer.id} className="flex flex-col gap-3 border-t py-8">
              <div className="flex flex-col gap-1">
                <Link href={`/kunden/${customer.id}`} className="font-heading text-2xl underline-offset-4 hover:underline">
                  {customer.name}
                </Link>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
              </div>
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
                  <div key={setup.id} className="flex flex-col gap-2 text-sm">
                    <p className="text-muted-foreground">
                      {progress.confirmed} von {progress.total} Schritten bestätigt
                    </p>
                    <p className="flex flex-wrap gap-x-6 gap-y-1 text-muted-foreground">
                      {progress.providers.map((provider) => (
                        <span key={provider.providerId}>
                          {provider.definition?.name ?? provider.providerId}
                          {" · "}
                          <StatusBadge status={provider.status} />
                        </span>
                      ))}
                    </p>
                    {invites.map((line) => (
                      <p key={`${line.providerId}-${line.stepId}`} className="text-muted-foreground">
                        {line.providerName}:{" "}
                        {line.state === "angenommen"
                          ? "Einladung angenommen"
                          : "Einladung noch nicht angenommen"}
                      </p>
                    ))}
                    {stuck ? <p>Kommt nicht weiter</p> : null}
                  </div>
                )
              })}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
