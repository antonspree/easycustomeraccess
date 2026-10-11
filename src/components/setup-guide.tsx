import { Button } from "@/components/button"
import { confirmStepAction } from "@/lib/actions"
import { fillStrings, minutesFor, type GuideVars } from "@/lib/catalog"
import type { CurrentGuideStep, GuideProvider } from "@/lib/guide"

function minutesLabel(minutes: number) {
  if (minutes <= 1) return "etwa 1 Minute"
  return `etwa ${minutes} Minuten`
}

function ImageBlock({
  image,
}: {
  image: { src: string; alt: string; kind: "screenshot" | "schematic"; caption?: string }
}) {
  return (
    <figure className="overflow-hidden rounded-[16px] border border-[var(--divider)] bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.alt} className="w-full" />
      <figcaption className="px-3 py-2 text-[13px] leading-[1.45] text-[var(--text-48)]">
        {image.kind === "schematic" ? "Schematische Darstellung, kein Original-Screenshot. " : "Aufnahme der öffentlichen Anbieterseite. "}
        {image.caption}
      </figcaption>
    </figure>
  )
}

export function SetupIntro({
  agency,
  vars,
  providers,
  started,
}: {
  agency: string
  vars: GuideVars
  providers: GuideProvider[]
  started: boolean
}) {
  const minutes = minutesFor(providers)
  const steps = providers.reduce((sum, provider) => sum + provider.steps.length, 0)
  return (
    <section className="max-w-[640px]">
      <h1 className="text-[28px] font-semibold leading-[1.2]">Ihre Konten, Schritt für Schritt</h1>
      <p className="mt-4 text-[16px] leading-[1.55]">
        {agency} richtet Dienste so ein, dass die Konten auf Ihren Namen und {vars.email} laufen. Sie bleiben Inhaberin
        oder Inhaber. Die Agentur bekommt nur die Rechte, die sie für die Arbeit braucht.
      </p>
      <details className="mt-5 rounded-[16px] border border-[var(--divider)] bg-white px-4 py-3" open={!started}>
        <summary className="cursor-pointer text-[15px] font-medium leading-[1.5]">Was passiert hier?</summary>
        <div className="mt-3 flex flex-col gap-3 pb-1 text-[14px] leading-[1.55] text-[var(--text-64)]">
          <p>
            Dieser Link ist geheim. Es gibt kein Kundenlogin. Blokr legt bei den Anbietern nichts an und verschickt
            keine E-Mails.
          </p>
          <p>
            Sie sehen immer nur den nächsten Schritt. Erst wenn Sie ihn bei dem Anbieter erledigt haben, markieren Sie
            ihn hier. {agency} sieht den Stand.
          </p>
          <p>
            {providers.length === 1 ? "Ein Anbieter" : `${providers.length} Anbieter`}, {steps} Schritte,{" "}
            {minutesLabel(minutes)} — je nach E-Mail-Bestätigung und 2-Faktor oft etwas mehr.
          </p>
          <p>Bereithalten: Zugang zum Postfach {vars.email}, ein eigenes Passwort, Ihr Telefon falls 2-Faktor verlangt wird.</p>
        </div>
      </details>
    </section>
  )
}

