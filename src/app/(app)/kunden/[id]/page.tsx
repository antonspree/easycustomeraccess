import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CopyLink } from "@/components/copy-link"
import { Column } from "@/components/frame"
import { requireSession } from "@/lib/auth"
import { customerForAgency } from "@/lib/db"
import { publicOrigin } from "@/lib/origin"
import { openLabel } from "@/lib/progress"

export const metadata: Metadata = { title: "Kunde" }
export const dynamic = "force-dynamic"

export default async function CustomerLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const agency = await requireSession()
  const loaded = await customerForAgency(agency.id, id)
  if (!loaded) notFound()
  const origin = await publicOrigin()
  const url = `${origin}/einrichten/${loaded.token}`

  return (
      <Column>
        <h1 className="text-[28px] font-semibold leading-[1.2]">{loaded.customer.name}</h1>
        <p className="mt-2 text-[14px] leading-[1.5] text-[var(--text-64)]">{loaded.customer.email}</p>
        <div className="mt-8 border-t border-[var(--divider)] pt-8">
          <h2 className="text-[20px] font-semibold leading-[1.2]">Link</h2>
          <p className="mt-5 text-[16px] leading-[1.5] text-[#757575]">
            Der Link ist geheim. Es gibt kein Kundenlogin. {loaded.progress.confirmed} von {loaded.progress.total} · {openLabel(loaded.progress.openProviders)}
          </p>
          <div className="mt-5">
            <CopyLink url={url} />
          </div>
          <Link href="/uebersicht" className="mt-8 inline-block text-[14px] font-medium leading-[1.5] text-[var(--text-64)]">
            Zur Übersicht
          </Link>
        </div>
      </Column>
  )
}
