import { redirect } from "next/navigation"
import { ButtonLink } from "@/components/button"
import { Frame } from "@/components/frame"
import { PublicBar } from "@/components/nav"
import { readSession } from "@/lib/auth"

export default async function HomePage() {
  if (await readSession()) redirect("/uebersicht")
  return (
    <Frame>
      <PublicBar action={{ href: "/anmelden", label: "Anmelden" }} />
      <main className="mx-auto flex min-h-[70svh] w-full max-w-[820px] flex-col justify-center px-4">
        <p className="max-w-[520px] text-[20px] font-semibold leading-[1.2]">
          Ihre Kundschaft legt die Konten selbst an und bestätigt jeden Schritt über einen geheimen Link.
        </p>
        <div className="mt-5">
          <ButtonLink href="/registrieren">Agentur registrieren</ButtonLink>
        </div>
      </main>
    </Frame>
  )
}
