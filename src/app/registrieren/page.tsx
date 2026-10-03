import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { RegisterForm } from "@/components/auth-form"
import { Column, Frame } from "@/components/frame"
import { PublicBar } from "@/components/nav"
import { readSession } from "@/lib/auth"

export const metadata: Metadata = { title: "Agentur registrieren" }

export default async function RegisterPage() {
  if (await readSession()) redirect("/uebersicht")
  return (
    <Frame>
      <PublicBar action={{ href: "/anmelden", label: "Anmelden" }} />
      <Column className="pt-[44px]">
        <h1 className="text-[28px] font-semibold leading-[1.2]">Agentur registrieren</h1>
        <p className="mt-5 max-w-[520px] text-[16px] leading-[1.5] text-[#757575]">
          Die Anmeldung gilt für Ihre Agentur. Kundinnen und Kunden melden sich hier nicht an.
        </p>
        <div className="mt-8">
          <RegisterForm />
        </div>
      </Column>
    </Frame>
  )
}
