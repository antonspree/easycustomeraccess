"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function SiteFooter() {
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

  return (
    <footer>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-16 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-heading text-lg">
            EasyCustomerAccess
          </p>
          <p className="max-w-md text-sm text-foreground/75">
            Agenturen führen Kundinnen und Kunden durch Konten, die auf deren Namen laufen. Bestätigungen bleiben in der App.
          </p>
        </div>
        <Link href="/datenschutz" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          Datenschutz
        </Link>
      </div>
    </footer>
  )
}
