import { redirect } from "next/navigation"
import { Landing } from "@/components/landing"
import { readSession } from "@/lib/auth"

export default async function HomePage() {
  if (await readSession()) redirect("/uebersicht")
  return <Landing />
}
