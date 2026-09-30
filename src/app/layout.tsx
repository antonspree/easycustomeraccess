import type { Metadata } from "next"
import { Source_Sans_3 } from "next/font/google"
import { Providers } from "@/components/providers"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source",
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
      className={`${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}
