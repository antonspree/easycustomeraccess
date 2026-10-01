import type { Metadata } from "next"
import { ExternalLinkIcon } from "lucide-react"
import { ConfirmStepForm } from "@/components/confirm-step-form"
import { StuckForm } from "@/components/stuck-form"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { readSession } from "@/lib/auth"
import { getSetupByToken, markSetupOpened } from "@/lib/db"
import { findNextStep, setupProgress } from "@/lib/providers/status"
import { stepGuidePath } from "@/lib/step-guide"
import { fillTemplate } from "@/lib/text"

export const metadata: Metadata = { title: "Einrichtung" }
export const dynamic = "force-dynamic"

export default async function CustomerSetupPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const loaded = await getSetupByToken(token)

  if (!loaded) {
    return (
      <main className="mx-auto flex w-full max-w-xl px-6 py-24">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Link ungültig</EmptyTitle>
            <EmptyDescription>
              Dieser Einrichtungslink ist unbekannt. Bitten Sie die Agentur um den aktuellen Link. Ein Login gibt es hier nicht.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </main>
    )
  }

  if (!loaded.setup.openedAt) {
    await markSetupOpened(loaded.setup.id, loaded.setup.agencyId)
  }
  const { setup, customer, agency } = loaded
  const vars = {
    customerEmail: customer.email,
    customerName: customer.name,
    agencyEmail: agency.email,
    agencyName: agency.name,
  }
  const opened = true
  const progress = setupProgress({ opened, providers: setup.providers })
  const next = findNextStep({ providers: setup.providers })
  const guide = next ? stepGuidePath(next.definition.id, next.step.id) : null
  const session = await readSession()
  const openNote = next
    ? setup.blocks.find(
        (block) =>
          !block.resolvedAt &&
          block.providerId === next.definition.id &&
          block.stepId === next.step.id,
      )
    : undefined

  return (
    <div className="min-h-svh bg-background text-foreground">
      {agency.bannerUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={agency.bannerUrl} alt="" className="h-40 w-full object-cover sm:h-56" />
      ) : null}
      <main className="mx-auto flex w-full max-w-xl flex-col gap-12 px-6 py-16 sm:py-24">
        <header className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            {agency.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={agency.logoUrl} alt="" className="size-10 object-contain" />
            ) : null}
            <p className="text-sm">{agency.name}</p>
            {session?.agency.id === agency.id ? (
              <a href="/uebersicht" className="ml-auto text-sm underline underline-offset-4">
                Zur Übersicht
              </a>
            ) : null}
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Einrichtung für {customer.name}</p>
            <h1 className="font-heading text-4xl leading-tight">Konten auf Ihren Namen</h1>
            <p className="leading-relaxed text-muted-foreground">
              {agency.name} führt Sie durch die Schritte. Sie melden sich hier nicht an. Verwenden Sie durchgehend {customer.email}. Eingeladen wird {agency.email}.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {progress.confirmed} von {progress.total} Schritten
          </p>
          <p className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
            {progress.providers.map((provider) => (
              <span key={provider.providerId}>
                {provider.definition?.name ?? provider.providerId}
                {" · "}
                <StatusBadge status={provider.status} />
              </span>
            ))}
          </p>
        </header>

        {next ? (
          <article className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                {next.definition.name} · Schritt {next.confirmedInProvider + 1} von {next.totalInProvider}
              </p>
              <h2 className="font-heading text-3xl leading-tight">{next.step.title}</h2>
            </div>
            <p className="text-lg leading-relaxed">{fillTemplate(next.step.instruction, vars)}</p>
            {guide ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={guide}
                alt={`Aufnahme: ${next.step.title}`}
                className="w-full max-w-sm"
              />
            ) : null}
            <dl className="flex flex-col gap-6 text-sm">
              <div className="flex flex-col gap-1">
                <dt>Welche E-Mail</dt>
                <dd className="text-muted-foreground">{fillTemplate(next.step.email, vars)}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt>Rolle der Agentur</dt>
                <dd className="text-muted-foreground">{fillTemplate(next.step.agencyRole, vars)}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt>Wann es fertig ist</dt>
                <dd className="text-muted-foreground">{fillTemplate(next.step.doneMeans, vars)}</dd>
              </div>
            </dl>
            {next.step.href ? (
              <Button
                variant="outline"
                className="w-fit"
                render={
                  <a href={next.step.href} target="_blank" rel="noopener noreferrer" />
                }
              >
                {next.step.hrefLabel ?? "Beim Anbieter öffnen"}
                <ExternalLinkIcon data-icon="inline-end" />
              </Button>
            ) : null}
            {openNote ? (
              <p className="text-sm leading-relaxed">
                Hinweis ist bei der Agentur. {openNote.note}
              </p>
            ) : null}
            <StuckForm token={token} providerId={next.definition.id} stepId={next.step.id} />
            <ConfirmStepForm
              token={token}
              providerId={next.definition.id}
              stepId={next.step.id}
              email={customer.email}
            />
          </article>
        ) : (
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-3xl">Alles bestätigt</h2>
            <p className="leading-relaxed text-muted-foreground">
              {agency.name} sieht den Stand in der Übersicht und nimmt offene Einladungen im eigenen Postfach an. Es wurde kein Konto, keine Organisation und kein Projekt automatisch angelegt. Die Bestätigungen sind mit {customer.email} gespeichert.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
