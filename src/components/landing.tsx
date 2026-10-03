import Link from "next/link"
import { providers } from "@/lib/catalog"

const roles: Record<string, string> = {
  supabase: "Datenbank, Owner bleibt die Kundschaft",
  vercel: "Hosting, Member im Tarif Hobby",
  netlify: "Hosting, Developer",
  cloudflare: "DNS, Administrator",
  github: "Code, Member",
  "google-analytics": "Analyse, Bearbeiter",
  "google-search-console": "Suche, voller Zugriff",
  stripe: "Zahlung, Developer",
  resend: "Versand, Admin",
  sanity: "Inhalt, Administrator",
  ionos: "Domain, zusätzlicher Benutzer",
  plausible: "Analyse, Admin",
}

const steps = [
  {
    title: "Kunde anlegen",
    body: "Die Agentur trägt Name und E-Mail ein und wählt die Anbieter aus dem Katalog.",
  },
  {
    title: "Ein Link",
    body: "Es entsteht ein geheimer Link. Die App legt kein Anbieterkonto an und verschickt keine E-Mail.",
  },
  {
    title: "Selbst bestätigen",
    body: "Die Kundschaft öffnet den Link und markiert jeden Schritt mit der eigenen E-Mail als erledigt.",
  },
  {
    title: "Stand sehen",
    body: "Die Agentur sieht in der Übersicht, wie viele Anbieter noch offen sind.",
  },
]

const jobs = [
  { label: "Daten", mark: "data" },
  { label: "Hosting", mark: "host" },
  { label: "Domain", mark: "domain" },
  { label: "Zahlung", mark: "pay" },
  { label: "Analyse", mark: "chart" },
  { label: "E-Mail", mark: "mail" },
] as const

const quietGradient = "linear-gradient(100deg, #151515 0%, #5d6c78 46%, #6e8f80 72%, #151515 100%)"

function monogram(name: string) {
  const parts = name.split(" ").filter(Boolean)
  if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2)
}

function Mark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className="shrink-0">
      <rect x="1.25" y="1.25" width="11.5" height="11.5" rx="3.5" fill="none" stroke="#151515" strokeWidth="1.5" />
      <rect x="7.25" y="7.25" width="11.5" height="11.5" rx="3.5" fill="#F8F8F8" stroke="#151515" strokeWidth="1.5" />
    </svg>
  )
}

function ArrowDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="shrink-0">
      <path
        d="M8 3.25v8.5M4.75 8.5 8 12.25 11.25 8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function JobMark({ kind }: { kind: (typeof jobs)[number]["mark"] }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 22 22",
    fill: "none",
    stroke: "#151515",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  }
  if (kind === "data") {
    return (
      <svg {...common}>
        <ellipse cx="11" cy="6" rx="6" ry="2.25" />
        <path d="M5 6v4.5c0 1.25 2.7 2.25 6 2.25s6-1 6-2.25V6" />
        <path d="M5 10.5V15c0 1.25 2.7 2.25 6 2.25s6-1 6-2.25v-4.5" />
      </svg>
    )
  }
  if (kind === "host") {
    return (
      <svg {...common}>
        <rect x="4" y="3.5" width="14" height="5" rx="1.5" />
        <rect x="4" y="13.5" width="14" height="5" rx="1.5" />
        <path d="M7 6h.01M7 16h.01" />
      </svg>
    )
  }
  if (kind === "domain") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M4.5 11h13M11 4.5c1.6 1.7 2.4 4 2.4 6.5S12.6 15.8 11 17.5C9.4 15.8 8.6 13.5 8.6 11S9.4 6.2 11 4.5Z" />
      </svg>
    )
  }
  if (kind === "pay") {
    return (
      <svg {...common}>
        <rect x="3.5" y="5.5" width="15" height="11" rx="2" />
        <path d="M3.5 9.5h15" />
      </svg>
    )
  }
  if (kind === "chart") {
    return (
      <svg {...common}>
        <path d="M4.5 16.5V12M11 16.5V6.5M17.5 16.5V9.5" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <rect x="3.5" y="5.5" width="15" height="11" rx="2" />
      <path d="m4.5 7 6.5 5 6.5-5" />
    </svg>
  )
}

