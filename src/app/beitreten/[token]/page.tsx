import type { Metadata } from "next"
import { JoinForm } from "@/components/join-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { getOpenInvite } from "@/lib/workspace"

export const metadata: Metadata = { title: "Team beitreten" }
export const dynamic = "force-dynamic"

export default async function JoinPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const invite = getOpenInvite(token)

  if (!invite) {
    return (
      <main className="mx-auto flex w-full max-w-lg px-4 py-10">
        <Empty className="border bg-card">
          <EmptyHeader>
            <EmptyTitle>Einladung ungültig</EmptyTitle>
            <EmptyDescription>
              Der Link ist verbraucht oder wurde zurückgezogen. Bitten Sie die Agentur um einen neuen Link.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </main>
    )
  }

  return (
    <main className="mx-auto flex w-full max-w-lg px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Bei {invite.agencyName} mitarbeiten</CardTitle>
          <CardDescription>
            Sie sehen danach dieselben Kunden. Die Einladungsadresse der Agentur gegenüber den Anbietern bleibt unverändert.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JoinForm token={invite.token} email={invite.email} />
        </CardContent>
      </Card>
    </main>
  )
}
