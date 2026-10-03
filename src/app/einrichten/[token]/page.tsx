import type { Metadata } from "next"
import { confirmStepAction } from "@/lib/actions"
import { Button } from "@/components/button"
import { Column, Frame, washes } from "@/components/frame"
import { fill } from "@/lib/catalog"
import { markOpened, setupByToken } from "@/lib/db"

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
  const { progress, setup } = loaded
  const vars = {
    email: setup.customer_email,
    agency: setup.agency_name,
    agencyEmail: setup.agency_email,
  }

  return (
    <Frame wash={washes.cream}>
      <Column className="pt-16">
        <p className="text-[14px] leading-[1.5] text-[var(--text-64)]">{setup.agency_name}</p>
        {progress.next ? (
          <>
            <p className="mt-8 max-w-[520px] text-[16px] leading-[1.5]">{fill(progress.next.sentence, vars)}</p>
            <p className="mt-4 text-[14px] leading-[1.5] text-[var(--text-36)]">
              {progress.confirmed} von {progress.total}
            </p>
            {query.hinweis ? (
              <p className="mt-4 text-[14px] leading-[1.5]">Dieser Schritt ist nicht der nächste.</p>
            ) : null}
            <form action={confirmStepAction} className="mt-8">
              <input type="hidden" name="token" value={token} />
              <input type="hidden" name="providerId" value={progress.next.providerId} />
              <input type="hidden" name="stepId" value={progress.next.stepId} />
              <Button type="submit">Erledigt</Button>
            </form>
          </>
        ) : (
          <>
            <p className="mt-8 max-w-[520px] text-[16px] leading-[1.5]">
              Alles bestätigt. {setup.agency_name} sieht den Stand.
            </p>
            <p className="mt-4 text-[14px] leading-[1.5] text-[var(--text-36)]">
              {progress.confirmed} von {progress.total}
            </p>
          </>
        )}
      </Column>
    </Frame>
  )
}
