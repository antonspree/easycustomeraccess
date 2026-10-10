import type { ProviderDefinition } from "../types.ts"

export const sanity: ProviderDefinition = {
  id: "sanity",
  name: "Sanity",
  summary: "Inhalt. Die Organisation gehört der Kundschaft, die Agentur wird Administrator.",
  more: "Konto und Projekt laufen auf Sie. Die Agentur wird Administrator. Blokr legt kein Projekt an.",
  steps: [
    {
      id: "konto",
      title: "Sanity-Konto anlegen",
      sentence: "Legen Sie das Sanity-Konto mit {email} an.",
      minutes: 4,
      url: "https://www.sanity.io/get-started",
      urlLabel: "Einstieg bei Sanity öffnen",
      intro: "Sanity-Projekte hängen an dem Konto, das sie anlegt. Das müssen Sie sein.",
      substeps: [
        "Öffnen Sie https://www.sanity.io/get-started oder https://www.sanity.io/login.",
        "Wählen Sie Continue with Google oder Continue with email.",
        "Bei E-Mail: {email}. Bei Google: nur das Konto mit {email}.",
        "Schließen Sie die Registrierung ab. Sanity kann einen Bestätigungscode an {email} schicken.",
      ],
      tips: ["Ein vorhandenes Sanity-Konto mit {email} können Sie weiterverwenden."],
      pitfalls: ["Nicht das Sanity-Konto der Agentur verwenden."],
      doneWhen: "Sie sind bei Sanity angemeldet und sehen Manage bzw. das Projekt-Dashboard.",
    },
    {
      id: "projekt",
      title: "Projekt auf Ihren Namen anlegen",
      sentence: "Legen Sie das Projekt auf Ihren Namen an.",
      minutes: 5,
      url: "https://www.sanity.io/manage",
      urlLabel: "Sanity Manage öffnen",
      intro: "Ein Projekt ist der Container für Ihre Inhalte. Es soll in Ihrer Organisation liegen und nach Ihnen bzw. der Website heißen.",
      substeps: [
        "Öffnen Sie https://www.sanity.io/manage.",
        "Klicken Sie auf Create new project bzw. New project.",
        "Vergeben Sie einen Projektnamen nach Ihrer Website oder Firma, nicht nach {agency}.",
        "Wählen Sie den kostenlosen Tarif, sofern {agency} nichts anderes sagt.",
        "Legen Sie das Projekt an. Eine fertige Vorlage ist optional — die Agentur richtet das Schema später ein.",
      ],
      tips: ["Ein vorhandenes eigenes Projekt reicht, wenn Sie darin Administrator bzw. Owner sind."],
      pitfalls: ["Nicht in eine Organisation der Agentur wechseln und dort das Projekt anlegen."],
      doneWhen: "Das Projekt existiert unter Ihrem Konto und trägt Ihren bzw. den Website-Namen.",
    },
    {
      id: "einladung",
      title: "Agentur als Administrator einladen",
      sentence: "Laden Sie {agencyEmail} als Administrator ein.",
      minutes: 4,
      intro:
        "In Manage öffnen Sie das Projekt und dann Members bzw. Project members. Administrator darf Inhalte und Schema pflegen, übernimmt aber nicht Ihr Konto.",
      substeps: [
        "Öffnen Sie das Projekt in https://www.sanity.io/manage.",
        "Gehen Sie auf Members.",
        "Klicken Sie auf Invite bzw. Add member.",
        "Tragen Sie {agencyEmail} ein.",
        "Wählen Sie die Rolle Administrator — nicht Viewer.",
        "Senden Sie die Einladung.",
      ],
      tips: [
        "Editor reicht, wenn die Agentur nur Inhalte pflegt. Für Setup und Schema ist Administrator üblich.",
        "Sanity kann statt der Projektmitglieder auch Organisationsmitglieder zeigen — prüfen Sie, dass Sie in der richtigen Ebene einladen.",
      ],
      pitfalls: ["Nicht die Organisation an die Agentur übertragen."],
      doneWhen: "{agencyEmail} steht als Administrator oder als ausstehende Einladung. Das Projekt bleibt Ihres.",
    },
  ],
}
