import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function field(y, label, value) {
  return `
    <text x="40" y="${y}" font-size="13" fill="#6b6b6b">${esc(label)}</text>
    <rect x="40" y="${y + 8}" width="400" height="36" rx="8" fill="#fff" stroke="#d9d9d9"/>
    <text x="54" y="${y + 31}" font-size="14" fill="#151515">${esc(value)}</text>`
}

function button(x, y, label, fill = "#353535") {
  const width = Math.max(120, 12 + label.length * 8)
  return `
    <rect x="${x}" y="${y}" width="${width}" height="36" rx="16" fill="${fill}"/>
    <text x="${x + width / 2}" y="${y + 23}" text-anchor="middle" font-size="14" fill="#fff">${esc(label)}</text>`
}

function schematic({ file, url, heading, rows, action, aside }) {
  const blocks = rows
    .map((row, index) => {
      if (row.kind === "note") {
        return `<text x="40" y="${118 + index * 70}" font-size="14" fill="#151515">${esc(row.text)}</text>`
      }
      return field(100 + index * 70, row.label, row.value)
    })
    .join("")
  const actionY = 120 + rows.length * 70
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" role="img" aria-label="${esc(heading)}">
  <rect width="800" height="480" fill="#f3f3f3"/>
  <rect x="16" y="16" width="768" height="448" rx="16" fill="#fff" stroke="#ececec"/>
  <rect x="16" y="16" width="768" height="40" rx="16" fill="#f7f7f7"/>
  <rect x="16" y="40" width="768" height="16" fill="#f7f7f7"/>
  <circle cx="40" cy="36" r="5" fill="#e0e0e0"/>
  <circle cx="56" cy="36" r="5" fill="#e0e0e0"/>
  <circle cx="72" cy="36" r="5" fill="#e0e0e0"/>
  <text x="92" y="40" font-size="12" fill="#8a8a8a" font-family="system-ui, sans-serif">${esc(url)}</text>
  <text x="40" y="84" font-size="20" font-weight="600" fill="#151515" font-family="system-ui, sans-serif">${esc(heading)}</text>
  <g font-family="system-ui, sans-serif">${blocks}
    ${action ? button(40, actionY, action) : ""}
  </g>
  ${
    aside
      ? `<text x="480" y="140" font-size="13" fill="#6b6b6b" font-family="system-ui, sans-serif">${esc(aside)}</text>`
      : ""
  }
  <text x="40" y="444" font-size="12" fill="#8a8a8a" font-family="system-ui, sans-serif">Schematische Darstellung — keine Originaloberfläche</text>
</svg>
`
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, svg)
}

const root = join(import.meta.dirname, "..", "public", "guides")

const items = [
  ["cloudflare/konto.svg", "dash.cloudflare.com/sign-up", "Create your account", [{ label: "Email", value: "Sie@…" }, { label: "Password", value: "••••••••" }], "Sign Up"],
  ["github/konto.svg", "github.com/signup", "Create your account", [{ label: "Email", value: "Sie@…" }, { label: "Password", value: "••••••••" }, { label: "Username", value: "ihr-name" }], "Create account"],
  ["google-analytics/google.svg", "accounts.google.com", "Google-Konto erstellen", [{ label: "E-Mail", value: "Ihre Adresse" }, { label: "Passwort", value: "••••••••" }], "Weiter"],
  ["supabase/email.svg", "mail.supabase.com", "Confirm your email", [{ kind: "note", text: "Posteingang von Ihrer Adresse · Absender Supabase" }], "Confirm your email"],
  ["supabase/organisation.svg", "supabase.com/dashboard/org/…/general", "Organization Settings", [{ label: "Organization name", value: "Ihr Name / Ihre Firma" }], "Save"],
  ["supabase/einladung.svg", "supabase.com/dashboard/org/…/team", "Invite member", [{ label: "Email", value: "agentur@…" }, { label: "Role", value: "Administrator" }], "Send invitation"],
  ["supabase/projekt.svg", "supabase.com/dashboard/new/…", "Create new project", [{ label: "Project name", value: "Ihre Website" }, { label: "Database password", value: "••••••••" }, { label: "Region", value: "Central EU (Frankfurt)" }], "Create new project"],
  ["supabase/pruefen.svg", "supabase.com/dashboard/org/…/team", "Team", [{ kind: "note", text: "Sie · Owner     Agentur · Administrator" }]],

  ["vercel/email.svg", "mail.vercel.com", "Verify Email Address", [{ kind: "note", text: "Posteingang · Absender Vercel" }], "Verify Email Address"],
  ["vercel/team.svg", "vercel.com/teams/create", "Create a Team", [{ label: "Team name", value: "Ihr Name / Ihre Firma" }], "Create Team"],
  ["vercel/einladung.svg", "vercel.com/…/settings/members", "Members", [{ label: "Email", value: "agentur@…" }, { label: "Role", value: "Developer" }], "Invite"],

  ["netlify/email.svg", "mail.netlify.com", "Verify your email", [{ kind: "note", text: "Posteingang · Absender Netlify" }], "Verify your email"],
  ["netlify/einladung.svg", "app.netlify.com/teams/…/members", "Add members", [{ label: "Email", value: "agentur@…" }, { label: "Role", value: "Developer" }], "Add members"],

  ["cloudflare/email.svg", "mail.cloudflare.com", "Confirm email address", [{ kind: "note", text: "Posteingang · Absender Cloudflare" }], "Confirm email address"],
  ["cloudflare/einladung.svg", "dash.cloudflare.com/…/members", "Invite", [{ label: "Invite members", value: "agentur@…" }, { label: "Roles", value: "Administrator" }], "Continue to summary"],

  ["github/email.svg", "github.com/settings/emails", "Verify email address", [{ kind: "note", text: "Settings → Emails · Status verified" }], "Resend verification email"],
  ["github/organisation.svg", "github.com/account/organizations/new", "Create an organization", [{ label: "Organization name", value: "Ihre Firma" }, { label: "Contact email", value: "Sie@…" }], "Create organization"],
  ["github/einladung.svg", "github.com/orgs/…/people", "Invite member", [{ label: "Find people", value: "agentur@…" }, { label: "Role", value: "Member" }], "Send invitation"],

  ["google-analytics/google.svg", "accounts.google.com/SignUp", "Google-Konto erstellen", [{ label: "E-Mail", value: "Ihre Adresse" }, { label: "Passwort", value: "••••••••" }], "Weiter"],
  ["google-analytics/property.svg", "analytics.google.com", "Messung starten", [{ label: "Kontoname", value: "Ihr Name / Ihre Firma" }, { label: "Property-Name", value: "Ihre Website" }], "Weiter"],
  ["google-analytics/einladung.svg", "analytics.google.com → Admin", "Nutzer hinzufügen", [{ label: "E-Mail-Adressen", value: "agentur@…" }, { label: "Rolle", value: "Bearbeiter / Editor" }], "Hinzufügen"],

  ["google-search-console/konto.svg", "search.google.com/search-console", "Search Console", [{ kind: "note", text: "Mit dem Google-Konto Ihrer Adresse anmelden" }], "Weiter"],
  ["google-search-console/property.svg", "search.google.com/search-console", "Property hinzufügen", [{ label: "Domain oder URL-Präfix", value: "example.de" }], "Bestätigen"],
  ["google-search-console/einladung.svg", "Search Console → Einstellungen", "Nutzer hinzufügen", [{ label: "E-Mail", value: "agentur@…" }, { label: "Berechtigung", value: "Voller Nutzer / Full" }], "Hinzufügen"],

  ["stripe/email.svg", "mail.stripe.com", "Confirm my email", [{ kind: "note", text: "Posteingang · Absender Stripe" }], "Confirm my email"],
  ["stripe/einladung.svg", "dashboard.stripe.com/settings/team", "Add member", [{ label: "Email", value: "agentur@…" }, { label: "Role", value: "Developer" }], "Send invites"],

  ["resend/email.svg", "mail.resend.com", "Confirm your email", [{ kind: "note", text: "Posteingang · Absender Resend" }], "Confirm"],
  ["resend/einladung.svg", "resend.com/settings/team", "Invite", [{ label: "Email", value: "agentur@…" }, { label: "Role", value: "Admin" }], "Invite"],

  ["sanity/projekt.svg", "sanity.io/manage", "Create new project", [{ label: "Project name", value: "Ihre Website" }], "Create project"],
  ["sanity/einladung.svg", "sanity.io/manage/…/members", "Invite", [{ label: "Email", value: "agentur@…" }, { label: "Role", value: "Administrator" }], "Invite"],

  ["ionos/email.svg", "mail.ionos.de", "Registrierung bestätigen", [{ kind: "note", text: "Posteingang · Absender IONOS" }], "Bestätigen"],
  ["ionos/domain.svg", "my.ionos.com/domains", "Domains", [{ kind: "note", text: "Ihre Domain liegt im eigenen Vertrag" }]],
  ["ionos/benutzer.svg", "my.ionos.com", "Benutzer & Rechte", [{ label: "E-Mail", value: "agentur@…" }, { label: "Rechte", value: "Domain und DNS, nicht kündigen" }], "Einladen"],

  ["plausible/email.svg", "mail.plausible.io", "Confirm your email", [{ kind: "note", text: "Posteingang · Absender Plausible" }], "Confirm"],
  ["plausible/seite.svg", "plausible.io/sites", "Add website", [{ label: "Domain", value: "example.de" }], "Add website"],
  ["plausible/einladung.svg", "plausible.io/…/settings/people", "People", [{ label: "Email", value: "agentur@…" }, { label: "Role", value: "admin" }], "Invite"],
]

for (const [rel, url, heading, rows, action] of items) {
  schematic({ file: join(root, rel), url, heading, rows, action })
}

console.log(`wrote ${items.length} schematics`)
