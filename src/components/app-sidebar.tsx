"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { logoutAction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function AppSidebar({
  agencyName,
  memberName,
  unread,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  agencyName: string
  memberName: string
  unread: number
}) {
  const pathname = usePathname()
  const archived = useSearchParams().get("archiv") === "1"

  const sections = [
    {
      title: "Übersicht",
      url: "/uebersicht",
      active: pathname === "/uebersicht",
      items: [
        {
          title: "Aktive Kunden",
          url: "/uebersicht",
          active: pathname === "/uebersicht" && !archived,
        },
        {
          title: "Archiv",
          url: "/uebersicht?archiv=1",
          active: pathname === "/uebersicht" && archived,
        },
      ],
    },
    {
      title: "Kunden",
      url: "/kunden/neu",
      active: pathname.startsWith("/kunden"),
      items: [
        {
          title: "Neuer Kunde",
          url: "/kunden/neu",
          active: pathname === "/kunden/neu",
        },
      ],
    },
    {
      title: "Team",
      url: "/team",
      active: pathname.startsWith("/team"),
      items: [],
    },
    {
      title: "Agentur",
      url: "/agentur",
      active: pathname.startsWith("/agentur"),
      items: [],
    },
    {
      title: "Hinweise",
      url: "/benachrichtigungen",
      active: pathname.startsWith("/benachrichtigungen"),
      items: [],
    },
  ]

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/uebersicht" />}>
              <span aria-hidden className="size-2.5 rounded-full bg-sidebar-primary" />
              <span className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">EasyCustomerAccess</span>
                <span>{agencyName}</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {sections.map((section) => (
              <SidebarMenuItem key={section.title}>
                <SidebarMenuButton
                  isActive={section.active}
                  render={<Link href={section.url} className="font-medium" />}
                >
                  {section.title}
                  {section.title === "Hinweise" && unread > 0 ? (
                    <span className="ml-auto rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                      {unread}
                    </span>
                  ) : null}
                </SidebarMenuButton>
                {section.items.length > 0 ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {section.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton isActive={item.active} render={<Link href={item.url} />}>
                          {item.title}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2 px-2">
          <p className="text-sm">
            <span className="font-medium">{memberName}</span>
            <span className="text-foreground/70"> · {agencyName}</span>
          </p>
          <form action={logoutAction}>
            <Button type="submit" variant="outline" className="w-full">
              Abmelden
            </Button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