export function Landing() {
  return (
    <div className="bg-[#F8F8F8] text-[#151515]">
      <section className="relative flex min-h-[740px] items-center justify-center overflow-hidden px-4">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundColor: "#F8F8F8",
            backgroundImage: [
              "radial-gradient(920px 460px at 12% 8%, rgba(168, 188, 230, 0.55), transparent 68%)",
              "radial-gradient(760px 420px at 88% 0%, rgba(188, 220, 204, 0.5), transparent 66%)",
              "radial-gradient(680px 380px at 48% 108%, rgba(230, 214, 188, 0.48), transparent 70%)",
              "radial-gradient(520px 300px at 72% 58%, rgba(206, 196, 228, 0.28), transparent 72%)",
            ].join(", "),
          }}
        />
        <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-[14px] font-medium leading-[1.5]">
            <Mark />
            EasyCustomerAccess
          </Link>
          <Link
            href="/anmelden"
            className="inline-flex h-[30px] items-center rounded-[15px] bg-[rgba(21,21,21,0.04)] px-3 text-[14px] font-medium leading-none text-[rgba(21,21,21,0.64)] transition-colors duration-150 hover:bg-[rgba(21,21,21,0.07)]"
          >
            Anmelden
          </Link>
        </header>
        <div className="relative z-10 flex w-full flex-col items-center text-center">
          <h1 className="text-[40px] font-medium leading-[38px] tracking-[-0.4px] text-[#151515] sm:text-[56px] sm:leading-[52px] sm:tracking-[-0.6px] md:text-[80px] md:leading-[74px] md:tracking-[-0.8px]">
            <span className="block">Konten auf den</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: quietGradient }}
            >
              Namen Ihrer
            </span>
            <span className="block">Kundschaft.</span>
          </h1>
          <p className="mt-6 max-w-[450px] text-[20px] font-normal leading-[1.5] text-[rgba(21,21,21,0.36)]">
            Die Person legt die Konten selbst an und bestätigt jeden Schritt über einen geheimen Link.
          </p>
          <Link
            href="/registrieren"
            className="mt-8 inline-flex items-center rounded-full bg-[#151515] px-4 py-[10px] text-[18px] font-medium leading-none text-white shadow-[0_1px_1px_rgba(21,21,21,0.05),0_10px_24px_rgba(21,21,21,0.10)] transition-colors duration-150 hover:bg-[#0e0e0e]"
          >
            Agentur registrieren
          </Link>
          <a
            href="#ablauf"
            className="mt-4 inline-flex items-center gap-1.5 text-[16px] font-medium leading-[1.5] text-[rgba(21,21,21,0.36)] transition-colors duration-150 hover:text-[rgba(21,21,21,0.64)]"
          >
            So läuft es
            <ArrowDown />
          </a>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-16 px-4 py-16">
        <section>
          <h2 className="mb-5 text-[20px] font-semibold leading-[1.2]">Auf den Namen der Kundschaft</h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {providers.map((provider) => (
              <li key={provider.id} className="rounded-[12px] bg-[rgba(21,21,21,0.08)] p-px">
                <div className="flex items-center gap-3 rounded-[11px] bg-white px-3 py-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(21,21,21,0.04)] text-[13px] font-medium leading-none text-[rgba(21,21,21,0.64)]">
                    {monogram(provider.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[16px] font-medium leading-[1.3]">{provider.name}</span>
                    <span className="mt-0.5 block text-[14px] font-normal leading-[1.4] text-[rgba(21,21,21,0.48)]">
                      {roles[provider.id]}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="ablauf" className="scroll-mt-8">
          <h2 className="mb-5 text-[20px] font-semibold leading-[1.2]">So läuft es</h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {steps.map((step) => (
              <li key={step.title} className="rounded-[12px] bg-[rgba(21,21,21,0.08)] p-px">
                <div className="rounded-[11px] bg-white px-4 py-4">
                  <h3 className="text-[16px] font-medium leading-[1.5]">{step.title}</h3>
                  <p className="mt-1 text-[14px] font-normal leading-[1.5] text-[rgba(21,21,21,0.48)]">{step.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-5 text-[20px] font-semibold leading-[1.2]">Nach der Aufgabe</h2>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {jobs.map((job) => (
              <li key={job.label} className="h-[108px] rounded-[12px] bg-[rgba(21,21,21,0.08)] p-px">
                <div className="flex h-full flex-col justify-between rounded-[11px] bg-white p-3">
                  <JobMark kind={job.mark} />
                  <span className="text-[14px] font-medium leading-[1.4]">{job.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mx-auto flex w-full max-w-[960px] flex-col items-center px-4 pb-16 text-center">
        <p
          className="max-w-[600px] bg-clip-text text-[32px] font-medium leading-[1.15] text-transparent sm:text-[40px]"
          style={{ backgroundImage: quietGradient }}
        >
          Ein geheimer Link, und Sie sehen, was noch offen ist.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/registrieren"
            className="inline-flex h-[38px] items-center rounded-[19px] border border-[#353535] bg-[#353535] px-4 text-[16px] font-medium leading-none text-white transition-colors duration-150 hover:bg-[#2B2B2B]"
          >
            Agentur registrieren
          </Link>
          <Link
            href="/anmelden"
            className="inline-flex h-[38px] items-center rounded-[19px] bg-[rgba(21,21,21,0.04)] px-4 text-[16px] font-medium leading-none text-[rgba(21,21,21,0.64)] transition-colors duration-150 hover:bg-[rgba(21,21,21,0.07)]"
          >
            Anmelden
          </Link>
        </div>
      </section>

      <footer className="border-t border-[rgba(21,21,21,0.08)]">
        <div className="mx-auto flex w-full max-w-[960px] flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] leading-[1.5] text-[rgba(21,21,21,0.36)]">EasyCustomerAccess</p>
          <nav className="flex gap-4">
            <Link
              href="/anmelden"
              className="text-[13px] font-medium leading-[1.5] text-[rgba(21,21,21,0.36)] transition-colors duration-150 hover:text-[#151515]"
            >
              Anmelden
            </Link>
            <Link
              href="/registrieren"
              className="text-[13px] font-medium leading-[1.5] text-[rgba(21,21,21,0.36)] transition-colors duration-150 hover:text-[#151515]"
            >
              Agentur registrieren
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
