import { readAgency } from "@/lib/auth"
import { SiteHeaderClient } from "@/components/site-header-client"

export async function SiteHeader() {
  const agency = await readAgency()
  return <SiteHeaderClient agency={agency} />
}
