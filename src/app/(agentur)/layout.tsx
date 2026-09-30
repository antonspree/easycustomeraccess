import { requireAgency } from "@/lib/auth"

export default async function AgencyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAgency()
  return children
}
