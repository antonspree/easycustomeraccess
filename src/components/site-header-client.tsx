"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BellIcon } from "lucide-react"
import { logoutAction } from "@/lib/actions"
import { Button } from "@/components/ui/button"

export function SiteHeaderClient({
  session,
}: {
  session: { agencyName: string; memberName: string; unread: number } | null
}) {
  const pathname = usePathname()
  const customerView = pathname.startsWith("/einrichten")

  if (customerView) {
    return (
      <header className="border-b bg-card">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3">
          <p className="font-heading text-lg leading-none">EasyCustomerAccess</p>
          <p className="text-sm text-muted-foreground">Einrichtung</p>
          {session ? (
            <Button className="ml-auto" variant="outline" size="sm" render={<Link href="/uebersicht" />}>
              Zur Übersicht
            </Button>
          ) : null}
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link href={session ? "/uebersicht" : "/"} className="font-heading text-lg leading-none">
          EasyCustomerAccess
        </Link>
        {session ? (
          <nav className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" render={<Link href="/uebersicht" />}>
              Übersicht
            </Button>
            <Button variant="ghost" size="sm" render={<Link href="/kunden/neu" />}>
              Neuer Kunde
            </Button>
            <Button variant="ghost" size="sm" render={<Link href="/team" />}>
              Team
            </Button>
            <Button variant="ghost" size="sm" render={<Link href="/agentur" />}>
              Agentur
            </Button>
            <Button variant="ghost" size="sm" render={<Link href="/benachrichtigungen" />}>
              <BellIcon data-icon="inline-start" />
              Hinweise
              {session.unread > 0 ? (
                <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                  {session.unread}
                </span>
              ) : null}
            </Button>
            <p className="text-sm text-muted-foreground sm:ml-auto">
              {session.memberName} · {session.agencyName}
            </p>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="sm">
                Abmelden
              </Button>
            </form>
          </nav>
        ) : (
          <nav className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" render={<Link href="/anmelden" />}>
              Anmelden
            </Button>
            <Button size="sm" render={<Link href="/registrieren" />}>
              Agentur registrieren
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
