"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { logoutAction } from "@/lib/actions"

const links = [
  { href: "/uebersicht", label: "Übersicht" },
  { href: "/kunden", label: "Kunden" },
  { href: "/einstellungen", label: "Einstellungen" },
]

function Items({ current }: { current: string }) {
  return (
    <>
      {links.map((link) => {
        const active =
          current === link.href || (link.href !== "/uebersicht" && current.startsWith(`${link.href}/`)) || (link.href === "/kunden" && current.startsWith("/kunden"))
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              active
                ? "text-[14px] font-medium leading-[1.5] text-[var(--text)]"
                : "text-[14px] font-medium leading-[1.5] text-[var(--text-64)] transition-colors duration-150 hover:text-[var(--text)]"
            }
          >
            {link.label}
          </Link>
        )
      })}
    </>
  )
}

export function AppNav() {
  const current = usePathname()
  return (
    <header className="px-4 py-3">
      <div className="relative flex items-center justify-between gap-4">
        <Link href="/uebersicht" className="text-[14px] font-medium leading-[1.5]">
          EasyCustomerAccess
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 md:flex">
          <Items current={current} />
        </nav>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-[14px] font-medium leading-[1.5] text-[var(--text-64)] transition-colors duration-150 hover:text-[var(--text)]"
          >
            Abmelden
          </button>
        </form>
      </div>
      <nav className="mt-3 flex gap-5 overflow-x-auto md:hidden">
        <Items current={current} />
      </nav>
    </header>
  )
}

export function PublicBar({ action }: { action: { href: string; label: string } }) {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      <Link href="/" className="text-[14px] font-medium leading-[1.5]">
        EasyCustomerAccess
      </Link>
      <Link
        href={action.href}
        className="text-[14px] font-medium leading-[1.5] text-[var(--text-64)] transition-colors duration-150 hover:text-[var(--text)]"
      >
        {action.label}
      </Link>
    </header>
  )
}
