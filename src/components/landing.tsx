import Link from "next/link"
import {
  ArrowDownIcon,
  ChartBarIcon,
  CircleStackIcon,
  CreditCardIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  LinkIcon,
  ServerStackIcon,
} from "@heroicons/react/24/outline"
import { providers } from "@/lib/catalog"

const roles: Record<string, string> = {
  supabase: "Datenbank, Owner bleibt die Kundschaft",
  vercel: "Hosting, Developer im Tarif Pro",
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
  { label: "Daten", Icon: CircleStackIcon },
  { label: "Hosting", Icon: ServerStackIcon },
  { label: "Domain", Icon: GlobeAltIcon },
  { label: "Zahlung", Icon: CreditCardIcon },
  { label: "Analyse", Icon: ChartBarIcon },
  { label: "E-Mail", Icon: EnvelopeIcon },
]

const quietGradient = "linear-gradient(100deg, #151515 0%, #5d6c78 46%, #6e8f80 72%, #151515 100%)"

const monograms: Record<string, string> = {
  supabase: "Su",
  vercel: "Ve",
  netlify: "Ne",
  cloudflare: "Cf",
  github: "Gh",
  "google-analytics": "GA",
  "google-search-console": "SC",
  stripe: "St",
  resend: "Re",
  sanity: "Sa",
  ionos: "Io",
  plausible: "Pl",
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
            <LinkIcon className="size-5 shrink-0" aria-hidden />
            Blokr
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
            <ArrowDownIcon className="size-4 shrink-0" aria-hidden />
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
                    {monograms[provider.id]}
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
            {jobs.map((job) => {
              const Icon = job.Icon
              return (
                <li key={job.label} className="h-[108px] rounded-[12px] bg-[rgba(21,21,21,0.08)] p-px">
                  <div className="flex h-full flex-col justify-between rounded-[11px] bg-white p-3">
                    <Icon className="size-6" aria-hidden />
                    <span className="text-[14px] font-medium leading-[1.4]">{job.label}</span>
                  </div>
                </li>
              )
            })}
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
          <p className="text-[13px] leading-[1.5] text-[rgba(21,21,21,0.36)]">blokr.de</p>
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
