import type { Metadata } from "next"
import { CustomerForm } from "@/components/customer-form"
import { Column } from "@/components/frame"

export const metadata: Metadata = { title: "Neuer Kunde" }
export const dynamic = "force-dynamic"

export default function NewCustomerPage() {
  return (
      <Column>
        <h1 className="text-[28px] font-semibold leading-[1.2]">Neuer Kunde</h1>
        <p className="mt-5 max-w-[520px] text-[16px] leading-[1.5] text-[#757575]">
          Name und E-Mail der Person, auf die die Konten laufen sollen.
        </p>
        <div className="mt-8">
          <CustomerForm />
        </div>
      </Column>
  )
}
