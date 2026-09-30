import Link from "next/link"
import { LinkSteps } from "@/components/marketing/link-steps"
import { ProblemStats } from "@/components/marketing/problem-stats"
import { ProviderGrid } from "@/components/marketing/provider-grid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { readSession } from "@/lib/auth"
import { providers } from "@/lib/providers/catalog"

export default async function HomePage() {
  const session = await readSession()
  const primaryHref = session ? "/uebersicht" : "/registrieren"
  const primaryLabel = session ? "Zur Übersicht" : "Agentur registrieren"

  return (
    <main className="flex flex-col">
      <section className="border-b">
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="flex flex-col gap-5">
            <p className="text-sm font-medium text-primary">Für Web- und Media-Agenturen</p>
            <h1 className="font-heading text-4xl leading-tight text-balance sm:text-5xl">
              Konten auf den Namen der Kundschaft.
            </h1>
            <p className="max-w-xl text-lg text-foreground/80">
              Supabase, Vercel, Domains und der Rest laufen auf der E-Mail der Kundin oder des Kunden, auch in kostenlosen Tarifen. Die Person geht einen geheimen Link durch. Sie werden als Mitglied eingeladen und behalten den Überblick.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button size="lg" render={<Link href={primaryHref} />}>
                {primaryLabel}
              </Button>
              {session ? null : (
                <Button size="lg" variant="outline" render={<Link href="/anmelden" />}>
                  Anmelden
                </Button>
              )}
            </div>
          </div>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Einrichtung für Mara Lind</CardTitle>
              <CardDescription>Supabase · Schritt 4 von 6</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm font-medium">Agentur als Administrator einladen</p>
              <p className="text-sm text-foreground/80">
                Die Einladung geht an die Adresse der Agentur. Owner bleibt mara@kunde.de. EasyCustomerAccess legt dabei kein Projekt an.
              </p>
              <div className="rounded-lg border border-primary bg-secondary px-3 py-2 text-sm text-foreground">
                Bestätigt wird mit mara@kunde.de
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-b" id="problem">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-14">
          <div className="flex max-w-2xl flex-col gap-2">
            <h2 className="font-heading text-3xl">Das Konto der Agentur ist die falsche Adresse</h2>
            <p className="text-foreground/80">
              Wer Supabase, Vercel oder die Domain auf den eigenen Login legt, hängt den Kunden an die Agentur. Freie Tarife, Rechnungen und Übergaben werden dann zur Aufräumarbeit. EasyCustomerAccess führt die Person durch die Schritte, damit das Konto von Anfang an ihr gehört.
            </p>
          </div>
          <ProblemStats />
        </div>
      </section>

      <section className="border-b" id="ablauf">
        <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-14 lg:grid-cols-[0.8fr_1fr] lg:items-start">
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-3xl">So funktioniert der Kundenlink</h2>
            <p className="text-foreground/80">
              Ein Link für die ganze Einrichtung. Die Schritte stehen fest: was die Person tut, welche E-Mail sie benutzt, welche Rolle Sie bekommen und woran sie erkennt, dass der Schritt fertig ist.
            </p>
            <Button className="w-fit" render={<Link href={primaryHref} />}>
              {primaryLabel}
            </Button>
          </div>
          <LinkSteps />
        </div>
      </section>

      <section className="border-b" id="katalog">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-14">
          <div className="flex max-w-2xl flex-col gap-2">
            <h2 className="font-heading text-3xl">Ein Katalog, {providers.length} Anbieter</h2>
            <p className="text-foreground/80">
              Supabase ist am genauesten beschrieben. Vercel, Netlify, Cloudflare, GitHub, Analytics, Stripe, Resend, Sanity, IONOS und Plausible folgen demselben Schrittmodell. Ein neuer Anbieter ist ein Katalogeintrag, keine neue App.
            </p>
          </div>
          <ProviderGrid />
        </div>
      </section>

      <section>
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-16">
          <div className="flex flex-col gap-4 rounded-2xl bg-foreground px-6 py-10 text-background sm:px-10">
            <h2 className="font-heading text-3xl text-balance">Die nächste Einrichtung gehört der Kundschaft.</h2>
            <p className="max-w-xl text-background/80">
              Registrieren Sie die Agentur, legen Sie den ersten Kunden an und schicken Sie den Link. Die Oberfläche merkt sich die Bestätigung. Eine Schnittstelle legt dabei kein Konto, keine Organisation und kein Projekt an.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button size="lg" render={<Link href={primaryHref} />}>
                {primaryLabel}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-background bg-transparent text-background hover:bg-background hover:text-foreground"
                render={<Link href="/datenschutz" />}
              >
                Datenschutz
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
