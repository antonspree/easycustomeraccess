import type { Metadata } from "next"
import Link from "next/link"
import { RefreshButton } from "@/components/refresh-button"
import { SetupDetail } from "@/components/setup-detail"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { requireAgency } from "@/lib/auth"
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
  const agency = await requireAgency()
  const customer = getCustomerForAgency(agency.id, id)
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
      {customer.setups.map((setup) => (
        <SetupDetail
          key={setup.id}
          setup={setup}
          origin={origin}
          vars={{
            customerEmail: customer.email,
            customerName: customer.name,
            agencyEmail: agency.email,
            agencyName: agency.name,
          }}
        />
      ))}
    </main>
  )
}
