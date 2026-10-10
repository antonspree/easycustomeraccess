import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Column } from "@/components/frame"
import { CustomerEditForm } from "@/components/customer-edit-form"
import { requireSession } from "@/lib/auth"
import { customerForAgency } from "@/lib/db"

export const metadata: Metadata = { title: "Kunde bearbeiten" }
export const dynamic = "force-dynamic"

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const agency = await requireSession()
  const loaded = await customerForAgency(agency.id, id)
  if (!loaded) notFound()

  return (
    <Column>
      <h1 className="text-[28px] font-semibold leading-[1.2]">Kunde bearbeiten</h1>
      <p className="mt-2 text-[14px] leading-[1.5] text-[var(--text-64)]">{loaded.customer.name}</p>
      <div className="mt-8 border-t border-[var(--divider)] pt-8">
        <CustomerEditForm
          customerId={id}
          name={loaded.customer.name}
          email={loaded.customer.email}
          providerIds={loaded.providers.map((p) => p.id)}
        />
      </div>
    </Column>
  )
}
