import { Suspense } from "react"
import { AgencyShell } from "@/components/agency-shell"
import { requireSession } from "@/lib/auth"
import { countUnread } from "@/lib/workspace"

export default async function AgencyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { agency, member } = await requireSession()
  const unread = await countUnread(member.id, agency.id)
  return (
    <Suspense>
      <AgencyShell agencyName={agency.name} memberName={member.name} unread={unread}>
        {children}
      </AgencyShell>
    </Suspense>
  )
}
