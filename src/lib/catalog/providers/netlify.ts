import type { ProviderDefinition } from "../types.ts"

export const netlify: ProviderDefinition = {
  id: "netlify",
  name: "Netlify",
  summary: "Hosting. Owner bleibt die Kundschaft, die Agentur wird Developer.",
  more: "Sie besitzen Konto, Team und Abrechnung. Die Agentur arbeitet als Developer. Blokr legt keine Site an.",
  steps: [
    {
      id: "konto",
      title: "Netlify-Konto anlegen",
      sentence: "Legen Sie das Netlify-Konto mit {email} an.",
      minutes: 4,
      url: "https://app.netlify.com/signup",
      urlLabel: "Registrierung bei Netlify öffnen",
      intro: "Das Team, in dem später die Website liegt, muss Ihnen gehören — nicht der Agentur.",
      substeps: [
        "Öffnen Sie https://app.netlify.com/signup.",
        "Wählen Sie Sign up with email oder die Anmeldung über GitHub / GitLab / Bitbucket, sofern das Konto zu {email} gehört.",
        "Tragen Sie bei der E-Mail-Registrierung {email} ein und setzen Sie ein eigenes Passwort.",
        "Schließen Sie Sign up ab.",
      ],
      tips: ["Ein vorhandenes Konto mit {email} können Sie weiterverwenden."],
      pitfalls: ["Nicht mit dem Netlify-Konto von {agency} arbeiten und Sie nur als Zuschauer einladen."],
      doneWhen: "Sie sind bei Netlify angemeldet und sehen Ihr Team-Dashboard.",
      help: "Already have an account? dann Log in wählen.",
    },
    {
      id: "email",
      title: "E-Mail von Netlify bestätigen",
      sentence: "Bestätigen Sie die E-Mail von Netlify im Postfach von {email}.",
      minutes: 3,
      intro: "Netlify schickt eine Bestätigung. Ohne sie bleiben Teile des Dashboards gesperrt.",
      substeps: [
        "Öffnen Sie das Postfach von {email}, inklusive Spam.",
        "Öffnen Sie die Nachricht von Netlify.",
        "Klicken Sie auf den Bestätigungslink (Verify your email oder ähnlich).",
      ],
      tips: ["Im Dashboard gibt es oft Resend verification email, falls nichts ankommt."],
      pitfalls: ["Den Link nicht in einem fremden Browser-Profil öffnen."],
      doneWhen: "Netlify akzeptiert die Anmeldung ohne erneute E-Mail-Aufforderung.",
    },
    {
      id: "einladung",
      title: "Agentur als Developer einladen",
      sentence: "Laden Sie {agencyEmail} als Developer ein.",
      minutes: 5,
      url: "https://docs.netlify.com/manage/accounts-and-billing/team-management/manage-team-members/",
      urlLabel: "Netlify-Hilfe zu Teammitgliedern",
      intro:
        "Nur Team-Owner können Mitglieder einladen. Developer darf Sites anlegen und konfigurieren, aber nicht das Team übernehmen. Die früher Collaborator genannte Rolle heißt jetzt Developer.",
      substeps: [
        "Gehen Sie oben links auf Projects neben dem aktuellen Projektnamen, damit das Team-Dashboard erscheint.",
        "Öffnen Sie Team settings → Members.",
        "Klicken Sie auf Add members.",
        "Tragen Sie {agencyEmail} ein und wählen Sie die Rolle Developer — nicht Owner, nicht Reviewer.",
        "Wenn Netlify nach Projekten fragt: Sie dürfen die Agentur ohne bestehendes Projekt einladen. Bestätigen Sie die Einladung.",
      ],
      tips: [
        "Die Person bekommt eine E-Mail und sieht die Einladung zusätzlich in ihrem Netlify-Dashboard.",
        "Reviewer kann nur Feedback geben, nicht deployen.",
      ],
      pitfalls: [
        "Nicht Owner vergeben.",
        "Falls Add members fehlt, sind Sie nicht Owner dieses Teams.",
      ],
      doneWhen: "{agencyEmail} steht unter Members als Developer oder als ausstehende Einladung. Sie bleiben Owner.",
    },
  ],
}
