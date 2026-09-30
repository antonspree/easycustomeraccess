import type { Metadata } from "next"
import { ExternalLinkIcon } from "lucide-react"
import { ConfirmStepForm } from "@/components/confirm-step-form"
import { StuckForm } from "@/components/stuck-form"
import { StatusBadge } from "@/components/status-badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { readSession } from "@/lib/auth"
import { contrastOn } from "@/lib/brand"
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
      <main className="mx-auto flex w-full max-w-xl px-4 py-10">
        <Empty className="border bg-card">
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
  const percent = progress.total === 0 ? 0 : Math.round((progress.confirmed / progress.total) * 100)
  const guide = next ? stepGuidePath(next.definition.id, next.step.id) : null
  const session = await readSession()
  const onAccent = contrastOn(agency.brandAccent)
  const brandStyle = {
    backgroundColor: agency.brandBackground,
    color: agency.brandText,
    "--background": agency.brandBackground,
    "--foreground": agency.brandText,
    "--card": agency.brandBackground,
    "--card-foreground": agency.brandText,
    "--popover": agency.brandBackground,
    "--popover-foreground": agency.brandText,
    "--primary": agency.brandAccent,
    "--primary-foreground": onAccent,
    "--secondary": `color-mix(in srgb, ${agency.brandAccent} 18%, ${agency.brandBackground})`,
    "--secondary-foreground": agency.brandText,
    "--muted": `color-mix(in srgb, ${agency.brandAccent} 12%, ${agency.brandBackground})`,
    "--muted-foreground": `color-mix(in srgb, ${agency.brandText} 72%, transparent)`,
    "--accent": `color-mix(in srgb, ${agency.brandAccent} 18%, ${agency.brandBackground})`,
    "--accent-foreground": agency.brandText,
    "--border": `color-mix(in srgb, ${agency.brandText} 22%, transparent)`,
    "--input": `color-mix(in srgb, ${agency.brandText} 28%, transparent)`,
    "--ring": agency.brandAccent,
  } as React.CSSProperties

  return (
    <div className="min-h-svh" style={brandStyle}>
      {agency.bannerUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={agency.bannerUrl} alt="" className="h-36 w-full object-cover sm:h-48" />
      ) : null}
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-6 sm:py-10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {agency.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={agency.logoUrl} alt="" className="size-12 rounded-md border object-contain" />
          ) : null}
          <p className="font-heading text-lg">{agency.name}</p>
          {session?.agency.id === agency.id ? (
            <Button className="ml-auto" variant="outline" size="sm" render={<a href="/uebersicht" />}>
              Zur Übersicht
            </Button>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">Einrichtung für {customer.name}</p>
        <h1 className="font-heading text-3xl">Konten auf Ihren Namen</h1>
        <p className="text-sm text-muted-foreground">
          {agency.name} führt Sie durch die Schritte. Sie melden sich hier nicht an. Verwenden Sie durchgehend {customer.email}. Eingeladen wird {agency.email}.
        </p>
      </div>

      <Progress value={percent}>
        <ProgressLabel>
          {progress.confirmed} von {progress.total} Schritten
        </ProgressLabel>
        <ProgressValue />
      </Progress>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {progress.providers.map((provider) => (
          <span key={provider.providerId} className="flex shrink-0 items-center gap-2 rounded-lg border bg-card px-2 py-1">
            <span className="text-sm">{provider.definition?.name ?? provider.providerId}</span>
            <StatusBadge status={provider.status} />
          </span>
        ))}
      </div>

      {next ? (
        <Card>
          <CardHeader>
            <CardTitle>{next.step.title}</CardTitle>
            <CardDescription>
              {next.definition.name} · Schritt {next.confirmedInProvider + 1} von {next.totalInProvider}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Alert>
              <AlertTitle>Ihre E-Mail</AlertTitle>
              <AlertDescription>{customer.email}</AlertDescription>
            </Alert>
            <dl className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <dt className="text-sm font-medium">Was Sie tun</dt>
                <dd className="flex flex-col gap-3 text-muted-foreground sm:flex-row sm:items-start">
                  <span className="min-w-0 flex-1">{fillTemplate(next.step.instruction, vars)}</span>
                  {guide ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={guide}
                      alt={`Aufnahme: ${next.step.title}`}
                      className="w-full shrink-0 rounded-lg border sm:w-60"
                    />
                  ) : null}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-sm font-medium">Welche E-Mail</dt>
                <dd className="text-muted-foreground">{fillTemplate(next.step.email, vars)}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-sm font-medium">Rolle der Agentur</dt>
                <dd className="text-muted-foreground">{fillTemplate(next.step.agencyRole, vars)}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-sm font-medium">Wann es fertig ist</dt>
                <dd className="text-muted-foreground">{fillTemplate(next.step.doneMeans, vars)}</dd>
              </div>
            </dl>
            {next.step.href ? (
              <Button
                variant="outline"
                className="w-full sm:w-fit"
                render={
                  <a href={next.step.href} target="_blank" rel="noopener noreferrer" />
                }
              >
                {next.step.hrefLabel ?? "Beim Anbieter öffnen"}
                <ExternalLinkIcon data-icon="inline-end" />
              </Button>
            ) : null}
            {setup.blocks.some(
              (block) =>
                !block.resolvedAt &&
                block.providerId === next.definition.id &&
                block.stepId === next.step.id,
            ) ? (
              <Alert>
                <AlertTitle>Hinweis ist bei der Agentur</AlertTitle>
                <AlertDescription>
                  {
                    setup.blocks.find(
                      (block) =>
                        !block.resolvedAt &&
                        block.providerId === next.definition.id &&
                        block.stepId === next.step.id,
                    )?.note
                  }
                </AlertDescription>
              </Alert>
            ) : null}
            <StuckForm token={token} providerId={next.definition.id} stepId={next.step.id} />
            <div className="sticky bottom-0 border-t bg-card py-3">
              <ConfirmStepForm
                token={token}
                providerId={next.definition.id}
                stepId={next.step.id}
                email={customer.email}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Alles bestätigt</CardTitle>
            <CardDescription>
              {agency.name} sieht den Stand in der Übersicht und nimmt offene Einladungen im eigenen Postfach an.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Es wurde kein Konto, keine Organisation und kein Projekt automatisch angelegt. Die Bestätigungen sind mit {customer.email} gespeichert.
            </p>
          </CardContent>
        </Card>
      )}
    </main>
    </div>
  )
}
