import type { ProviderDefinition } from "../types.ts"

export const resend: ProviderDefinition = {
  id: "resend",
  name: "Resend",
  summary: "Versand. Owner bleibt die Kundschaft, die Agentur wird Admin.",
  more: "Das Konto gehört Ihnen. Die Agentur wird Admin. Blokr verschickt keine E-Mail und legt keine Domain an.",
  steps: [
    {
      id: "konto",
      title: "Resend-Konto anlegen",
      sentence: "Legen Sie das Resend-Konto mit {email} an.",
      minutes: 3,
      url: "https://resend.com/signup",
      urlLabel: "Registrierung bei Resend öffnen",
      intro: "Resend versendet später E-Mails in Ihrem Namen. Deshalb muss das Konto Ihnen gehören.",
      substeps: [
        "Öffnen Sie https://resend.com/signup.",
        "Wählen Sie Continue with Google oder die E-Mail-Registrierung.",
        "Bei E-Mail: {email} eintragen. Bei Google: nur das Google-Konto mit {email}.",
        "Schließen Sie Sign up ab.",
      ],
      tips: ["Ein vorhandenes Konto mit {email} können Sie weiterverwenden."],
      pitfalls: ["Nicht das Resend-Konto der Agentur verwenden."],
      doneWhen: "Sie sind bei Resend angemeldet oder werden zur E-Mail-Bestätigung gebeten.",
    },
    {
      id: "email",
      title: "E-Mail von Resend bestätigen",
      sentence: "Bestätigen Sie die E-Mail von Resend im Postfach von {email}.",
      minutes: 3,
      intro: "Ohne bestätigte Adresse bleiben Team und Domains oft gesperrt.",
      substeps: [
        "Öffnen Sie das Postfach von {email}, inklusive Spam.",
        "Öffnen Sie die Nachricht von Resend und klicken Sie auf den Bestätigungslink.",
      ],
      tips: ["Keine Mail? Auf der Anmeldeseite erneut senden lassen."],
      pitfalls: ["Den Link im selben Browser öffnen, in dem Sie weiterarbeiten."],
      doneWhen: "Das Resend-Dashboard ist ohne Verify-Hinweis nutzbar.",
    },
    {
      id: "einladung",
      title: "Agentur als Admin einladen",
      sentence: "Laden Sie {agencyEmail} als Admin ein.",
      minutes: 4,
      url: "https://resend.com/settings/team",
      urlLabel: "Resend-Team öffnen",
      intro:
        "Unter Team Settings gibt es Invite. Rollen laut Resend: Admin oder Member. Admin darf Domains, Keys und Einladungen verwalten — das ist die übliche Agenturrolle. Das Team selbst bleibt Ihres.",
      substeps: [
        "Öffnen Sie https://resend.com/settings/team.",
        "Klicken Sie auf Invite.",
        "Tragen Sie {agencyEmail} ein.",
        "Wählen Sie die Rolle Admin — nicht nur Member, wenn die Agentur Domains und Keys einrichten soll.",
        "Senden Sie die Einladung.",
      ],
      tips: ["Member darf E-Mails, Domains und Webhooks nutzen, aber keine Nutzer einladen und nicht das Team löschen."],
      pitfalls: [
        "Sie bleiben die Person, die das Team angelegt hat. Löschen Sie das Team nicht.",
        "API-Keys nicht in Blokr eintragen.",
      ],
      doneWhen: "{agencyEmail} steht im Team als Admin oder als ausstehende Einladung.",
    },
  ],
}
