"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BellIcon } from "lucide-react"
import { logoutAction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Wordmark({ href }: { href: string }) {
  return (
    <Link href={href} className="font-heading text-lg leading-none">
      EasyCustomerAccess
    </Link>
  )
}

export function SiteHeaderClient({
  session,
}: {
  session: { agencyName: string; memberName: string; unread: number } | null
}) {
  const pathname = usePathname()
  const ownChrome =
    pathname === "/anmelden" ||
    pathname === "/registrieren" ||
    pathname.startsWith("/uebersicht") ||
    pathname.startsWith("/kunden") ||
    pathname.startsWith("/team") ||
    pathname.startsWith("/agentur") ||
    pathname.startsWith("/benachrichtigungen") ||
    pathname.startsWith("/einrichten") ||
    pathname.startsWith("/verwaltung")
  if (ownChrome) return null

  const links = [
    { href: "/uebersicht", label: "Übersicht" },
    { href: "/kunden/neu", label: "Neuer Kunde" },
    { href: "/team", label: "Team" },
    { href: "/agentur", label: "Agentur" },
  ]

  return (
    <header>
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Wordmark href={session ? "/uebersicht" : "/"} />
        {session ? (
          <nav className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
              return (
                <Button
                  key={link.href}
                  variant="ghost"
                  size="sm"
                  className={cn(active && "text-primary")}
                  render={<Link href={link.href} />}
                >
                  {link.label}
                </Button>
              )
            })}
            <Button
              variant="ghost"
              size="sm"
              className={cn(pathname.startsWith("/benachrichtigungen") && "text-primary")}
              render={<Link href="/benachrichtigungen" />}
            >
              <BellIcon data-icon="inline-start" />
              Hinweise
              {session.unread > 0 ? (
                <span className="text-sm tabular-nums">{session.unread}</span>
              ) : null}
            </Button>
            <p className="text-sm text-foreground/70 sm:ml-auto">
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
