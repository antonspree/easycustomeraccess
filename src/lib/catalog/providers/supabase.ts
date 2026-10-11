import { schematic, screenshot, type ProviderDefinition } from "../types.ts"

export const supabase: ProviderDefinition = {
  id: "supabase",
  name: "Supabase",
  summary: "Datenbank und Auth. Owner bleibt die Kundschaft, die Agentur wird Administrator.",
  more: "Sie legen das Konto selbst an. Supabase erzeugt automatisch eine Organisation, in der Sie Owner sind. Die Agentur wird als Administrator eingeladen, nicht als Owner. Das Projekt liegt in Frankfurt (Central EU). Das Datenbankpasswort bleibt bei Ihnen. Blokr legt kein Projekt an.",
  steps: [
    {
      id: "konto",
      title: "Supabase-Konto anlegen",
      sentence: "Legen Sie das Supabase-Konto mit {email} an, nicht über die Agentur.",
      minutes: 4,
      url: "https://supabase.com/dashboard/sign-up",
      urlLabel: "Registrierung bei Supabase öffnen",
      intro:
        "Das Konto muss auf Ihre E-Mail laufen. Wenn die Agentur sich registriert und Sie später „übernimmt“, gehören Organisation und Rechnung nicht Ihnen.",
      substeps: [
        "Öffnen Sie https://supabase.com/dashboard/sign-up. Die Überschrift lautet Get started, darunter Create a new account.",
        "Die Seite ist auf Englisch. Oben stehen Continue with GitHub, Continue with ChatGPT und Continue with SSO.",
        "Darunter, nach or, liegt die E-Mail-Registrierung. Tragen Sie unter Email genau {email} ein.",
        "Wählen Sie ein eigenes Passwort unter Password. Die Agentur braucht dieses Passwort nicht.",
        "Klicken Sie auf die grüne Schaltfläche Sign up.",
      ],
      tips: [
        "Haben Sie schon ein Supabase-Konto mit {email}? Dann melden Sie sich an und fahren Sie mit der E-Mail-Bestätigung bzw. der Organisation fort.",
        "GitHub-Anmeldung ist nur sinnvoll, wenn das GitHub-Konto dieselbe E-Mail {email} verwendet.",
      ],
      pitfalls: [
        "Nicht das Konto der Agentur verwenden.",
        "Nach Sign Up erscheint oft zuerst der Hinweis, die E-Mail zu bestätigen — das ist der nächste Schritt.",
      ],
      doneWhen: "Supabase fordert eine E-Mail-Bestätigung an oder Sie landen im Dashboard mit Ihrer Adresse {email}.",
      help: "Have an account? Sign in, wenn das Konto schon existiert. Nicht Sign up wiederholen.",
      image: screenshot(
        "/guides/supabase/konto.png",
        "Öffentliche Supabase-Registrierung mit GitHub, ChatGPT, SSO, Email, Password und Sign up",
        "Aufnahme von supabase.com/dashboard/sign-up",
      ),
    },
    {
      id: "email",
      title: "E-Mail von Supabase bestätigen",
      sentence: "Bestätigen Sie die E-Mail von Supabase im Postfach von {email}.",
      minutes: 3,
      intro: "Ohne bestätigte Adresse bleiben Einladungen und das Anlegen von Projekten oft gesperrt.",
      substeps: [
        "Öffnen Sie das Postfach von {email}. Prüfen Sie auch Spam und den Ordner Updates.",
        "Suchen Sie die Nachricht von Supabase (Absender typischerweise noreply@supabase.com).",
        "Klicken Sie auf den Bestätigungslink, oft Confirm your email oder analog.",
        "Sie sollten zurück ins Supabase-Dashboard gelangen.",
      ],
      tips: ["Keine Mail nach ein paar Minuten? Auf der Anmeldeseite gibt es meist Resend confirmation email."],
      pitfalls: [
        "Den Link nicht auf einem anderen Konto im Browser öffnen. Im Zweifel ein privates Fenster nutzen.",
        "Manche Anbieter blockieren den ersten Klick. Dann den Link kopieren und einfügen.",
      ],
      doneWhen: "Sie sind im Supabase-Dashboard angemeldet, ohne erneute Aufforderung zur E-Mail-Bestätigung.",
      image: schematic("/guides/supabase/email.svg", "Schema einer Bestätigungsmail von Supabase"),
    },
    {
      id: "organisation",
      title: "Organisation auf Ihren Namen prüfen",
      sentence: "Benennen Sie die Organisation nach sich und prüfen Sie, dass {email} als Owner steht.",
      minutes: 4,
      url: "https://supabase.com/dashboard/organizations",
      urlLabel: "Organisationen in Supabase öffnen",
      intro:
        "Beim ersten Konto legt Supabase automatisch eine Organisation an und setzt Sie als Owner. Diese Organisation soll nach Ihnen oder Ihrer Firma heißen, nicht nach der Agentur.",
      substeps: [
        "Öffnen Sie das Dashboard und wählen Sie oben links die Organisation.",
        "Gehen Sie in die Organisationseinstellungen (Organization Settings).",
        "Unter General steht Organization name. Benennen Sie sie nach sich oder Ihrer Firma.",
        "Öffnen Sie Team. Hinter Ihrer Adresse {email} muss Owner stehen.",
      ],
      tips: ["Eine neue Organisation brauchen Sie nur, wenn die vorhandene einer anderen Person gehört."],
      pitfalls: [
        "Nicht die Organisation der Agentur auswählen.",
        "Owner nicht an die Agentur abgeben.",
      ],
      doneWhen: "Die Organisation trägt Ihren Namen und {email} steht als Owner.",
      image: schematic("/guides/supabase/organisation.svg", "Schema der Organization Settings bei Supabase"),
    },
    {
      id: "einladung",
      title: "Agentur als Administrator einladen",
      sentence: "Laden Sie {agencyEmail} als Administrator ein und behalten Sie die Ownership.",
      minutes: 4,
      intro:
        "Administrator darf Projekte anlegen und verwalten, aber keine Owner hinzufügen und die Organisation nicht übernehmen. Die Einladung gilt 24 Stunden.",
      substeps: [
        "Bleiben Sie in Ihrer Organisation und öffnen Sie Team bzw. Team Settings.",
        "Klicken Sie auf Invite oder Invite member.",
        "Tragen Sie {agencyEmail} ein.",
        "Wählen Sie die Rolle Administrator — nicht Owner, nicht Developer.",
        "Senden Sie die Einladung (Send invitation oder Invite).",
      ],
      tips: [
        "{agency} muss die Mail innerhalb von 24 Stunden annehmen. Danach Einladung erneut senden (Resend).",
        "Die Rolle gilt für die ganze Organisation, also für alle jetzigen und künftigen Projekte.",
      ],
      pitfalls: [
        "Nicht Owner vergeben. Sonst kann die Agentur Sie später entfernen.",
        "Prüfen Sie Tippfehler in {agencyEmail}.",
      ],
      doneWhen: "{agencyEmail} steht unter Team als eingeladen oder als Administrator. Sie bleiben Owner.",
      help: "Wenn Invite fehlt, sind Sie nicht in der richtigen Organisation oder nicht als Owner angemeldet.",
      image: schematic("/guides/supabase/einladung.svg", "Schema der Einladung mit Rolle Administrator"),
    },
    {
      id: "projekt",
      title: "Projekt in Frankfurt anlegen",
      sentence: "Legen Sie das Projekt in Ihrer Organisation an, Region Frankfurt, und verwahren Sie das Datenbankpasswort selbst.",
      minutes: 6,
      intro:
        "Das Projekt gehört in Ihre Organisation. Die Region Central EU (Frankfurt) hält die Daten in der EU. Das Datenbankpasswort zeigt Supabase später nicht wieder im Klartext.",
      substeps: [
        "Prüfen Sie oben links, dass Ihre Organisation aktiv ist.",
        "Klicken Sie auf New project oder Create new project.",
        "Vergeben Sie einen Projektnamen, zum Beispiel den Namen Ihrer Website.",
        "Unter Database password setzen Sie ein eigenes, starkes Passwort und speichern es bei sich — nicht in Blokr, nicht unverschlüsselt an die Agentur.",
        "Unter Region wählen Sie Central EU (Frankfurt). Der interne Code ist eu-central-1.",
        "Starten Sie das Projekt mit Create new project. Der Aufbau dauert oft ein bis zwei Minuten.",
      ],
      tips: ["Generate a password ist erlaubt, wenn Sie das Ergebnis sofort selbst speichern."],
      pitfalls: [
        "Nicht eine Region in den USA wählen, wenn Ihre Daten in der EU bleiben sollen.",
        "Das Datenbankpasswort nicht in den Chat oder in eine offene E-Mail schreiben.",
      ],
      doneWhen: "Das Projekt ist bereit (Ready) und liegt in Ihrer Organisation in der Region Frankfurt.",
      image: schematic("/guides/supabase/projekt.svg", "Schema des Dialogs Create new project mit Region Frankfurt"),
    },
    {
      id: "pruefen",
      title: "Owner und Administrator prüfen",
      sentence: "Prüfen Sie, dass Sie Owner bleiben und {agencyEmail} als Administrator steht.",
      minutes: 2,
      intro: "Ein kurzer Blick verhindert, dass Ownership oder Rolle verrutscht sind.",
      substeps: [
        "Öffnen Sie erneut Team in Ihrer Organisation.",
        "Ihre Adresse {email} muss Owner sein.",
        "{agencyEmail} muss Administrator sein (oder die Einladung noch offen).",
        "Stellen Sie sicher, dass niemand außer Ihnen Owner ist, es sei denn, Sie haben das bewusst so gewollt.",
      ],
      doneWhen: "Sie sind Owner, die Agentur ist Administrator oder hat eine offene Administrator-Einladung.",
      image: schematic("/guides/supabase/pruefen.svg", "Schema der Team-Liste mit Owner und Administrator"),
    },
  ],
}
