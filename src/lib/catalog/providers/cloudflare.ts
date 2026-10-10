import { schematic, type ProviderDefinition } from "../types.ts"

export const cloudflare: ProviderDefinition = {
  id: "cloudflare",
  name: "Cloudflare",
  summary: "DNS und Domain. Super Admin bleibt die Kundschaft, die Agentur wird Administrator.",
  more: "Das Konto bleibt bei Ihnen. Nur Super Administrator darf Mitglieder verwalten. Die Agentur wird Administrator, nicht Super Administrator. Blokr ändert keine DNS-Einträge.",
  steps: [
    {
      id: "konto",
      title: "Cloudflare-Konto anlegen",
      sentence: "Legen Sie das Cloudflare-Konto mit {email} an.",
      minutes: 4,
      url: "https://dash.cloudflare.com/sign-up",
      urlLabel: "Registrierung bei Cloudflare öffnen",
      intro: "Wer das Konto anlegt, ist Super Administrator. Das müssen Sie sein, nicht die Agentur.",
      substeps: [
        "Öffnen Sie https://dash.cloudflare.com/sign-up.",
        "Tragen Sie unter Email {email} ein.",
        "Setzen Sie ein eigenes Passwort und klicken Sie auf Sign Up bzw. Create account.",
        "Cloudflare kann zusätzlich einen Sicherheitscheck (Captcha) zeigen.",
      ],
      tips: ["Ein vorhandenes Konto mit {email} können Sie weiterverwenden, wenn Sie Super Administrator bleiben."],
      pitfalls: ["Nicht das Agenturkonto nutzen und Ihre Domain nur „dazu hängen“."],
      doneWhen: "Sie sind im Cloudflare-Dashboard angemeldet oder werden zur E-Mail-Bestätigung gebeten.",
      image: schematic(
        "/guides/cloudflare/konto.svg",
        "Schema der Cloudflare-Registrierung mit Email, Password und Sign Up",
        "Die echte Sign-up-Seite blockiert automatische Aufnahmen (Bot-Check).",
      ),
    },
    {
      id: "email",
      title: "E-Mail von Cloudflare bestätigen",
      sentence: "Bestätigen Sie die E-Mail von Cloudflare im Postfach von {email}.",
      minutes: 3,
      intro: "Mitglieder einladen dürfen nur Super Administratoren mit bestätigter E-Mail.",
      substeps: [
        "Öffnen Sie das Postfach von {email}, inklusive Spam.",
        "Öffnen Sie die Nachricht von Cloudflare.",
        "Klicken Sie auf Confirm email address bzw. den Bestätigungslink.",
      ],
      tips: ["Unter My Profile können Sie die Bestätigung erneut anfordern."],
      pitfalls: [
        "Zwei-Faktor-Authentifizierung (2FA) kann Cloudflare später verlangen. Richten Sie sie auf Ihrem Gerät ein, nicht auf dem der Agentur.",
      ],
      doneWhen: "Ihre E-Mail gilt als bestätigt, und das Dashboard ist ohne Verify-Banner nutzbar.",
      image: schematic("/guides/cloudflare/email.svg", "Schema der Cloudflare-Mail Confirm email address"),
    },
    {
      id: "einladung",
      title: "Agentur als Administrator einladen",
      sentence: "Laden Sie {agencyEmail} als Administrator ein.",
      minutes: 5,
      url: "https://one.dash.cloudflare.com/?to=/:account/members",
      urlLabel: "Mitgliederverwaltung bei Cloudflare",
      intro:
        "Der Weg in der Seitenleiste heißt Manage Account → Members. Super Administrator behalten Sie. Administrator darf fast alles außer Mitglieder und die Rechnungsdaten verwalten.",
      substeps: [
        "Öffnen Sie im Dashboard Manage Account und dann Members. Alternativ die Mitgliederseite über die Schaltfläche oben.",
        "Klicken Sie auf Invite.",
        "Unter Invite members tragen Sie {agencyEmail} ein.",
        "Scope: belassen Sie den ganzen Account, sofern Sie nicht bewusst nur einzelne Domains freigeben wollen.",
        "Unter Roles wählen Sie Administrator — nicht Super Administrator - All Privileges.",
        "Klicken Sie auf Continue to summary und danach auf Invite.",
      ],
      tips: ["Status Invite Pending bedeutet: die Agentur muss die Mail noch annehmen. Dann Resend invite."],
      pitfalls: [
        "Super Administrator gibt volle Kontrolle inklusive Mitglieder und Zahlung. Das behalten Sie.",
        "Ohne bestätigte eigene E-Mail bleibt Invite gesperrt.",
      ],
      doneWhen: "{agencyEmail} steht unter Members als Administrator oder Invite Pending. Sie bleiben Super Administrator.",
      image: schematic("/guides/cloudflare/einladung.svg", "Schema von Invite mit Rolle Administrator"),
    },
  ],
}
