import Link from "next/link"
import { readSession } from "@/lib/auth"
import { providers } from "@/lib/providers/catalog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function HomePage() {
  const session = await readSession()

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:py-16">
      <section className="flex max-w-2xl flex-col gap-4">
        <p className="text-sm font-medium text-muted-foreground">Für Web- und Media-Agenturen</p>
        <h1 className="font-heading text-4xl leading-tight sm:text-5xl">
          Konten auf den Namen der Kundschaft.
        </h1>
        <p className="text-lg text-muted-foreground">
          Sie richten Supabase, Vercel, Domains und den Rest so ein, dass die Konten der Kundin oder dem Kunden gehören. Die Person bestätigt jeden Schritt mit der eigenen E-Mail. Sie werden als Mitglied eingeladen und behalten den Überblick.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {session ? (
            <Button size="lg" render={<Link href="/uebersicht" />}>
              Zur Übersicht
            </Button>
          ) : (
            <>
              <Button size="lg" render={<Link href="/registrieren" />}>
                Agentur registrieren
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/anmelden" />}>
                Anmelden
              </Button>
            </>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Getrennte Agenturen</CardTitle>
            <CardDescription>Jede Agentur sieht nur die eigenen Kunden und Einrichtungen.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ein Katalog, viele Anbieter</CardTitle>
            <CardDescription>
              {providers.length} Anbieter, dasselbe Schrittmodell. Ein neuer Anbieter ist ein Katalogeintrag.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kein Kunden-Login</CardTitle>
            <CardDescription>
              Ein geheimer Link für die ganze Einrichtung. Bestätigt wird mit der E-Mail, die auf dem Konto stehen soll.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl">Was diese Version tut</h2>
        <Card>
          <CardContent className="flex flex-col gap-2 pt-4">
            <p>
              Sie legen den Kunden an, wählen die Anbieter und schicken einen Link. Die Kundin oder der Kunde geht die Schritte durch und bestätigt sie. Sie sehen je Anbieter, ob der Stand offen ist, auf den Kunden wartet oder fertig ist. Hinweise, Team und angenommene Einladungen bleiben in der Agentur.
            </p>
            <p className="text-muted-foreground">
              Es wird noch kein Konto, keine Organisation und kein Projekt über eine Schnittstelle angelegt. Die Schritte beschreiben, was die Person beim Anbieter selbst tut.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
