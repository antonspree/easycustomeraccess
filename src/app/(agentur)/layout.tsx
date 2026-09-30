import { requireSession } from "@/lib/auth"

export default async function AgencyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireSession()
  return children
}
