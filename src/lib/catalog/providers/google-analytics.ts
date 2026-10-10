import type { ProviderDefinition } from "../types.ts"

export const googleAnalytics: ProviderDefinition = {
  id: "google-analytics",
  name: "Google Analytics",
  summary: "Analyse. Administrator bleibt die Kundschaft, die Agentur wird Bearbeiter.",
  more: "Google-Konto und Analytics-Property gehören Ihnen. Die Agentur erhält die Rolle Bearbeiter (englisch Editor). Blokr legt keine Property an.",
  steps: [
    {
      id: "google",
      title: "Google-Konto mit Ihrer E-Mail nutzen",
      sentence: "Nutzen Sie ein Google-Konto mit {email}, oder legen Sie es damit an.",
      minutes: 5,
      url: "https://accounts.google.com/SignUp",
      urlLabel: "Google-Konto anlegen",
      intro:
        "Analytics hängt an einem Google-Konto. Dieses Konto muss {email} verwenden. Ein privates Gmail-Konto einer anderen Person eignet sich nicht.",
      substeps: [
        "Öffnen Sie https://accounts.google.com/SignUp, wenn noch kein Google-Konto mit {email} existiert.",
        "Google fragt nach Name und einem Passwort. Als E-Mail können Sie {email} verwenden, auch wenn das kein Gmail ist (Statt Gmail-Adresse verwenden bzw. Use your existing email).",
        "Bestätigen Sie die Adresse über den Code, den Google an {email} schickt.",
        "Haben Sie bereits ein Google-Konto mit {email}: öffnen Sie https://analytics.google.com und melden Sie sich damit an.",
      ],
      tips: [
        "Die Google-Oberfläche folgt der Sprache Ihres Kontos. Deutsch und Englisch wechseln die Labels.",
        "Falls Google 2-Schritt-Bestätigung verlangt, richten Sie sie auf Ihrem Telefon ein.",
      ],
      pitfalls: [
        "Nicht das Google-Konto der Agentur verwenden.",
        "Ein Firmen-Google-Workspace-Konto eignet sich, wenn {email} dazugehört und Sie Administratorrechte für Analytics behalten.",
      ],
      doneWhen: "Sie sind in einem Google-Konto angemeldet, dessen Adresse {email} ist.",
    },
    {
      id: "property",
      title: "Analytics-Konto und Property anlegen",
      sentence: "Legen Sie das Analytics-Konto und die Property auf Ihren Namen an.",
      minutes: 8,
      url: "https://analytics.google.com/",
      urlLabel: "Google Analytics öffnen",
      intro:
        "Analytics unterscheidet Konto (Account) und Property. Beides soll Ihnen gehören. Die Agentur legt das nicht auf ihren Namen an.",
      substeps: [
        "Öffnen Sie https://analytics.google.com/ und starten Sie mit Messung starten bzw. Start measuring, falls noch nichts existiert.",
        "Kontoname: Ihr Name oder Ihre Firma, nicht {agency}.",
        "Property-Name: meist der Website-Name. Datenstrom (Web) mit Ihrer Domain.",
        "Land/Zeitzone und Währung passend zu Ihnen wählen.",
        "Die Hinweise zu Datenverarbeitung und Werbefunktionen müssen Sie selbst akzeptieren.",
      ],
      tips: [
        "Existiert bereits eine Property auf Ihren Namen, müssen Sie keine zweite anlegen. {agency} sagt Ihnen, welche genutzt werden soll.",
        "Den Mess-ID-Code (G-…) müssen Sie nicht in Blokr eintragen.",
      ],
      pitfalls: ["Nicht eine Property in einem Analytics-Konto der Agentur anlegen."],
      doneWhen: "In Verwaltung sehen Sie ein Konto und eine Property, die nach Ihnen bzw. Ihrer Website benannt sind.",
    },
    {
      id: "einladung",
      title: "Agentur als Bearbeiter hinzufügen",
      sentence: "Fügen Sie {agencyEmail} als Bearbeiter hinzu.",
      minutes: 5,
      intro:
        "Der Weg heißt Verwaltung (Admin, Zahnrad unten links) → Zugriffsverwaltung für Properties bzw. Property access management. Die Rolle Bearbeiter entspricht englisch Editor.",
      substeps: [
        "Öffnen Sie in Analytics Verwaltung / Admin.",
        "In der Spalte Property wählen Sie Zugriffsverwaltung bzw. Property access management.",
        "Klicken Sie auf das Plus und auf Nutzer hinzufügen / Add users.",
        "E-Mail-Adressen: {agencyEmail}. Die Agentur braucht ein Google-Konto mit genau dieser Adresse.",
        "Rolle: Bearbeiter / Editor — nicht Administrator.",
        "Lassen Sie Nutzer benachrichtigen aktiv und klicken Sie auf Hinzufügen / Add.",
      ],
      tips: [
        "Administrator behalten Sie. Bearbeiter reicht, damit die Agentur Messwerte und Einstellungen pflegen kann.",
        "Falls die Agentur mehrere Properties braucht, wiederholen Sie das pro Property oder geben Sie Zugriff auf Kontoebene — aber nie die Administratorrolle ab.",
      ],
      pitfalls: [
        "Ohne Google-Konto hinter {agencyEmail} schlägt das Hinzufügen fehl.",
        "Nicht die Inhaberschaft des Google-Kontos teilen (kein Passwort).",
      ],
      doneWhen: "{agencyEmail} steht in der Zugriffsverwaltung als Bearbeiter. Sie bleiben Administrator.",
    },
  ],
}
