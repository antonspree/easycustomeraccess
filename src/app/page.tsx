import Link from "next/link"
import { LinkSteps } from "@/components/marketing/link-steps"
import { ProblemStats } from "@/components/marketing/problem-stats"
import { ProviderGrid } from "@/components/marketing/provider-grid"
import { Button } from "@/components/ui/button"
import { readSession } from "@/lib/auth"
import { providers } from "@/lib/providers/catalog"

export default async function HomePage() {
  const session = await readSession()
  const primaryHref = session ? "/uebersicht" : "/registrieren"
  const primaryLabel = session ? "Zur Übersicht" : "Agentur registrieren"

  return (
    <main className="flex flex-col">
      <section>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-24 sm:py-32">
          <p className="text-sm">Für Web- und Media-Agenturen</p>
          <h1 className="max-w-2xl font-heading text-5xl leading-[1.05] text-balance sm:text-6xl">
            Konten auf den Namen der Kundschaft.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-foreground/80">
            Supabase, Vercel, Domains und der Rest laufen auf der E-Mail der Kundin oder des Kunden, auch in kostenlosen Tarifen. Die Person geht einen geheimen Link durch. Sie werden als Mitglied eingeladen und behalten den Überblick.
          </p>
          <div className="flex flex-col items-start gap-4">
            <Button size="lg" render={<Link href={primaryHref} />}>
              {primaryLabel}
            </Button>
            {session ? null : (
              <Link href="/anmelden" className="text-sm underline underline-offset-4">
                Anmelden
              </Link>
            )}
          </div>
        </div>
      </section>

      <section id="problem">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-20">
          <div className="flex max-w-2xl flex-col gap-3">
            <h2 className="font-heading text-3xl">Das Konto der Agentur ist die falsche Adresse</h2>
            <p className="leading-relaxed text-foreground/80">
              Wer Supabase, Vercel oder die Domain auf den eigenen Login legt, hängt den Kunden an die Agentur. Freie Tarife, Rechnungen und Übergaben werden dann zur Aufräumarbeit. EasyCustomerAccess führt die Person durch die Schritte, damit das Konto von Anfang an ihr gehört.
            </p>
          </div>
          <ProblemStats />
        </div>
      </section>

      <section id="ablauf">
        <div className="mx-auto grid w-full max-w-5xl gap-16 px-6 py-20 lg:grid-cols-[0.8fr_1fr] lg:items-start">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-3xl">So funktioniert der Kundenlink</h2>
            <p className="leading-relaxed text-foreground/80">
              Ein Link für die ganze Einrichtung. Die Schritte stehen fest: was die Person tut, welche E-Mail sie benutzt, welche Rolle Sie bekommen und woran sie erkennt, dass der Schritt fertig ist.
            </p>
            <Button className="w-fit" render={<Link href={primaryHref} />}>
              {primaryLabel}
            </Button>
          </div>
          <LinkSteps />
        </div>
      </section>

      <section id="katalog">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-20">
          <div className="flex max-w-2xl flex-col gap-3">
            <h2 className="font-heading text-3xl">Ein Katalog, {providers.length} Anbieter</h2>
            <p className="leading-relaxed text-foreground/80">
              Supabase ist am genauesten beschrieben. Vercel, Netlify, Cloudflare, GitHub, Analytics, Stripe, Resend, Sanity, IONOS und Plausible folgen demselben Schrittmodell. Ein neuer Anbieter ist ein Katalogeintrag, keine neue App.
            </p>
          </div>
          <ProviderGrid />
        </div>
      </section>

      <section>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-24">
          <h2 className="font-heading text-4xl text-balance">Die nächste Einrichtung gehört der Kundschaft.</h2>
          <p className="max-w-xl leading-relaxed text-foreground/80">
            Registrieren Sie die Agentur, legen Sie den ersten Kunden an und schicken Sie den Link. Die Oberfläche merkt sich die Bestätigung. Eine Schnittstelle legt dabei kein Konto, keine Organisation und kein Projekt an.
          </p>
          <div className="flex flex-col items-start gap-4">
            <Button size="lg" render={<Link href={primaryHref} />}>
              {primaryLabel}
            </Button>
            <Link href="/datenschutz" className="text-sm underline underline-offset-4">
              Datenschutz
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
