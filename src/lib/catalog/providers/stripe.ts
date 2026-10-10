import type { ProviderDefinition } from "../types.ts"

export const stripe: ProviderDefinition = {
  id: "stripe",
  name: "Stripe",
  summary: "Zahlungen. Kontoinhaber bleibt die Kundschaft, die Agentur wird Developer.",
  more: "Das Stripe-Konto läuft auf Ihren Namen und Ihre Firma. Die Agentur wird Developer. Geheime Schlüssel tragen Sie nicht in Blokr ein. Blokr legt kein Konto an.",
  steps: [
    {
      id: "konto",
      title: "Stripe-Konto auf Ihren Namen anlegen",
      sentence: "Legen Sie das Stripe-Konto auf Ihren Namen und Ihre Firma an, mit {email}.",
      minutes: 8,
      url: "https://dashboard.stripe.com/register",
      urlLabel: "Registrierung bei Stripe öffnen",
      intro:
        "Stripe zahlt an die Person oder Firma, die im Konto steht. Das müssen Sie sein. Die Agentur darf kein Konto „für Sie“ besitzen.",
      substeps: [
        "Öffnen Sie https://dashboard.stripe.com/register.",
        "Tragen Sie {email} und ein eigenes Passwort ein und klicken Sie auf Create account bzw. Konto erstellen.",
        "Stripe führt durch Land, Art des Geschäfts und Kontaktdaten. Tragen Sie Ihre Firma bzw. sich selbst ein, nicht {agency}.",
        "Bank- und Ausweisdaten können später folgen. Für die Einladung der Agentur reicht oft das angelegte Konto.",
      ],
      tips: [
        "Ein vorhandenes Stripe-Konto Ihrer Firma mit {email} können Sie weiterverwenden.",
        "Testmodus und Live-Modus teilen sich dasselbe Konto. Die Agentur braucht Developer-Zugang, keine geheimen Schlüssel von Ihnen im Chat.",
      ],
      pitfalls: [
        "Nicht das Stripe-Konto der Agentur nutzen und Ihre Auszahlung nur umbiegen.",
        "Geschäftsadresse und Steuernummer müssen zu Ihnen gehören.",
      ],
      doneWhen: "Sie sind im Stripe-Dashboard angemeldet, und unter Kontoeinstellungen stehen Ihr Name bzw. Ihre Firma und {email}.",
    },
    {
      id: "email",
      title: "E-Mail von Stripe bestätigen",
      sentence: "Bestätigen Sie die E-Mail von Stripe im Postfach von {email}.",
      minutes: 3,
      intro: "Stripe schickt eine Bestätigung. Team-Einladungen setzen ein nutzbares Konto voraus.",
      substeps: [
        "Öffnen Sie das Postfach von {email}, inklusive Spam.",
        "Öffnen Sie die Nachricht von Stripe und klicken Sie auf Confirm my email bzw. E-Mail bestätigen.",
      ],
      tips: ["Erneut senden: oft oben im Dashboard als Banner oder unter Profile settings."],
      pitfalls: ["2FA später auf Ihrem Gerät einrichten, nicht auf dem der Agentur."],
      doneWhen: "Stripe zeigt keine ausstehende E-Mail-Bestätigung mehr.",
    },
    {
      id: "einladung",
      title: "Agentur als Developer einladen",
      sentence: "Laden Sie {agencyEmail} als Developer ein.",
      minutes: 4,
      url: "https://dashboard.stripe.com/settings/team",
      urlLabel: "Stripe-Team öffnen",
      intro:
        "Der Weg ist Settings → Team oder direkt die Team-Seite. Schaltfläche Add member. Developer darf Integrationen und Schlüssel verwalten, aber weder das Konto übernehmen noch das Team verwalten.",
      substeps: [
        "Öffnen Sie https://dashboard.stripe.com/settings/team.",
        "Klicken Sie auf Add member.",
        "Tragen Sie {agencyEmail} ein.",
        "Wählen Sie die Rolle Developer — nicht Administrator und nicht Super Administrator.",
        "Klicken Sie auf Send invites. Die Einladung gilt 10 Tage.",
      ],
      tips: [
        "Mehrere Rollen sind möglich. Für die technische Arbeit reicht Developer.",
        "Offene Einladungen sehen Sie in derselben Liste.",
      ],
      pitfalls: [
        "Administrator oder Super Administrator nicht an die Agentur geben.",
        "Geheime Schlüssel (Secret keys) nicht in Blokr und nicht unverschlüsselt per Mail schicken. Die Agentur erzeugt bei Bedarf eigene Schlüssel in Ihrem Konto.",
      ],
      doneWhen: "{agencyEmail} steht im Team als Developer oder als ausstehende Einladung. Sie bleiben Kontoinhaber.",
    },
  ],
}