export function SetupOverview({ providers }: { providers: GuideProvider[] }) {
  return (
    <section className="mt-10 max-w-[640px]">
      <h2 className="text-[20px] font-semibold leading-[1.2]">Überblick</h2>
      <ol className="mt-4 flex flex-col gap-2">
        {providers.map((provider) => (
          <li
            key={provider.id}
            className={`rounded-[16px] border px-4 py-3 ${
              provider.current
                ? "border-[rgba(21,21,21,0.2)] bg-white"
                : "border-[var(--divider)] bg-[rgba(255,255,255,0.64)]"
            }`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[16px] font-medium leading-[1.4]">{provider.name}</p>
              <p className="shrink-0 text-[13px] leading-[1.4] text-[var(--text-48)]">
                {provider.complete
                  ? "Fertig"
                  : provider.current
                    ? "Jetzt"
                    : `${provider.doneCount}/${provider.steps.length}`}
              </p>
            </div>
            <p className="mt-1 text-[13px] leading-[1.45] text-[var(--text-48)]">{provider.summary}</p>
            <ol className="mt-2 flex flex-col gap-1">
              {provider.steps.map((step) => (
                <li key={step.id} className="flex items-start gap-2 text-[13px] leading-[1.4]">
                  <span aria-hidden className={step.done ? "text-[var(--text)]" : "text-[var(--text-32)]"}>
                    {step.done ? "●" : step.current ? "○" : "·"}
                  </span>
                  <span className={step.current ? "font-medium" : "text-[var(--text-64)]"}>{step.title}</span>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function SetupStep({
  current,
  token,
  vars,
  hint,
  confirmed,
  total,
}: {
  current: CurrentGuideStep
  token: string
  vars: GuideVars
  hint: boolean
  confirmed: number
  total: number
}) {
  const step = fillStrings(current.step, vars)
  return (
    <section className="mt-10 max-w-[640px]">
      <p className="text-[13px] leading-[1.5] text-[var(--text-48)]">
        {current.provider.name} · Schritt {current.index} von {current.of} · {confirmed} von {total} insgesamt
      </p>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--fill-08)]">
        <div
          className="h-full bg-[var(--button-dark)]"
          style={{ width: `${Math.max(6, Math.round((confirmed / Math.max(total, 1)) * 100))}%` }}
        />
      </div>
      <h2 className="mt-6 text-[24px] font-semibold leading-[1.25]">{step.title}</h2>
      <p className="mt-3 text-[16px] leading-[1.55]">{step.intro}</p>
      {step.url ? (
        <p className="mt-4">
          <a
            href={step.url}
            target="_blank"
            rel="noreferrer"
            className="text-[15px] font-medium leading-[1.5] underline decoration-[rgba(21,21,21,0.24)] underline-offset-4"
          >
            {step.urlLabel ?? step.url}
          </a>
        </p>
      ) : null}

      <details className="mt-6 rounded-[16px] border border-[var(--divider)] bg-white px-4 py-3" open>
        <summary className="cursor-pointer text-[15px] font-medium leading-[1.5]">Genaue Anleitung</summary>
        <div className="mt-4 flex flex-col gap-5 pb-2">
          {step.image ? <ImageBlock image={step.image} /> : null}
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-[15px] leading-[1.55]">
            {step.substeps.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
          {step.tips?.length ? (
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.04em] text-[var(--text-36)]">Hinweise</p>
              <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-[14px] leading-[1.5] text-[var(--text-64)]">
                {step.tips.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {step.pitfalls?.length ? (
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.04em] text-[var(--text-36)]">Häufige Stolperstellen</p>
              <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-[14px] leading-[1.5] text-[var(--text-64)]">
                {step.pitfalls.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <p className="rounded-[12px] bg-[var(--fill-04)] px-3 py-3 text-[14px] leading-[1.5]">
            Fertig, wenn: {step.doneWhen}
          </p>
          {step.help ? <p className="text-[14px] leading-[1.5] text-[var(--text-64)]">{step.help}</p> : null}
        </div>
      </details>

      {hint ? <p className="mt-4 text-[14px] leading-[1.5]">Dieser Schritt ist nicht der nächste.</p> : null}

      <form action={confirmStepAction} className="mt-8">
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="providerId" value={current.provider.id} />
        <input type="hidden" name="stepId" value={current.step.id} />
        <Button type="submit">Diesen Schritt erledigt</Button>
      </form>
      <p className="mt-3 text-[13px] leading-[1.45] text-[var(--text-36)]">
        Klicken Sie erst, wenn der Schritt beim Anbieter wirklich erledigt ist. {vars.agency} sieht das sofort.
      </p>
    </section>
  )
}

export function SetupFinish({
  agency,
  providers,
  total,
}: {
  agency: string
  providers: GuideProvider[]
  total: number
}) {
  return (
    <section className="max-w-[640px]">
      <h1 className="text-[28px] font-semibold leading-[1.2]">Alles bestätigt</h1>
      <p className="mt-4 text-[16px] leading-[1.55]">
        Sie haben alle {total} Schritte markiert. {agency} sieht den Stand und kann mit der technischen Arbeit
        weitermachen. Die Konten bleiben Ihre.
      </p>
      <ul className="mt-8 flex flex-col gap-2">
        {providers.map((provider) => (
          <li key={provider.id} className="rounded-[16px] border border-[var(--divider)] bg-white px-4 py-3">
            <p className="text-[16px] font-medium leading-[1.4]">{provider.name}</p>
            <p className="mt-1 text-[14px] leading-[1.45] text-[var(--text-64)]">{provider.summary}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-[14px] leading-[1.5] text-[var(--text-48)]">
        Diesen Link können Sie schließen. Wenn später ein Schritt fehlt, schickt Ihnen {agency} denselben oder einen
        neuen Link.
      </p>
    </section>
  )
}
