import { Frame } from "@/components/frame"
import { AppNav } from "@/components/nav"
import { requireSession } from "@/lib/auth"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireSession()
  return (
    <Frame>
      <AppNav />
      <div className="pt-[44px]">{children}</div>
    </Frame>
  )
}
