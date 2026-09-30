"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { logoutAction } from "@/lib/actions"
import { Button } from "@/components/ui/button"

export function SiteHeaderClient({
  agency,
}: {
  agency: { name: string } | null
}) {
  const pathname = usePathname()
  const customerView = pathname.startsWith("/einrichten")

  if (customerView) {
    return (
      <header className="border-b bg-card">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3">
          <p className="font-heading text-lg leading-none">EasyCustomerAccess</p>
          <p className="text-sm text-muted-foreground">Einrichtung</p>
          {agency ? (
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
        <Link href={agency ? "/uebersicht" : "/"} className="font-heading text-lg leading-none">
          EasyCustomerAccess
        </Link>
        {agency ? (
          <nav className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" render={<Link href="/uebersicht" />}>
              Übersicht
            </Button>
            <Button variant="ghost" size="sm" render={<Link href="/kunden/neu" />}>
              Neuer Kunde
            </Button>
            <p className="text-sm text-muted-foreground sm:ml-auto">{agency.name}</p>
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
