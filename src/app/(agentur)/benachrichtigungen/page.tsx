import type { Metadata } from "next"
import Link from "next/link"
import { BellIcon } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { requireSession } from "@/lib/auth"
import { formatDateTime } from "@/lib/text"
import { listNotifications, markNotificationsRead } from "@/lib/workspace"

export const metadata: Metadata = { title: "Hinweise" }
export const dynamic = "force-dynamic"

export default async function NotificationsPage() {
  const { agency, member } = await requireSession()
  const items = listNotifications(member.id, agency.id)
  markNotificationsRead(member.id, agency.id)

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl">Hinweise</h1>
        <p className="text-sm text-muted-foreground">
          Schritte, fertige Anbieter, Stocken und neue Teammitglieder. Das bleibt in der App. Es geht keine E-Mail raus.
        </p>
      </div>
      {items.length === 0 ? (
        <Empty className="border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BellIcon />
            </EmptyMedia>
            <EmptyTitle>Noch keine Hinweise</EmptyTitle>
            <EmptyDescription>
              Sobald eine Kundin oder ein Kunde einen Schritt bestätigt, steht es hier.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-1 rounded-lg border bg-card p-4">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.body}</p>
              <p className="text-sm text-muted-foreground">{formatDateTime(item.created_at)}</p>
              {item.href ? (
                <Link href={item.href} className="text-sm underline-offset-4 hover:underline">
                  Öffnen
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
