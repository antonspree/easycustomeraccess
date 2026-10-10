import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Okklar",
    template: "%s · Okklar",
  },
  description:
    "Agenturen lassen Konten bei Drittanbietern auf den Namen der Kundschaft laufen. Die Person bestätigt die Schritte über einen geheimen Link.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body className="min-h-svh antialiased">{children}</body>
    </html>
  )
}
