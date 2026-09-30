import type { Metadata } from "next"
import Link from "next/link"
import { AddProvidersForm, AnotherSetupForm, RenameCustomerForm } from "@/components/agency-forms"
import { RefreshButton } from "@/components/refresh-button"
import { SetupDetail } from "@/components/setup-detail"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { archiveCustomerAction } from "@/lib/actions"
import { requireSession } from "@/lib/auth"
import { getCustomerForAgency } from "@/lib/db"
import { publicOrigin } from "@/lib/origin"

export const metadata: Metadata = { title: "Kunde" }
export const dynamic = "force-dynamic"

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { agency, member } = await requireSession()
  const customer = await getCustomerForAgency(agency.id, id)
  if (!customer) {
    return (
      <main className="mx-auto flex w-full max-w-3xl px-4 py-8">
        <Empty className="border bg-card">
          <EmptyHeader>
            <EmptyTitle>Kunde nicht gefunden</EmptyTitle>
            <EmptyDescription>
              Dieser Kunde gehört nicht zu Ihrer Agentur oder der Link ist veraltet.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button render={<Link href="/uebersicht" />}>Zur Übersicht</Button>
          </EmptyContent>
        </Empty>
      </main>
    )
  }
  const origin = await publicOrigin()
  const vars = {
    customerEmail: customer.email,
    customerName: customer.name,
    agencyEmail: agency.email,
    agencyName: agency.name,
  }
  const owner = member.role === "inhaber"

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl">{customer.name}</h1>
          <p className="text-muted-foreground">{customer.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <RefreshButton />
          <Button variant="outline" render={<Link href="/uebersicht" />}>
            Zur Übersicht
          </Button>
        </div>
      </div>

      {customer.archivedAt ? (
        <Alert>
          <AlertTitle>Im Archiv</AlertTitle>
          <AlertDescription>
            Neue Einrichtungen und Anbieter sind pausiert. Der bestehende Link bleibt gültig.
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Kunde</CardTitle>
          <CardDescription>
            Die E-Mail bleibt die Adresse, mit der die Schritte bestätigt werden.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <RenameCustomerForm customerId={customer.id} name={customer.name} />
          {owner ? (
            <form action={archiveCustomerAction}>
              <input type="hidden" name="customerId" value={customer.id} />
              <input type="hidden" name="archived" value={customer.archivedAt ? "0" : "1"} />
              <Button type="submit" variant="outline">
                {customer.archivedAt ? "Wiederherstellen" : "Archivieren"}
              </Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">
              Archivieren kann die Inhaberin oder der Inhaber.
            </p>
          )}
        </CardContent>
      </Card>

      {customer.setups.map((setup, index) => (
        <div key={setup.id} className="flex flex-col gap-4">
          <SetupDetail setup={setup} origin={origin} customerId={customer.id} vars={vars} />
          {!customer.archivedAt ? (
            <Card>
              <CardHeader>
                <CardTitle>Anbieter ergänzen</CardTitle>
                <CardDescription>
                  Einrichtung {index + 1}. Der bisherige Link deckt die neuen Schritte mit ab.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddProvidersForm
                  setupId={setup.id}
                  customerId={customer.id}
                  excludeIds={setup.providers.map((provider) => provider.providerId)}
                />
              </CardContent>
            </Card>
          ) : null}
        </div>
      ))}

      {!customer.archivedAt ? (
        <Card>
          <CardHeader>
            <CardTitle>Weitere Einrichtung</CardTitle>
            <CardDescription>
              Ein eigener Link, wenn später ein zweites Projekt dazukommt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnotherSetupForm customerId={customer.id} />
          </CardContent>
        </Card>
      ) : null}
    </main>
  )
}
