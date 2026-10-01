"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { adminLogoutAction } from "@/app/verwaltung/actions"
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
} from "@/components/ui/sidebar"

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/verwaltung" />}>
              <span className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">EasyCustomerAccess</span>
                <span>Verwaltung</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={pathname === "/verwaltung"} render={<Link href="/verwaltung" />}>
                Übersicht
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <form action={adminLogoutAction} className="px-2">
          <Button type="submit" variant="outline" className="w-full">
            Abmelden
          </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  )
}
