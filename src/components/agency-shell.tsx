"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

function crumbs(pathname: string, archived: boolean): { label: string; href?: string }[] {
  if (pathname === "/uebersicht") {
    return archived
      ? [
          { label: "Übersicht", href: "/uebersicht" },
          { label: "Archiv" },
        ]
      : [{ label: "Übersicht" }]
  }
  if (pathname === "/kunden/neu") {
    return [
      { label: "Kunden", href: "/kunden/neu" },
      { label: "Neuer Kunde" },
    ]
  }
  if (pathname.startsWith("/kunden/")) {
    return [
      { label: "Kunden", href: "/kunden/neu" },
      { label: "Kunde" },
    ]
  }
  if (pathname.startsWith("/team")) return [{ label: "Team" }]
  if (pathname.startsWith("/agentur")) return [{ label: "Agentur" }]
  if (pathname.startsWith("/benachrichtigungen")) return [{ label: "Hinweise" }]
  return [{ label: "Agentur" }]
}

export function AgencyShell({
  agencyName,
  memberName,
  unread,
  children,
}: {
  agencyName: string
  memberName: string
  unread: number
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const archived = useSearchParams().get("archiv") === "1"
  const trail = crumbs(pathname, archived)

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar agencyName={agencyName} memberName={memberName} unread={unread} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {trail.map((item, index) => {
                const last = index === trail.length - 1
                return (
                  <Fragment key={item.label}>
                    {index > 0 ? <BreadcrumbSeparator /> : null}
                    <BreadcrumbItem>
                      {last || !item.href ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink render={<Link href={item.href} />}>
                          {item.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
