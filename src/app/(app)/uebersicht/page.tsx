import type { Metadata } from "next"
import Link from "next/link"
import { ButtonLink } from "@/components/button"
import { Column } from "@/components/frame"
import { requireSession } from "@/lib/auth"
import { listCustomers } from "@/lib/db"
import { openLabel } from "@/lib/progress"

export const metadata: Metadata = { title: "Übersicht" }
export const dynamic = "force-dynamic"

export default async function OverviewPage() {
  const agency = await requireSession()
  const customers = await listCustomers(agency.id)

  return (
      <Column>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[28px] font-semibold leading-[1.2]">Übersicht</h1>
          <ButtonLink href="/kunden">Kunde anlegen</ButtonLink>
        </div>
        {customers.length === 0 ? (
          <p className="mt-8 text-[16px] leading-[1.5] text-[#757575]">Noch keine Kundin und kein Kunde.</p>
        ) : (
          <ul className="mt-8 rounded-[24px] border border-[var(--divider)] bg-[var(--surface-glass)] px-4">
            {customers.map((customer) => (
              <li key={customer.id} className="border-b border-[var(--divider)] last:border-b-0">
                <Link
                  href={`/kunden/${customer.id}`}
                  className="flex flex-col gap-1 py-3 transition-colors duration-150 hover:bg-[rgba(21,21,21,0.025)] sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <span>
                    <span className="block text-[16px] font-medium leading-[1.5]">{customer.name}</span>
                    <span className="block text-[14px] leading-[1.5] text-[var(--text-64)]">{customer.email}</span>
                  </span>
                  <span className="text-[14px] leading-[1.5] text-[var(--text-64)]">
                    {customer.confirmed} von {customer.total} · {openLabel(customer.openProviders)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Column>
  )
}
