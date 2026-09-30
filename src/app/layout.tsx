import type { Metadata } from "next"
import { Fraunces, Geist_Mono, Source_Sans_3 } from "next/font/google"
import { Providers } from "@/components/providers"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source",
})

const heading = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
})

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: {
    default: "EasyCustomerAccess",
    template: "%s · EasyCustomerAccess",
  },
  description:
    "Agenturen richten Konten bei Supabase, Vercel und anderen Anbietern auf den Namen der Kundschaft ein. Der Kunde bestätigt mit der eigenen E-Mail, die Agentur bleibt Mitglied.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${sans.variable} ${heading.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
