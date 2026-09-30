import type { ProviderDefinition } from "@/lib/providers/types"

const guide = "guide"

export const providers: ProviderDefinition[] = [
  {
    id: "supabase",
    name: "Supabase",
    category: "Backend",
    summary:
      "Datenbank und Auth im Konto der Kundschaft. Die Agentur wird Administrator, Owner bleibt der Kunde.",
    adapterId: guide,
    steps: [
      {
        id: "konto",
        title: "Konto mit der eigenen E-Mail anlegen",
        instruction:
          "Öffnen Sie die Registrierung und wählen Sie die Anmeldung per E-Mail, nicht über das Konto der Agentur. Das Passwort legen Sie selbst fest und bewahren es in Ihrem Passwortmanager. Tragen Sie es hier nicht ein.",
        email:
          "Nur {customerEmail}. Eine Einladung an {agencyEmail} ersetzt dieses Konto nicht.",
        agencyRole:
          "Noch keine. Sie sind alleinige Inhaberin bzw. alleiniger Inhaber des neuen Kontos.",
        doneMeans:
          "Sie sehen das Supabase-Dashboard oder den Hinweis, dass eine Bestätigungsmail an {customerEmail} unterwegs ist.",
        href: "https://supabase.com/dashboard/sign-up",
        hrefLabel: "Supabase-Registrierung öffnen",
      },
      {
        id: "email",
        title: "E-Mail-Adresse bestätigen",
        instruction:
          "Öffnen Sie das Postfach und klicken Sie den Bestätigungslink von Supabase. Schauen Sie auch in den Spam-Ordner. Wenn das Konto schon bestätigt war, ist dieser Schritt erledigt.",
        email: "Die Mail muss an {customerEmail} angekommen sein, nicht an die Agentur.",
        agencyRole: "Weiterhin keine Rolle für {agencyName}.",
        doneMeans:
          "Der Link öffnet das Dashboard und das Konto von {customerEmail} ist bestätigt.",
      },
      {
        id: "organisation",
        title: "Organisation auf den eigenen Namen setzen",
        instruction:
          "Supabase legt beim ersten Login eine Organisation an. Benennen Sie sie nach {customerName}, nicht nach der Agentur. Öffnen Sie danach Team und prüfen Sie, dass {customerEmail} als Owner steht.",
        email: "Sie sind dabei als {customerEmail} angemeldet.",
        agencyRole:
          "Sie bleiben Owner. Die Agentur wird in diesem Schritt noch nicht eingetragen.",
        doneMeans:
          "Die Organisation heißt nach Ihnen, und Sie stehen in der Teamliste als Owner.",
        href: "https://supabase.com/dashboard",
        hrefLabel: "Supabase-Dashboard öffnen",
      },
      {
        id: "einladung",
        title: "Agentur als Administrator einladen",
        instruction:
          "Öffnen Sie in der Organisation die Teamliste (Organization Settings, Team) und laden Sie ein Mitglied ein. Übertragen Sie die Ownership nicht. Schicken Sie die Einladung ab.",
        email:
          "Einladung an {agencyEmail}. Ihr Login bleibt {customerEmail}.",
        agencyRole:
          "Administrator. Diese Rolle darf Projekte und Mitglieder verwalten. Owner bleiben Sie.",
        doneMeans:
          "{agencyEmail} steht als Administrator in der Liste, Status eingeladen oder aktiv. Sie stehen weiterhin als Owner.",
        href: "https://supabase.com/dashboard",
        hrefLabel: "Team in Supabase öffnen",
      },
      {
        id: "projekt",
        title: "Projekt in der eigenen Organisation anlegen",
        instruction:
          "Legen Sie ein neues Projekt in genau dieser Organisation an. Wählen Sie einen Namen für Ihr Vorhaben. Wenn die Daten in der EU liegen sollen, nehmen Sie die Region Frankfurt (eu-central-1). Das Datenbankpasswort setzen und verwahren Sie selbst. Es wird hier nicht abgefragt.",
        email: "Das Projekt gehört zur Organisation Ihres Kontos {customerEmail}.",
        agencyRole:
          "Keine zusätzliche Projektrolle. Der Zugriff der Agentur kommt aus der Einladung als Administrator.",
        doneMeans:
          "Das Projekt ist in Ihrer Organisation sichtbar und nicht in einem Konto der Agentur.",
        href: "https://supabase.com/dashboard",
        hrefLabel: "Projekt in Supabase anlegen",
      },
      {
        id: "pruefen",
        title: "Owner und Einladung gegeneinander prüfen",
        instruction:
          "Öffnen Sie die Teamliste ein weiteres Mal. Es müssen zwei Zeilen stimmen: Ihre Adresse als Owner, die Agentur als Administrator. Steht die Einladung noch auf Invited, ist Ihr Teil fertig. Die Agentur nimmt sie im eigenen Postfach an.",
        email: "Abgleich von {customerEmail} und {agencyEmail}.",
        agencyRole: "Agentur bleibt Administrator, Sie bleiben Owner.",
        doneMeans:
          "Beide Einträge stimmen. Supabase ist für diese Einrichtung bestätigt. Es wurde kein Projekt über eine Schnittstelle angelegt.",
        href: "https://supabase.com/dashboard",
        hrefLabel: "Teamliste prüfen",
      },
    ],
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "Hosting",
    summary:
      "Hosting-Team im Hobby-Tarif auf den Namen der Kundschaft. Die Agentur wird Member.",
    adapterId: guide,
    steps: [
      {
        id: "konto",
        title: "Vercel-Konto anlegen",
        instruction:
          "Registrieren Sie ein eigenes Vercel-Konto. Der Hobby-Tarif ist kostenlos. Nutzen Sie nicht das bestehende Team der Agentur.",
        email: "Registrierung mit {customerEmail}.",
        agencyRole: "Noch keine. Das Konto gehört Ihnen.",
        doneMeans: "Sie sind im Vercel-Dashboard angemeldet oder müssen die E-Mail noch bestätigen.",
        href: "https://vercel.com/signup",
        hrefLabel: "Vercel-Registrierung öffnen",
      },
      {
        id: "email",
        title: "E-Mail bestätigen",
        instruction:
          "Klicken Sie den Bestätigungslink in Ihrem Postfach. Ohne bestätigte Adresse kann Vercel keine Teammitglieder einladen.",
        email: "Der Link geht an {customerEmail}.",
        agencyRole: "Keine.",
        doneMeans: "Die Adresse ist bestätigt und das Dashboard lässt sich normal öffnen.",
      },
      {
        id: "team",
        title: "Team auf den eigenen Namen anlegen",
        instruction:
          "Legen Sie ein neues Team an und benennen Sie es nach {customerName}. Wählen Sie den Hobby-Plan, damit keine Kosten bei der Agentur entstehen. Sie sind Owner dieses Teams.",
        email: "Das Team hängt an {customerEmail}.",
        agencyRole: "Noch nicht eingeladen. Sie bleiben Owner.",
        doneMeans: "Im Kontomenü sehen Sie ein Team mit Ihrem Namen, und Sie sind dort Owner.",
        href: "https://vercel.com/new",
        hrefLabel: "Vercel öffnen",
      },
      {
        id: "einladung",
        title: "Agentur als Member einladen",
        instruction:
          "Öffnen Sie im Team die Einstellungen und dort Members. Laden Sie die Agentur ein. Übertragen Sie das Team nicht.",
        email: "Einladung an {agencyEmail}.",
        agencyRole:
          "Member. Member kann Projekte im Team bearbeiten. Owner und Abrechnung bleiben bei Ihnen.",
        doneMeans:
          "{agencyEmail} steht unter Members. Sie stehen als Owner. Vercel hat dadurch kein Projekt automatisch angelegt.",
        href: "https://vercel.com/account/settings",
        hrefLabel: "Vercel-Einstellungen öffnen",
      },
    ],
  },
  {
    id: "netlify",
    name: "Netlify",
    category: "Hosting",
    summary:
      "Netlify-Team der Kundschaft. Die Agentur arbeitet als Developer, Owner bleibt der Kunde.",
    adapterId: guide,
    steps: [
      {
        id: "konto",
        title: "Netlify-Konto anlegen",
        instruction:
          "Legen Sie ein Konto bei Netlify an. Der Start-Tarif ist kostenlos. Melden Sie sich nicht im Team der Agentur an.",
        email: "Konto mit {customerEmail}.",
        agencyRole: "Keine.",
        doneMeans: "Sie erreichen das Netlify-Dashboard mit Ihrem Konto.",
        href: "https://app.netlify.com/signup",
        hrefLabel: "Netlify-Registrierung öffnen",
      },
      {
        id: "email",
        title: "E-Mail bestätigen",
        instruction: "Bestätigen Sie die Adresse über die Mail von Netlify.",
        email: "Mail an {customerEmail}.",
        agencyRole: "Keine.",
        doneMeans: "Die Anmeldung bleibt erhalten und die Adresse gilt als bestätigt.",
      },
      {
        id: "einladung",
        title: "Agentur als Developer einladen",
        instruction:
          "Öffnen Sie die Team-Einstellungen und dort Members. Fügen Sie die Agentur hinzu. Geben Sie das Team nicht ab.",
        email: "Einladung an {agencyEmail}. Ihr Konto bleibt {customerEmail}.",
        agencyRole:
          "Developer. Developer darf Sites bauen und veröffentlichen. Owner bleiben Sie, inklusive Abrechnung.",
        doneMeans:
          "{agencyEmail} ist als Developer gelistet, {customerEmail} als Owner.",
        href: "https://app.netlify.com/",
        hrefLabel: "Netlify-Dashboard öffnen",
      },
    ],
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    category: "Hosting",
    summary:
      "Cloudflare-Konto der Kundschaft für DNS und Hosting. Die Agentur wird Administrator, nicht Super Administrator.",
    adapterId: guide,
    steps: [
      {
        id: "konto",
        title: "Cloudflare-Konto anlegen",
        instruction:
          "Registrieren Sie ein eigenes Cloudflare-Konto. Der kostenlose Tarif reicht für DNS und viele Hosting-Aufgaben. Das Konto der Agentur wird nicht verwendet.",
        email: "Registrierung mit {customerEmail}.",
        agencyRole: "Keine. Sie werden Super Administrator dieses Kontos.",
        doneMeans: "Das Konto existiert und Cloudflare hat eine Bestätigungsmail geschickt oder Sie sind bereits im Dashboard.",
        href: "https://dash.cloudflare.com/sign-up",
        hrefLabel: "Cloudflare-Registrierung öffnen",
      },
      {
        id: "email",
        title: "E-Mail bestätigen",
        instruction: "Öffnen Sie die Mail von Cloudflare und bestätigen Sie die Adresse.",
        email: "Bestätigung an {customerEmail}.",
        agencyRole: "Keine.",
        doneMeans: "Sie können sich mit {customerEmail} im Dashboard anmelden.",
      },
      {
        id: "einladung",
        title: "Agentur als Administrator einladen",
        instruction:
          "Öffnen Sie Manage Account und dort Members. Laden Sie die Agentur ein. Wählen Sie nicht Super Administrator und übertragen Sie das Konto nicht.",
        email: "Einladung an {agencyEmail}.",
        agencyRole:
          "Administrator. Damit kann die Agentur DNS, Zonen und viele Produkte pflegen. Super Administrator bleiben Sie.",
        doneMeans:
          "{agencyEmail} steht als Administrator in der Mitgliederliste, Sie als Super Administrator.",
        href: "https://dash.cloudflare.com/profile",
        hrefLabel: "Cloudflare-Dashboard öffnen",
      },
    ],
  },
  {
    id: "github",
    name: "GitHub",
    category: "Code",
    summary:
      "Kostenlose GitHub-Organisation der Kundschaft. Die Agentur wird Member, nicht Owner.",
    adapterId: guide,
    steps: [
      {
        id: "konto",
        title: "GitHub-Konto anlegen",
        instruction:
          "Falls Sie noch kein GitHub-Konto mit Ihrer Adresse haben, legen Sie eines an. Der kostenlose Plan reicht. Repositories der Agentur werden hier nicht zum Eigentum.",
        email: "Konto mit {customerEmail}.",
        agencyRole: "Keine.",
        doneMeans: "Sie sind bei GitHub angemeldet und die Adresse gehört zu diesem Konto.",
        href: "https://github.com/signup",
        hrefLabel: "GitHub-Registrierung öffnen",
      },
      {
        id: "email",
        title: "E-Mail bestätigen",
        instruction:
          "Bestätigen Sie die Adresse über die Mail von GitHub. Ohne bestätigte Adresse lässt sich keine Organisation sinnvoll betreiben.",
        email: "Mail an {customerEmail}.",
        agencyRole: "Keine.",
        doneMeans: "Unter Settings, Emails steht die Adresse als verified.",
        href: "https://github.com/settings/emails",
        hrefLabel: "E-Mail-Einstellungen öffnen",
      },
      {
        id: "organisation",
        title: "Organisation anlegen",
        instruction:
          "Legen Sie eine neue Organisation an und wählen Sie den kostenlosen Plan. Der Name soll zu {customerName} passen. Sie sind Owner. Legen Sie die Organisation nicht unter dem Konto der Agentur an.",
        email: "Die Organisation gehört zum Konto {customerEmail}.",
        agencyRole: "Noch nicht Mitglied. Owner sind Sie.",
        doneMeans: "Die Organisation existiert und Sie sehen sich selbst als Owner.",
        href: "https://github.com/account/organizations/new",
        hrefLabel: "GitHub-Organisation anlegen",
      },
      {
        id: "einladung",
        title: "Agentur als Member einladen",
        instruction:
          "Öffnen Sie in der Organisation People und laden Sie ein Mitglied ein. Wenn GitHub nach einem Benutzernamen fragt, tragen Sie die E-Mail ein, sofern sie im GitHub-Konto der Agentur hinterlegt ist. Vergeben Sie nicht die Rolle Owner.",
        email: "Einladung an {agencyEmail}.",
        agencyRole:
          "Member. Member kann an Repositories arbeiten, die Sie freigeben. Owner der Organisation bleiben Sie.",
        doneMeans:
          "Unter People steht die Agentur als Member und Sie als Owner. Es wurde kein Repository über eine Schnittstelle angelegt.",
        href: "https://github.com/settings/organizations",
        hrefLabel: "Organisationen öffnen",
      },
    ],
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    category: "Analyse",
    summary:
      "Analytics-Konto im Google-Konto der Kundschaft. Die Agentur bekommt die Rolle Bearbeiter.",
    adapterId: guide,
    steps: [
      {
        id: "google",
        title: "Google-Konto mit der eigenen E-Mail nutzen",
        instruction:
          "Öffnen Sie Analytics mit Ihrem Google-Konto. Wenn zu {customerEmail} noch kein Google-Konto gehört, legen Sie es zuerst an. Nutzen Sie nicht das Google-Konto der Agentur.",
        email: "Google-Konto von {customerEmail}.",
        agencyRole: "Keine.",
        doneMeans: "Sie sind mit {customerEmail} bei Google angemeldet.",
        href: "https://accounts.google.com/signup",
        hrefLabel: "Google-Konto anlegen oder prüfen",
      },
      {
        id: "property",
        title: "Analytics-Konto und Property anlegen",
        instruction:
          "Erstellen Sie in Analytics ein Konto auf den Namen {customerName} und darin eine Property für die Website. Die Zeitzone und die Währung wählen Sie selbst. Es wird kein Mess-Code in dieses Werkzeug kopiert.",
        email: "Das Analytics-Konto hängt an {customerEmail}.",
        agencyRole:
          "Sie sind Administrator des neuen Kontos. Die Agentur ist noch nicht berechtigt.",
        doneMeans:
          "Unter Verwaltung sehen Sie das Konto und die Property, und {customerEmail} ist Administrator.",
        href: "https://analytics.google.com/",
        hrefLabel: "Google Analytics öffnen",
      },
      {
        id: "einladung",
        title: "Agentur als Bearbeiter hinzufügen",
        instruction:
          "Öffnen Sie Verwaltung, dann Kontozugriff verwalten. Fügen Sie einen Nutzer hinzu und schicken Sie die Benachrichtigung. Machen Sie die Agentur nicht zum Administrator.",
        email: "Nutzer {agencyEmail}. Sie bleiben mit {customerEmail} angemeldet.",
        agencyRole:
          "Bearbeiter. Bearbeiter kann Berichte und die Property einrichten. Administrator bleiben Sie.",
        doneMeans:
          "{agencyEmail} steht mit der Rolle Bearbeiter in der Zugriffsverwaltung. Es wurde keine Property über eine API angelegt.",
        href: "https://analytics.google.com/",
        hrefLabel: "Zugriffsverwaltung öffnen",
      },
    ],
  },
  {
    id: "google-search-console",
    name: "Google Search Console",
    category: "Analyse",
    summary:
      "Search-Console-Property im Google-Konto der Kundschaft. Die Agentur erhält vollen Zugriff, Inhaber bleiben Sie.",
    adapterId: guide,
    steps: [
      {
        id: "konto",
        title: "Mit dem eigenen Google-Konto anmelden",
        instruction:
          "Öffnen Sie die Search Console mit demselben Google-Konto wie bei Analytics, also mit Ihrer Adresse. Legen Sie bei Bedarf zuerst das Google-Konto an.",
        email: "Anmeldung als {customerEmail}.",
        agencyRole: "Keine.",
        doneMeans: "Die Search Console öffnet sich unter Ihrem Konto.",
        href: "https://search.google.com/search-console",
        hrefLabel: "Search Console öffnen",
      },
      {
        id: "property",
        title: "Property hinzufügen und bestätigen",
        instruction:
          "Fügen Sie eine Property hinzu. Eine Domain-Property verlangt einen DNS-Eintrag bei Ihrem Registrar, eine URL-Präfix-Property eine HTML-Datei oder einen Meta-Tag. Die Bestätigung machen Sie selbst, weil nur Sie die Domain kontrollieren.",
        email: "Inhaber wird das Google-Konto {customerEmail}.",
        agencyRole: "Noch kein Zugriff. Inhaber sind Sie, sobald die Bestätigung durch ist.",
        doneMeans:
          "Die Property ist verifiziert und Sie sehen sich als Inhaber.",
        href: "https://search.google.com/search-console",
        hrefLabel: "Property hinzufügen",
      },
      {
        id: "einladung",
        title: "Agentur mit vollem Zugriff einladen",
        instruction:
          "Öffnen Sie Einstellungen, dann Nutzer und Berechtigungen. Fügen Sie einen Nutzer hinzu. Vergeben Sie nicht die Rolle Inhaber.",
        email: "Nutzer {agencyEmail}.",
        agencyRole:
          "Uneingeschränkt (Voll). Die Agentur kann Daten und Einstellungen der Property sehen. Verifizierter Inhaber bleiben Sie.",
        doneMeans:
          "{agencyEmail} steht mit vollem Zugriff in der Nutzerliste, {customerEmail} als Inhaber.",
        href: "https://search.google.com/search-console/users",
        hrefLabel: "Nutzer und Berechtigungen öffnen",
      },
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Abrechnung",
    summary:
      "Stripe-Konto auf den Namen und die Firma der Kundschaft. Die Agentur wird Developer.",
    adapterId: guide,
    steps: [
      {
        id: "konto",
        title: "Stripe-Konto selbst registrieren",
        instruction:
          "Legen Sie das Stripe-Konto selbst an und tragen Sie Ihre eigenen Geschäftsdaten ein. Die Agentur darf nicht Kontoinhaber werden. Geheimnisse und API-Schlüssel werden hier nicht erfasst.",
        email: "Registrierung mit {customerEmail}.",
        agencyRole: "Keine. Sie sind Kontoinhaber.",
        doneMeans:
          "Das Dashboard öffnet sich für ein neues Konto auf Ihren Namen, oder Stripe bittet um die Bestätigung der E-Mail.",
        href: "https://dashboard.stripe.com/register",
        hrefLabel: "Stripe-Registrierung öffnen",
      },
      {
        id: "email",
        title: "E-Mail bestätigen",
        instruction: "Bestätigen Sie die Adresse über die Mail von Stripe.",
        email: "Mail an {customerEmail}.",
        agencyRole: "Keine.",
        doneMeans: "Sie kommen ohne Warnung zur unbestätigten Adresse ins Dashboard.",
      },
      {
        id: "einladung",
        title: "Agentur als Developer einladen",
        instruction:
          "Öffnen Sie Einstellungen, Team und Sicherheit, Team. Laden Sie ein neues Mitglied ein. Geben Sie die Inhaberschaft nicht ab und legen Sie keine Secret Keys in dieses Werkzeug.",
        email: "Einladung an {agencyEmail}.",
        agencyRole:
          "Developer. Developer kann Integrationen bauen, ohne Inhaber des Kontos zu sein. Kontoinhaber bleiben Sie.",
        doneMeans:
          "{agencyEmail} steht im Team als Developer. Das Stripe-Konto wurde nicht über eine API angelegt.",
        href: "https://dashboard.stripe.com/settings/team",
        hrefLabel: "Stripe-Team öffnen",
      },
    ],
  },
  {
    id: "resend",
    name: "Resend",
    category: "Versand",
    summary:
      "E-Mail-Versand im Konto der Kundschaft. Die Agentur wird Admin, Owner bleibt der Kunde.",
    adapterId: guide,
    steps: [
      {
        id: "konto",
        title: "Resend-Konto anlegen",
        instruction:
          "Registrieren Sie Resend mit Ihrer Adresse. Der Einstieg ist kostenlos. API-Schlüssel bleiben in Resend und werden hier nicht gespeichert.",
        email: "Konto mit {customerEmail}.",
        agencyRole: "Keine. Sie sind Owner.",
        doneMeans: "Sie sehen das Resend-Dashboard oder die Aufforderung, die E-Mail zu bestätigen.",
        href: "https://resend.com/signup",
        hrefLabel: "Resend-Registrierung öffnen",
      },
      {
        id: "email",
        title: "E-Mail bestätigen",
        instruction: "Klicken Sie den Link in der Mail von Resend.",
        email: "Bestätigung an {customerEmail}.",
        agencyRole: "Keine.",
        doneMeans: "Das Konto ist bestätigt und bleibt Ihrem Login zugeordnet.",
      },
      {
        id: "einladung",
        title: "Agentur als Admin einladen",
        instruction:
          "Öffnen Sie die Team-Einstellungen und laden Sie die Agentur ein. Übertragen Sie die Ownership nicht. Eine Versanddomain können Sie später selbst hinzufügen; sie bleibt in diesem Konto.",
        email: "Einladung an {agencyEmail}.",
        agencyRole:
          "Admin. Admin darf Domains und Team pflegen. Owner und Abrechnung bleiben bei Ihnen.",
        doneMeans:
          "{agencyEmail} steht im Team als Admin, Sie als Owner.",
        href: "https://resend.com/settings/team",
        hrefLabel: "Resend-Team öffnen",
      },
    ],
  },
  {
    id: "sanity",
    name: "Sanity",
    category: "Inhalt",
    summary:
      "Sanity-Projekt der Kundschaft. Die Agentur wird eingeladen, das Projekt bleibt bei Ihnen.",
    adapterId: guide,
    steps: [
      {
        id: "konto",
        title: "Sanity-Konto anlegen",
        instruction:
          "Legen Sie ein Sanity-Konto mit Ihrer Adresse an. Es entsteht kein Projekt im Konto der Agentur.",
        email: "Registrierung mit {customerEmail}.",
        agencyRole: "Keine.",
        doneMeans: "Sie sind unter sanity.io/manage mit Ihrem Konto angemeldet.",
        href: "https://www.sanity.io/get-started",
        hrefLabel: "Sanity-Registrierung öffnen",
      },
      {
        id: "projekt",
        title: "Projekt auf den eigenen Namen anlegen",
        instruction:
          "Legen Sie eine Organisation und ein Projekt für {customerName} an, falls Sanity das im ersten Dialog verlangt. Der kostenlose Plan reicht zum Start. Sie bleiben verantwortlich für Organisation und Abrechnung.",
        email: "Projekt unter {customerEmail}.",
        agencyRole: "Noch kein Mitglied. Sie sind Administrator der Organisation.",
        doneMeans: "Das Projekt erscheint in Ihrer Projektliste.",
        href: "https://www.sanity.io/manage",
        hrefLabel: "Sanity Manage öffnen",
      },
      {
        id: "einladung",
        title: "Agentur als Administrator einladen",
        instruction:
          "Öffnen Sie im Projekt die Mitglieder und schicken Sie eine Einladung. Geben Sie die Organisation nicht an die Agentur ab.",
        email: "Einladung an {agencyEmail}.",
        agencyRole:
          "Administrator im Projekt. Die Agentur kann Studio und Inhalte einrichten. Die Organisation bleibt an Ihrem Konto.",
        doneMeans:
          "{agencyEmail} steht in der Mitgliederliste. Es wurde kein Projekt über eine API angelegt.",
        href: "https://www.sanity.io/manage",
        hrefLabel: "Mitglieder in Sanity öffnen",
      },
    ],
  },
  {
    id: "ionos",
    name: "IONOS",
    category: "Domain",
    summary:
      "Domain und Vertrag bei IONOS auf den Namen der Kundschaft. Die Agentur bekommt einen Benutzer für Domain und DNS.",
    adapterId: guide,
    steps: [
      {
        id: "konto",
        title: "IONOS-Konto auf den eigenen Namen anlegen",
        instruction:
          "Legen Sie das IONOS-Kundenkonto selbst an. Vertrag und Rechnung laufen auf Sie, nicht auf die Agentur. Wenn schon ein Konto mit Ihrer Adresse besteht, melden Sie sich dort an.",
        email: "Konto mit {customerEmail}.",
        agencyRole: "Keine. Sie sind Vertragsinhaber.",
        doneMeans: "Sie können sich im IONOS-Kundencenter anmelden.",
        href: "https://login.ionos.de/",
        hrefLabel: "IONOS-Anmeldung öffnen",
      },
      {
        id: "email",
        title: "Registrierung bestätigen",
        instruction:
          "Bestätigen Sie die E-Mail von IONOS, falls das Konto neu ist. Bei einem bestehenden Konto ist dieser Schritt schon erledigt.",
        email: "Mail an {customerEmail}.",
        agencyRole: "Keine.",
        doneMeans: "Das Kundencenter öffnet sich ohne offene Bestätigung.",
      },
      {
        id: "domain",
        title: "Domain im eigenen Vertrag halten",
        instruction:
          "Prüfen Sie unter Domains, dass die Domain in diesem Vertrag liegt. Falls sie noch fehlt, bestellen oder ziehen Sie sie selbst um. Die Agentur soll die Domain nicht in ihrem eigenen IONOS-Vertrag registrieren.",
        email: "Der Vertrag gehört zu {customerEmail}.",
        agencyRole: "Weiterhin kein Zugang. Vertragsinhaber bleiben Sie.",
        doneMeans: "Die Domain ist im Kundencenter Ihres Vertrags sichtbar.",
        href: "https://mein.ionos.de/",
        hrefLabel: "IONOS-Kundencenter öffnen",
      },
      {
        id: "benutzer",
        title: "Agentur als Benutzer für Domain und DNS anlegen",
        instruction:
          "Öffnen Sie im Kundencenter die Benutzerverwaltung Ihres Kontos. Legen Sie einen Benutzer für die Agentur an. Geben Sie Rechte für Domains und DNS. Vergeben Sie keine Rechte, den Vertrag zu kündigen oder die Rechnungsdaten zu ändern, wenn das getrennt auswählbar ist. Übertragen Sie den Vertrag nicht.",
        email: "Benutzer mit {agencyEmail}. Ihr Vertrag bleibt an {customerEmail}.",
        agencyRole:
          "Zusätzlicher Benutzer mit Rechten für Domain und DNS, nicht Vertragsinhaber.",
        doneMeans:
          "Der Benutzer der Agentur existiert, und die Domain liegt weiter in Ihrem Vertrag. Es wurde keine Domain über eine API registriert.",
        href: "https://mein.ionos.de/",
        hrefLabel: "Benutzerverwaltung öffnen",
      },
    ],
  },
  {
    id: "plausible",
    name: "Plausible",
    category: "Analyse",
    summary:
      "Plausible-Seite im Konto der Kundschaft. Die Agentur wird Admin. Das Abo bleibt bei Ihnen.",
    adapterId: guide,
    steps: [
      {
        id: "konto",
        title: "Plausible-Konto anlegen",
        instruction:
          "Registrieren Sie Plausible mit Ihrer Adresse. Plausible startet mit einer Testphase, ein dauerhaft kostenloser Tarif ist es nicht. Das Abo soll später auf Ihren Namen laufen, nicht auf die Agentur.",
        email: "Konto mit {customerEmail}.",
        agencyRole: "Keine. Sie sind Inhaber des Kontos.",
        doneMeans: "Sie sind im Plausible-Dashboard oder müssen die E-Mail noch bestätigen.",
        href: "https://plausible.io/register",
        hrefLabel: "Plausible-Registrierung öffnen",
      },
      {
        id: "email",
        title: "E-Mail bestätigen",
        instruction: "Bestätigen Sie die Adresse über die Mail von Plausible.",
        email: "Mail an {customerEmail}.",
        agencyRole: "Keine.",
        doneMeans: "Das Konto ist bestätigt.",
      },
      {
        id: "seite",
        title: "Website im eigenen Konto anlegen",
        instruction:
          "Fügen Sie die Website hinzu, die gemessen werden soll. Den Mess-Code baut die Agentur später ein. Den Code müssen Sie hier nicht einfügen.",
        email: "Die Seite gehört zum Konto {customerEmail}.",
        agencyRole: "Noch kein Zugriff.",
        doneMeans: "Die Seite erscheint in Ihrer Seitenliste.",
        href: "https://plausible.io/sites",
        hrefLabel: "Plausible-Seiten öffnen",
      },
      {
        id: "einladung",
        title: "Agentur als Admin einladen",
        instruction:
          "Öffnen Sie die Seiteneinstellungen und dort People. Laden Sie die Agentur ein. Geben Sie das Konto nicht ab.",
        email: "Einladung an {agencyEmail}.",
        agencyRole:
          "Admin für die Seite. Admin kann Einstellungen und Einladungen sehen. Inhaber des Kontos bleiben Sie.",
        doneMeans:
          "{agencyEmail} steht unter People. Die Seite wurde nicht über eine API angelegt.",
        href: "https://plausible.io/sites",
        hrefLabel: "Personen in Plausible öffnen",
      },
    ],
  },
]

const byId = new Map(providers.map((provider) => [provider.id, provider]))

export function getProvider(id: string) {
  return byId.get(id) ?? null
}

export function listCategories() {
  const categories: string[] = []
  for (const provider of providers) {
    if (!categories.includes(provider.category)) {
      categories.push(provider.category)
    }
  }
  return categories
}

const accessStepIds = new Set(["einladung", "benutzer"])

export function stepGrantsAccess(step: { id: string; grantsAccess?: boolean }) {
  return step.grantsAccess === true || accessStepIds.has(step.id)
}
