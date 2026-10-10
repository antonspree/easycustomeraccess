import type { Metadata } from "next"
import { Column, Frame, washes } from "@/components/frame"
import { SetupFinish, SetupIntro, SetupOverview, SetupStep } from "@/components/setup-guide"
import { fillStrings } from "@/lib/catalog"
import { markOpened, setupByToken } from "@/lib/db"
import { guideFor } from "@/lib/guide"

export const metadata: Metadata = { title: "Einrichtung" }
export const dynamic = "force-dynamic"

export default async function SetupPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ hinweis?: string }>
}) {
  const { token } = await params
  const query = await searchParams
  const loaded = await setupByToken(token)

  if (!loaded) {
    return (
      <Frame wash={washes.cream}>
        <Column className="pt-16">
          <p className="text-[16px] leading-[1.5]">Dieser Link ist unbekannt. Bitten Sie die Agentur um den aktuellen Link.</p>
        </Column>
      </Frame>
    )
  }

  if (!loaded.setup.opened_at) await markOpened(loaded.setup.id)
  const { progress, setup, providerIds, confirmations } = loaded
  const vars = {
    email: setup.customer_email,
    agency: setup.agency_name,
    agencyEmail: setup.agency_email,
  }
  const guide = fillStrings(guideFor(providerIds, confirmations), vars)

  return (
    <Frame wash={washes.cream}>
      <Column className="pt-12 pb-20">
        <p className="text-[14px] leading-[1.5] text-[var(--text-64)]">{setup.agency_name}</p>
        {guide.current ? (
          <>
            <div className="mt-8">
              <SetupIntro agency={setup.agency_name} vars={vars} providers={guide.providers} started={progress.confirmed > 0} />
            </div>
            <SetupOverview providers={guide.providers} />
            <SetupStep
              current={guide.current}
              token={token}
              vars={vars}
              hint={Boolean(query.hinweis)}
              confirmed={progress.confirmed}
              total={progress.total}
            />
          </>
        ) : (
          <div className="mt-8">
            <SetupFinish agency={setup.agency_name} providers={guide.providers} total={progress.total} />
          </div>
        )}
      </Column>
    </Frame>
  )
}
