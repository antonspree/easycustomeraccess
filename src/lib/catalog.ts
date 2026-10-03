export type Step = {
  id: string
  sentence: string
}

export type ProviderDefinition = {
  id: string
  name: string
  summary: string
  more: string
  steps: Step[]
}

export const providers: ProviderDefinition[] = [
  {
    id: "supabase",
    name: "Supabase",
    summary: "Datenbank und Auth. Owner bleibt die Kundschaft, die Agentur wird Administrator.",
    more: "Die Person legt das Konto selbst an, setzt die Organisation auf den eigenen Namen und lädt die Agentur als Administrator ein. Die Region für das Projekt ist Frankfurt. Das Datenbankpasswort wird hier nicht abgefragt. EasyCustomerAccess legt kein Projekt an.",
    steps: [
      { id: "konto", sentence: "Legen Sie das Supabase-Konto mit {email} an, nicht über die Agentur." },
      { id: "email", sentence: "Bestätigen Sie die E-Mail von Supabase im Postfach von {email}." },
      { id: "organisation", sentence: "Benennen Sie die Organisation nach sich und prüfen Sie, dass {email} als Owner steht." },
      { id: "einladung", sentence: "Laden Sie {agencyEmail} als Administrator ein und behalten Sie die Ownership." },
      { id: "projekt", sentence: "Legen Sie das Projekt in Ihrer Organisation an, Region Frankfurt, und verwahren Sie das Datenbankpasswort selbst." },
      { id: "pruefen", sentence: "Prüfen Sie, dass Sie Owner bleiben und {agencyEmail} als Administrator steht." },
    ],
  },
  {
    id: "vercel",
    name: "Vercel",
    summary: "Hosting. Die Kundschaft ist Owner, die Agentur wird Member im Tarif Hobby.",
    more: "Das Konto und das Team gehören der Kundschaft. Die Agentur wird als Member eingeladen, nicht als Owner. EasyCustomerAccess legt kein Projekt an.",
    steps: [
      { id: "konto", sentence: "Legen Sie das Vercel-Konto mit {email} an, im Tarif Hobby." },
      { id: "email", sentence: "Bestätigen Sie die E-Mail von Vercel im Postfach von {email}." },
      { id: "team", sentence: "Legen Sie das Team auf Ihren Namen an, nicht auf den der Agentur." },
      { id: "einladung", sentence: "Laden Sie {agencyEmail} als Member ein." },
    ],
  },
  {
    id: "netlify",
    name: "Netlify",
    summary: "Hosting. Owner bleibt die Kundschaft, die Agentur wird Developer.",
    more: "Die Person besitzt das Konto und die Abrechnung. Die Agentur arbeitet als Developer. EasyCustomerAccess legt keine Site an.",
    steps: [
      { id: "konto", sentence: "Legen Sie das Netlify-Konto mit {email} an." },
      { id: "email", sentence: "Bestätigen Sie die E-Mail von Netlify im Postfach von {email}." },
      { id: "einladung", sentence: "Laden Sie {agencyEmail} als Developer ein." },
    ],
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    summary: "DNS und Domain. Super Admin bleibt die Kundschaft, die Agentur wird Administrator.",
    more: "Das Konto bleibt bei der Kundschaft. Die Agentur wird Administrator, nicht Super Admin. EasyCustomerAccess ändert keine DNS-Einträge.",
    steps: [
      { id: "konto", sentence: "Legen Sie das Cloudflare-Konto mit {email} an." },
      { id: "email", sentence: "Bestätigen Sie die E-Mail von Cloudflare im Postfach von {email}." },
      { id: "einladung", sentence: "Laden Sie {agencyEmail} als Administrator ein." },
    ],
  },
  {
    id: "github",
    name: "GitHub",
    summary: "Code. Die Organisation gehört der Kundschaft, die Agentur wird Member.",
    more: "Konto und Organisation laufen auf die Kundschaft. Die Agentur wird Member, nicht Owner. EasyCustomerAccess legt kein Repository an.",
    steps: [
      { id: "konto", sentence: "Legen Sie das GitHub-Konto mit {email} an." },
      { id: "email", sentence: "Bestätigen Sie die E-Mail von GitHub im Postfach von {email}." },
      { id: "organisation", sentence: "Legen Sie die Organisation auf Ihren Namen an." },
      { id: "einladung", sentence: "Laden Sie {agencyEmail} als Member ein." },
    ],
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    summary: "Analyse. Administrator bleibt die Kundschaft, die Agentur wird Bearbeiter.",
    more: "Das Google-Konto und die Property gehören der Kundschaft. Die Agentur erhält die Rolle Bearbeiter. EasyCustomerAccess legt keine Property an.",
    steps: [
      { id: "google", sentence: "Nutzen Sie ein Google-Konto mit {email}, oder legen Sie es damit an." },
      { id: "property", sentence: "Legen Sie das Analytics-Konto und die Property auf Ihren Namen an." },
      { id: "einladung", sentence: "Fügen Sie {agencyEmail} als Bearbeiter hinzu." },
    ],
  },
  {
    id: "google-search-console",
    name: "Google Search Console",
    summary: "Suche. Verifizierte Inhaberin bleibt die Kundschaft, die Agentur erhält vollen Zugriff.",
    more: "Die Property wird von der Kundschaft bestätigt. Die Agentur bekommt vollen Zugriff, nicht die Inhaberschaft. EasyCustomerAccess bestätigt keine Property.",
    steps: [
      { id: "konto", sentence: "Öffnen Sie die Search Console mit dem Google-Konto {email}." },
      { id: "property", sentence: "Fügen Sie die Property hinzu und bestätigen Sie sie selbst." },
      { id: "einladung", sentence: "Geben Sie {agencyEmail} vollen Zugriff, ohne die Inhaberschaft abzugeben." },
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    summary: "Zahlungen. Kontoinhaber bleibt die Kundschaft, die Agentur wird Developer.",
    more: "Das Stripe-Konto läuft auf Name und Firma der Kundschaft. Die Agentur wird Developer. Geheime Schlüssel werden hier nicht eingetragen. EasyCustomerAccess legt kein Konto an.",
    steps: [
      { id: "konto", sentence: "Legen Sie das Stripe-Konto auf Ihren Namen und Ihre Firma an, mit {email}." },
      { id: "email", sentence: "Bestätigen Sie die E-Mail von Stripe im Postfach von {email}." },
      { id: "einladung", sentence: "Laden Sie {agencyEmail} als Developer ein." },
    ],
  },
  {
    id: "resend",
    name: "Resend",
    summary: "Versand. Owner bleibt die Kundschaft, die Agentur wird Admin.",
    more: "Das Konto gehört der Kundschaft. Die Agentur wird Admin. EasyCustomerAccess verschickt keine E-Mail und legt keine Domain an.",
    steps: [
      { id: "konto", sentence: "Legen Sie das Resend-Konto mit {email} an." },
      { id: "email", sentence: "Bestätigen Sie die E-Mail von Resend im Postfach von {email}." },
      { id: "einladung", sentence: "Laden Sie {agencyEmail} als Admin ein." },
    ],
  },
  {
    id: "sanity",
    name: "Sanity",
    summary: "Inhalt. Die Organisation gehört der Kundschaft, die Agentur wird Administrator.",
    more: "Konto und Projekt laufen auf die Kundschaft. Die Agentur wird Administrator der Organisation. EasyCustomerAccess legt kein Projekt an.",
    steps: [
      { id: "konto", sentence: "Legen Sie das Sanity-Konto mit {email} an." },
      { id: "projekt", sentence: "Legen Sie das Projekt auf Ihren Namen an." },
      { id: "einladung", sentence: "Laden Sie {agencyEmail} als Administrator ein." },
    ],
  },
  {
    id: "ionos",
    name: "IONOS",
    summary: "Domain. Vertragspartner bleibt die Kundschaft, die Agentur wird zusätzlicher Benutzer.",
    more: "Der Vertrag wird nicht übertragen. Die Agentur erhält einen Benutzer für Domain und DNS, ohne Kündigungsrechte. EasyCustomerAccess registriert keine Domain.",
    steps: [
      { id: "konto", sentence: "Legen Sie das IONOS-Konto auf Ihren Namen an. Der Vertrag bleibt bei Ihnen." },
      { id: "email", sentence: "Bestätigen Sie die Registrierung im Postfach von {email}." },
      { id: "domain", sentence: "Halten Sie die Domain in Ihrem eigenen Vertrag." },
      { id: "benutzer", sentence: "Legen Sie {agencyEmail} als Benutzer für Domain und DNS an, ohne den Vertrag zu übertragen." },
    ],
  },
  {
    id: "plausible",
    name: "Plausible",
    summary: "Analyse. Owner bleibt die Kundschaft. Der Tarif ist kostenpflichtig oder eine Testphase.",
    more: "Plausible hat keinen dauerhaft kostenlosen Tarif. Die Website liegt im Konto der Kundschaft, die Agentur wird Admin. EasyCustomerAccess legt keine Website an.",
    steps: [
      { id: "konto", sentence: "Legen Sie das Plausible-Konto mit {email} an. Es ist ein bezahlter Tarif oder eine Testphase." },
      { id: "email", sentence: "Bestätigen Sie die E-Mail von Plausible im Postfach von {email}." },
      { id: "seite", sentence: "Legen Sie die Website in Ihrem eigenen Konto an." },
      { id: "einladung", sentence: "Laden Sie {agencyEmail} als Admin ein." },
    ],
  },
]

export function getProvider(id: string) {
  return providers.find((provider) => provider.id === id) ?? null
}

export function fill(sentence: string, vars: { email: string; agency: string; agencyEmail: string }) {
  return sentence
    .replaceAll("{email}", vars.email)
    .replaceAll("{agency}", vars.agency)
    .replaceAll("{agencyEmail}", vars.agencyEmail)
}
