import type { Metadata } from "next"
import { Column } from "@/components/frame"
import { SettingsForm } from "@/components/settings-form"
import { requireSession } from "@/lib/auth"

export const metadata: Metadata = { title: "Einstellungen" }
export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const agency = await requireSession()
  return (
      <Column>
        <h1 className="text-[28px] font-semibold leading-[1.2]">Einstellungen</h1>
        <div className="mt-2 border-b border-[var(--divider)]">
          <span className="inline-block border-b-2 border-[#151515] pb-2 text-[16px] font-normal leading-[1.5]">
            Profil
          </span>
        </div>
        <div className="pt-7">
          <h2 className="text-[20px] font-semibold leading-[1.2]">Name</h2>
          <p className="mt-5 text-[16px] leading-[1.5] text-[#757575]">
            So sieht die Kundschaft, wer sie durch die Schritte führt.
          </p>
          <div className="mt-5">
            <SettingsForm name={agency.name} />
          </div>
        </div>
      </Column>
  )
}
