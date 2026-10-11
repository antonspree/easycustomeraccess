import { schematic, screenshot, type ProviderDefinition } from "../types.ts"

export const plausible: ProviderDefinition = {
  id: "plausible",
  name: "Plausible",
  summary: "Analyse. Owner bleibt die Kundschaft. Der Tarif ist kostenpflichtig oder eine Testphase.",
  more: "Plausible hat keinen dauerhaft kostenlosen Tarif. Die Website liegt in Ihrem Konto, die Agentur wird Admin. Blokr legt keine Website an.",
  steps: [
    {
      id: "konto",
      title: "Plausible-Konto anlegen",
      sentence: "Legen Sie das Plausible-Konto mit {email} an. Es ist ein bezahlter Tarif oder eine Testphase.",
      minutes: 5,
      url: "https://plausible.io/register",
      urlLabel: "Registrierung bei Plausible öffnen",
      intro:
        "Plausible ist kostenpflichtig, oft mit Testphase. Das Abonnement muss auf Sie laufen, nicht auf die Agentur.",
      substeps: [
        "Öffnen Sie https://plausible.io/register. Die Überschrift lautet Start your 30-day free trial, darunter No credit card required. Cancel anytime.",
        "Felder: Full name, Email, Password (At least 12 characters). Tragen Sie {email} ein.",
        "Klicken Sie auf Start my free trial.",
        "Already have an account? Sign in, wenn das Konto existiert. Eine Karte verlangt Plausible auf dieser Seite nicht.",
      ],
      tips: [
        "Ein vorhandenes Konto mit {email} können Sie weiterverwenden.",
        "Self-hosted Plausible ist ein anderer Weg. Diese Anleitung gilt für plausible.io.",
      ],
      pitfalls: ["Nicht das Plausible-Konto der Agentur verwenden und Ihre Domain nur als Gast anhängen."],
      doneWhen: "Sie sind bei Plausible angemeldet oder werden zur E-Mail-Bestätigung gebeten.",
      image: screenshot(
        "/guides/plausible/konto.png",
        "Öffentliche Plausible-Registrierung Start your 30-day free trial mit Full name, Email und Password",
        "Aufnahme von plausible.io/register",
      ),
    },
    {
      id: "email",
      title: "E-Mail von Plausible bestätigen",
      sentence: "Bestätigen Sie die E-Mail von Plausible im Postfach von {email}.",
      minutes: 3,
      intro: "Ohne bestätigte Adresse bleiben Sites und Einladungen oft gesperrt.",
      substeps: [
        "Öffnen Sie das Postfach von {email}, inklusive Spam.",
        "Öffnen Sie die Nachricht von Plausible und klicken Sie auf den Bestätigungslink.",
      ],
      tips: ["Keine Mail? Auf der Anmeldeseite erneut senden."],
      pitfalls: ["Den Link im selben Browser öffnen."],
      doneWhen: "Das Plausible-Dashboard ist ohne Verify-Hinweis nutzbar.",
      image: schematic("/guides/plausible/email.svg", "Schema der Plausible-Bestätigungsmail"),
    },
    {
      id: "seite",
      title: "Website in Ihrem Konto anlegen",
      sentence: "Legen Sie die Website in Ihrem eigenen Konto an.",
      minutes: 4,
      url: "https://plausible.io/sites",
      urlLabel: "Plausible-Sites öffnen",
      intro: "Add website legt die Site in Ihrem Abonnement an. Das Tracking-Skript setzt später die Agentur oder Sie — nicht Blokr.",
      substeps: [
        "Öffnen Sie https://plausible.io/sites.",
        "Klicken Sie auf + Add website bzw. Add website.",
        "Domain: Ihre Website ohne https://, zum Beispiel example.de.",
        "Zeitzone passend zu Ihnen wählen und Speichern.",
      ],
      tips: ["Eine vorhandene Site in Ihrem Konto reicht. Keine zweite anlegen, wenn {agency} die bestehende nutzen will."],
      pitfalls: ["Nicht die Site im Konto der Agentur anlegen."],
      doneWhen: "Die Domain liegt unter Sites in Ihrem Plausible-Konto.",
      image: schematic("/guides/plausible/seite.svg", "Schema von Add website"),
    },
    {
      id: "einladung",
      title: "Agentur als Admin einladen",
      sentence: "Laden Sie {agencyEmail} als Admin ein.",
      minutes: 4,
      intro:
        "In den Site-Einstellungen unter People bzw. Visibility laden Sie Personen ein. Rollen: admin und viewer. Admin darf die Site konfigurieren, das Abonnement bleibt Ihres.",
      substeps: [
        "Öffnen Sie die Site und gehen Sie auf Settings → People (manchmal Visibility).",
        "Tragen Sie {agencyEmail} ein.",
        "Wählen Sie die Rolle admin — nicht nur viewer.",
        "Senden Sie die Einladung (Invite).",
      ],
      tips: ["viewer sieht Statistiken, kann aber keine Einstellungen ändern."],
      pitfalls: ["Das Abonnement nicht auf die Agentur übertragen. Nur Zugriff auf die Site geben."],
      doneWhen: "{agencyEmail} steht unter People als admin oder als ausstehende Einladung.",
      image: schematic("/guides/plausible/einladung.svg", "Schema von People mit Rolle admin"),
    },
  ],
}
