import type { Metadata } from "next"

export const metadata: Metadata = { title: "Datenschutz" }

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-10">
      <h1 className="font-heading text-3xl">Datenschutz</h1>
      <p className="text-muted-foreground">
        Diese Seite beschreibt, was diese Installation tatsächlich speichert. Vor einem öffentlichen Betrieb trägt der Betreiber Impressum und Verantwortliche selbst ein. EasyCustomerAccess legt dafür keine Firma an.
      </p>
      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-xl">Was gespeichert wird</h2>
        <p>
          Agenturname, Einladungsadresse, Logo und Banner der Agentur, Namen und E-Mails der Teammitglieder, Passwort-Prüfsummen (scrypt), Kundennamen und Kunden-E-Mails, gewählte Anbieter, bestätigte Schritte mit Zeitpunkt, Hinweise wenn jemand nicht weiterkommt, ob eine Einladung im Postfach als angenommen markiert wurde, und Hinweise in der App. Früher gespeicherte Farbwerte bleiben in der Datenbank und färben die Oberfläche nicht.
        </p>
        <p>
          Lokal ohne Datenbank-Adresse liegt das in der Datei data/eca.sqlite. In der Produktion liegt es in Neon Postgres, angebunden über dasselbe Vercel-Konto. Logo und Banner liegen im Blob-Speicher desselben Kontos. Die Verbindung und der Blob-Schlüssel stehen nur in der Umgebung des Hosts. Es gibt keinen externen Anmeldedienst, keine Anbieter-API und keinen Versand von E-Mails aus der App. Die Plattformverwaltung nutzt ein eigenes Cookie eca_admin. Dessen E-Mail und Passwort stehen nur in der Umgebung, nicht in der Datenbank und nicht im Projekt.
        </p>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-xl">Anmeldung</h2>
        <p>
          Teammitglieder erhalten ein Cookie <span className="font-medium">eca_session</span>. Es ist httpOnly, gilt 14 Tage und ist in Produktion nur über HTTPS gesetzt. Kundinnen und Kunden haben kein Konto. Sie öffnen einen geheimen Link.
        </p>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-xl">Was nicht passiert</h2>
        <p>
          Es werden keine Konten, Organisationen oder Projekte bei Supabase, Vercel oder anderen Anbietern angelegt. Es werden keine API-Schlüssel gespeichert. Die Markierung „Einladung angenommen“ ist eine Notiz der Agentur, kein Abruf beim Anbieter.
        </p>
      </section>
    </main>
  )
}
