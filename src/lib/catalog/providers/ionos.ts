import { schematic, screenshot, type ProviderDefinition } from "../types.ts"

export const ionos: ProviderDefinition = {
  id: "ionos",
  name: "IONOS",
  summary: "Domain. Vertragspartner bleibt die Kundschaft, die Agentur wird zusätzlicher Benutzer.",
  more: "Der Vertrag wird nicht übertragen. Die Agentur erhält einen Benutzer für Domain und DNS, ohne Kündigungsrechte. Blokr registriert keine Domain.",
  steps: [
    {
      id: "konto",
      title: "IONOS-Konto auf Ihren Namen anlegen",
      sentence: "Legen Sie das IONOS-Konto auf Ihren Namen an. Der Vertrag bleibt bei Ihnen.",
      minutes: 6,
      url: "https://www.ionos.de/",
      urlLabel: "IONOS öffnen",
      intro:
        "Bei IONOS ist der Vertragspartner die Person, die das Kundenkonto besitzt. Das müssen Sie bleiben. Die Agentur bekommt später nur einen zusätzlichen Benutzer.",
      substeps: [
        "Öffnen Sie https://login.ionos.de/. Die Karte heißt Mein IONOS Login. Das Feld lautet Kundennummer, E-Mail-Adresse oder Domain, die Schaltfläche Weiter.",
        "Noch kein IONOS Kunde? darunter führt zur Registrierung. Ein Cookie-Banner fragt nach Akzeptieren, Ablehnen oder Einstellungen.",
        "Tragen Sie Ihren Namen, Ihre Adresse und {email} ein — nicht die Daten von {agency}.",
        "Haben Sie schon ein IONOS-Konto: melden Sie sich im Control Center an und prüfen Sie, dass der Vertrag auf Sie läuft.",
      ],
      tips: [
        "IONOS ist auf Deutsch. Das Control Center erreichen Sie nach dem Login unter my.ionos.com bzw. über „Control Center“.",
        "Ein bestehender Domainvertrag bei IONOS ist genau das Konto, das wir brauchen. Kein zweites anlegen.",
      ],
      pitfalls: [
        "Die Domain nicht auf die Agentur umschreiben (Inhaberwechsel / KK-Antrag zugunsten der Agentur).",
        "Nicht das Agentur-IONOS-Konto verwenden.",
      ],
      doneWhen: "Sie sind im IONOS Control Center, und das Konto bzw. der Vertrag läuft auf Ihren Namen.",
      image: screenshot(
        "/guides/ionos/konto.png",
        "Öffentliche IONOS-Loginseite Mein IONOS Login mit Weiter und Cookie-Banner",
        "Aufnahme von login.ionos.de",
      ),
    },
    {
      id: "email",
      title: "Registrierung im Postfach bestätigen",
      sentence: "Bestätigen Sie die Registrierung im Postfach von {email}.",
      minutes: 3,
      intro: "IONOS schickt Bestätigungen und später 2-Faktor-Codes an diese Adresse.",
      substeps: [
        "Öffnen Sie das Postfach von {email}, inklusive Spam.",
        "Öffnen Sie die Nachricht von IONOS und klicken Sie auf den Bestätigungslink.",
        "Falls IONOS eine Telefon- oder SMS-Prüfung zeigt, schließen Sie sie selbst ab.",
      ],
      tips: ["Keine Mail? Im Login unter „E-Mail erneut senden“ nachschauen oder den Chat von IONOS fragen."],
      pitfalls: ["2-Faktor-Gerät muss Ihres sein, nicht das der Agentur."],
      doneWhen: "Der Login ins Control Center klappt ohne ausstehende Registrierungsmail.",
      image: schematic("/guides/ionos/email.svg", "Schema der IONOS-Registrierungsmail"),
    },
    {
      id: "domain",
      title: "Domain in Ihrem Vertrag halten",
      sentence: "Halten Sie die Domain in Ihrem eigenen Vertrag.",
      minutes: 4,
      url: "https://my.ionos.com/domains",
      urlLabel: "IONOS-Domains öffnen",
      intro: "Die Domain bleibt in Ihrem Vertrag. Umschreiben oder Transfer zur Agentur ist nicht das Ziel.",
      substeps: [
        "Öffnen Sie im Control Center Domains bzw. https://my.ionos.com/domains.",
        "Prüfen Sie, dass Ihre Domain dort liegt.",
        "Öffnen Sie die Vertrags- oder Kundendaten und prüfen Sie Ihren Namen als Vertragspartner.",
        "Wenn die Domain noch woanders liegt: {agency} sagt Ihnen, ob ein Umzug zu IONOS nötig ist. Den Umzug beauftragen Sie selbst.",
      ],
      tips: ["DNS darf die Agentur später ändern. Der Vertrag bleibt bei Ihnen."],
      pitfalls: [
        "Keine Vollmacht unterschreiben, die den Vertrag überträgt, wenn Sie nur Zugriff geben wollen.",
        "Auth-Code / Auth-Info nicht ungesichert verschicken.",
      ],
      doneWhen: "Die Domain liegt in Ihrem IONOS-Vertrag bzw. Sie wissen mit {agency}, wie der Umzug läuft.",
      image: schematic("/guides/ionos/domain.svg", "Schema der Domainliste im Control Center"),
    },
    {
      id: "benutzer",
      title: "Zusätzlichen Benutzer für die Agentur anlegen",
      sentence: "Legen Sie {agencyEmail} als Benutzer für Domain und DNS an, ohne den Vertrag zu übertragen.",
      minutes: 6,
      url: "https://my.ionos.com/",
      urlLabel: "IONOS Control Center öffnen",
      intro:
        "IONOS trennt Vertragspartner und Benutzer. Unter Benutzer & Rechte bzw. Benutzerverwaltung legen Sie einen zusätzlichen Benutzer an. Keine Kündigungs- oder Vertragsrechte.",
      substeps: [
        "Öffnen Sie das Control Center und suchen Sie Benutzer & Rechte, Benutzerverwaltung oder den Eintrag Benutzer.",
        "Legen Sie einen neuen Benutzer mit der E-Mail {agencyEmail} an.",
        "Geben Sie Zugriff auf Domain und DNS bzw. die betroffenen Verträge.",
        "Vergeben Sie keine Rechte zum Kündigen, Umschreiben oder zur Verwaltung der Zahlungsmittel.",
        "Speichern Sie. Die Agentur erhält eine Einladung an {agencyEmail}.",
      ],
      tips: [
        "Die genaue Bezeichnung wechselt zwischen „Benutzer & Rechte“ und „Benutzerverwaltung“, je nach Control-Center-Version.",
        "Wenn Sie die Stelle nicht finden: oben die Suche im Control Center mit „Benutzer“ nutzen.",
      ],
      pitfalls: [
        "Nicht den Vertrag auf die Agentur übertragen.",
        "Nicht Ihre Login-Daten teilen. Immer einen eigenen Benutzer anlegen.",
      ],
      doneWhen: "{agencyEmail} ist als zusätzlicher Benutzer eingetragen oder hat eine offene Einladung. Der Vertrag bleibt auf Ihren Namen.",
      help: "Fehlt der Menüpunkt, sagt IONOS den Vertragstyp. Schreiben Sie {agency} — die Agentur hilft beim Finden, ändert den Vertrag aber nicht selbst.",
      image: schematic("/guides/ionos/benutzer.svg", "Schema von Benutzer & Rechte ohne Kündigungsrecht"),
    },
  ],
}
