import { schematic, screenshot, type ProviderDefinition } from "../types.ts"

export const googleSearchConsole: ProviderDefinition = {
  id: "google-search-console",
  name: "Google Search Console",
  summary: "Suche. Verifizierte Inhaberin bleibt die Kundschaft, die Agentur erhält vollen Zugriff.",
  more: "Die Property wird von Ihnen bestätigt. Die Agentur bekommt vollen Zugriff, nicht die Inhaberschaft. Blokr bestätigt keine Property.",
  steps: [
    {
      id: "konto",
      title: "Search Console mit Ihrem Google-Konto öffnen",
      sentence: "Öffnen Sie die Search Console mit dem Google-Konto {email}.",
      minutes: 3,
      url: "https://search.google.com/search-console",
      urlLabel: "Google Search Console öffnen",
      intro: "Search Console hängt am selben Google-Konto wie oft Analytics. Angemeldet sein muss {email}.",
      substeps: [
        "Öffnen Sie https://search.google.com/search-console. Die öffentliche Seite heißt Google Search Console, die Schaltfläche Start now bzw. Jetzt starten.",
        "Melden Sie sich mit dem Google-Konto an, das {email} verwendet.",
        "Falls Google ein Kontoauswahlfenster zeigt: genau dieses Konto wählen, nicht ein privates Zweitkonto.",
      ],
      tips: [
        "Wenn Sie Analytics schon eingerichtet haben, ist das Konto meist dasselbe.",
        "Deutsch: Search Console. Englisch: dieselbe URL.",
      ],
      pitfalls: ["Nicht das Agentur-Google-Konto verwenden."],
      doneWhen: "Die Search Console ist mit {email} geöffnet.",
      image: screenshot(
        "/guides/google-search-console/konto.png",
        "Öffentliche Search-Console-Startseite mit der Schaltfläche Start now",
        "Aufnahme von search.google.com/search-console",
      ),
    },
    {
      id: "property",
      title: "Property hinzufügen und selbst bestätigen",
      sentence: "Fügen Sie die Property hinzu und bestätigen Sie sie selbst.",
      minutes: 8,
      intro:
        "Sie fügen die Website hinzu und schließen die Inhaberschaftsprüfung selbst ab. Die Agentur darf das nicht mit ihrem Konto tun, sonst ist sie Inhaberin.",
      substeps: [
        "Klicken Sie auf Property hinzufügen / Add property.",
        "Domain-Property (gesamte Domain inkl. Subdomains) oder URL-Präfix (eine genaue Adresse mit https://). {agency} sagt Ihnen, welche Variante passt.",
        "Starten Sie die Bestätigung. Üblich sind DNS-TXT-Eintrag, HTML-Datei oder Google-Analytics-/Tag-Weiterverwendung.",
        "Die Bestätigung müssen Sie auslösen (Bestätigen / Verify). DNS-Änderungen kann die Agentur vorbereiten, der Klick bleibt bei Ihnen.",
      ],
      tips: [
        "DNS-Bestätigung dauert oft Minuten, manchmal bis zu 48 Stunden.",
        "Eine bereits bestätigte Property auf Ihr Konto müssen Sie nicht neu anlegen.",
      ],
      pitfalls: [
        "Nicht die Agentur als erste Inhaberin verifizieren lassen.",
        "http und https bzw. www und ohne www sind bei URL-Präfix verschiedene Properties.",
      ],
      doneWhen: "Die Property ist bestätigt, und Sie stehen als Inhaberin bzw. Inhaber.",
      image: schematic("/guides/google-search-console/property.svg", "Schema von Property hinzufügen"),
    },
    {
      id: "einladung",
      title: "Vollen Zugriff für die Agentur",
      sentence: "Geben Sie {agencyEmail} vollen Zugriff, ohne die Inhaberschaft abzugeben.",
      minutes: 4,
      intro:
        "Der Weg heißt Einstellungen → Nutzer und Berechtigungen / Settings → Users and permissions. Voller Nutzer entspricht Full user. Inhaber bleibt bei Ihnen.",
      substeps: [
        "Öffnen Sie die bestätigte Property.",
        "Gehen Sie auf Einstellungen / Settings und dann Nutzer und Berechtigungen / Users and permissions.",
        "Klicken Sie auf Nutzer hinzufügen / Add user.",
        "E-Mail: {agencyEmail}. Die Adresse braucht ein Google-Konto.",
        "Berechtigung: Voller Nutzer / Full — nicht Inhaber.",
        "Speichern Sie mit Hinzufügen / Add.",
      ],
      tips: ["Eingeschränkt / Restricted reicht nicht, wenn die Agentur Einstellungen und Abdeckung bearbeiten soll."],
      pitfalls: [
        "Inhaberschaft nicht übertragen.",
        "Ohne Google-Konto hinter {agencyEmail} lehnt Search Console den Eintrag ab.",
      ],
      doneWhen: "{agencyEmail} steht als Voller Nutzer. Sie bleiben Inhaberin bzw. Inhaber.",
      image: schematic("/guides/google-search-console/einladung.svg", "Schema von Nutzer hinzufügen mit vollem Zugriff"),
    },
  ],
}
