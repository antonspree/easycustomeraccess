import { SiteHeaderClient } from "@/components/site-header-client"
import { readSession } from "@/lib/auth"
import { countUnread } from "@/lib/workspace"

export async function SiteHeader() {
  const session = await readSession()
  const unread = session ? countUnread(session.member.id, session.agency.id) : 0
  return (
    <SiteHeaderClient
      session={
        session
          ? {
              agencyName: session.agency.name,
              memberName: session.member.name,
              unread,
            }
          : null
      }
    />
  )
}
