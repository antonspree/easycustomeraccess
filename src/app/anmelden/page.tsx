import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth-form"
import { Column, Frame } from "@/components/frame"
import { PublicBar } from "@/components/nav"
import { readSession } from "@/lib/auth"

export const metadata: Metadata = { title: "Anmelden" }

export default async function LoginPage() {
  if (await readSession()) redirect("/uebersicht")
  return (
    <Frame>
      <PublicBar action={{ href: "/registrieren", label: "Agentur registrieren" }} />
      <Column className="pt-[44px]">
        <h1 className="text-[28px] font-semibold leading-[1.2]">Anmelden</h1>
        <p className="mt-5 text-[16px] leading-[1.5] text-[#757575]">Mit der E-Mail Ihrer Agentur.</p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </Column>
    </Frame>
  )
}
