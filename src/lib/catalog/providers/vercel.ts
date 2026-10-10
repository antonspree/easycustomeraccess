import type { ProviderDefinition } from "../types.ts"

export const vercel: ProviderDefinition = {
  id: "vercel",
  name: "Vercel",
  summary: "Hosting. Owner bleibt die Kundschaft. Einladung der Agentur ist im Tarif Pro möglich (Rolle Developer).",
  more: "Konto und Team gehören Ihnen. Vercel erlaubt das Einladen weiterer Personen nicht mehr im kostenlosen Tarif Hobby — dafür ist Pro nötig. Die Agentur wird Developer, nicht Owner. Blokr legt kein Projekt an.",
  steps: [
    {
      id: "konto",
      title: "Vercel-Konto anlegen",
      sentence: "Legen Sie das Vercel-Konto mit {email} an.",
      minutes: 4,
      url: "https://vercel.com/signup",
      urlLabel: "Registrierung bei Vercel öffnen",
      intro:
        "Sie registrieren sich selbst. Hobby ist der kostenlose Starttarif. Teammitglieder lassen sich dort nicht einladen; das kommt im Schritt zur Einladung.",
      substeps: [
        "Öffnen Sie https://vercel.com/signup.",
        "Sie können Continue with GitHub, GitLab, Bitbucket oder die E-Mail-Registrierung nutzen.",
        "Wenn Sie E-Mail wählen: tragen Sie {email} ein und folgen Sie Sign Up.",
        "Nutzen Sie GitHub nur, wenn dieses GitHub-Konto zu {email} gehört.",
      ],
      tips: ["Ein vorhandenes Konto mit {email} können Sie weiterverwenden. Nicht das Konto der Agentur nehmen."],
      pitfalls: [
        "Nach der Registrierung legt Vercel oft automatisch ein persönliches Hobby-Team an. Das ist normal.",
        "Commercial-Projekte dürfen laut Vercel nicht dauerhaft auf Hobby laufen. {agency} klärt den Tarif mit Ihnen.",
      ],
      doneWhen: "Sie sind bei Vercel angemeldet und sehen das Dashboard unter Ihrer Adresse {email}.",
      help: "Account already exists: dann Log in statt Sign Up verwenden.",
    },
    {
      id: "email",
      title: "E-Mail von Vercel bestätigen",
      sentence: "Bestätigen Sie die E-Mail von Vercel im Postfach von {email}.",
      minutes: 3,
      intro: "Ohne bestätigte E-Mail bleiben Teamfunktionen und ein Teil der Einstellungen gesperrt.",
      substeps: [
        "Öffnen Sie das Postfach von {email} und prüfen Sie Spam.",
        "Suchen Sie die Nachricht von Vercel (noreply@vercel.com oder ähnlich).",
        "Klicken Sie auf Verify Email Address bzw. den Bestätigungslink.",
      ],
      tips: ["Keine Mail? Im Dashboard unter Account Settings → Email gibt es meist Resend."],
      pitfalls: ["Den Link in dem Browser öffnen, in dem Sie bei Vercel angemeldet bleiben wollen."],
      doneWhen: "Vercel zeigt die Adresse {email} als bestätigt (Verified).",
    },
    {
      id: "team",
      title: "Team auf Ihren Namen legen",
      sentence: "Legen Sie das Team auf Ihren Namen an, nicht auf den der Agentur.",
      minutes: 4,
      url: "https://vercel.com/docs/accounts",
      urlLabel: "Vercel-Hilfe zu Konten und Teams",
      intro:
        "Oben links im Dashboard sitzt der Team-Umschalter. Das Team, in dem Ihre Website liegen soll, muss Ihnen gehören.",
      substeps: [
        "Klicken Sie oben links auf den Team-Umschalter (Name des aktuellen Teams).",
        "Wählen Sie Create a Team bzw. Create Team, falls noch kein eigenes Team existiert.",
        "Vergeben Sie einen Namen nach sich oder Ihrer Firma — nicht den Namen von {agency}.",
        "Bestätigen Sie die Anlage. Das erste Team ist oft ein Hobby-Team; das ist in Ordnung.",
      ],
      tips: ["Wenn schon ein Team mit Ihrem Namen existiert und Sie Owner sind, müssen Sie kein zweites anlegen."],
      pitfalls: [
        "Nicht das Team der Agentur auswählen und dort weiterarbeiten.",
        "Hobby erlaubt nur eine Person. Für die Einladung der Agentur brauchen Sie später Pro.",
      ],
      doneWhen: "Im Team-Umschalter steht Ihr Name oder Ihre Firma, und Sie sind Owner dieses Teams.",
    },
    {
      id: "einladung",
      title: "Agentur als Developer einladen",
      sentence: "Laden Sie {agencyEmail} als Developer ein. Dafür ist der Tarif Pro nötig.",
      minutes: 6,
      url: "https://vercel.com/docs/rbac/managing-team-members",
      urlLabel: "Vercel-Hilfe zu Teammitgliedern",
      intro:
        "Einladungen sind bei Vercel nur in den Tarifen Pro und Enterprise möglich, nicht in Hobby. Sie bleiben Owner. Die passende Rolle für die Agentur ist Developer — nicht Owner.",
      substeps: [
        "Wählen Sie oben links Ihr eigenes Team.",
        "Öffnen Sie in der Seitenleiste Settings und dann Members.",
        "Wenn Vercel ein Upgrade verlangt: wechseln Sie unter Settings → Billing auf Pro. {agency} spricht die Kosten vorher mit Ihnen ab.",
        "Tragen Sie {agencyEmail} ein.",
        "Wählen Sie die Rolle Developer (nicht Owner, nicht Viewer).",
        "Klicken Sie auf Invite. Die Person hat 7 Tage Zeit, anzunehmen.",
      ],
      tips: [
        "Viewer sieht vieles, kann aber nicht deployen. Für die Arbeit der Agentur ist Developer üblich.",
        "Unter Pending Invitations sehen Sie, ob die Einladung noch offen ist.",
      ],
      pitfalls: [
        "Hobby zeigt die Einladung nicht oder verlangt ein Upgrade. Das ist die aktuelle Vercel-Regel, kein Fehler von Blokr.",
        "Nicht Owner an die Agentur vergeben.",
      ],
      doneWhen: "{agencyEmail} steht unter Members als Developer oder als ausstehende Einladung. Sie bleiben Owner.",
      help: "Wenn Invite fehlt, sind Sie nicht Owner oder das Team ist noch Hobby.",
    },
  ],
}
