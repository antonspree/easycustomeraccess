import { schematic, screenshot, type ProviderDefinition } from "../types.ts"

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
        "Öffnen Sie https://resend.com/signup. Die Überschrift lautet Create a Resend account.",
        "Oben stehen Log in with Google und Log in with GitHub — nur nutzen, wenn das Konto zu {email} gehört.",
        "Darunter Email und Password. Tragen Sie {email} ein und klicken Sie auf Create account.",
      ],
      tips: ["Ein vorhandenes Konto mit {email} können Sie weiterverwenden."],
      pitfalls: ["Nicht das Resend-Konto der Agentur verwenden."],
      doneWhen: "Sie sind bei Resend angemeldet oder werden zur E-Mail-Bestätigung gebeten.",
      image: screenshot(
        "/guides/resend/konto.webp",
        "Öffentliche Resend-Registrierung mit Google, GitHub, Email, Password und Create account",
        "Aufnahme von resend.com/signup",
      ),
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
      image: schematic("/guides/resend/email.svg", "Schema der Resend-Bestätigungsmail"),
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
      image: schematic("/guides/resend/einladung.svg", "Schema von Invite mit Rolle Admin"),
    },
  ],
}
