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
import { getSetupByToken, markSetupOpened } from "@/lib/db"
import { findNextStep, setupProgress } from "@/lib/providers/status"
import { fillTemplate } from "@/lib/text"

export const metadata: Metadata = { title: "Einrichtung" }
export const dynamic = "force-dynamic"

export default async function CustomerSetupPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const loaded = getSetupByToken(token)

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
    markSetupOpened(loaded.setup.id, loaded.setup.agencyId)
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

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-6 sm:py-10">
      <div className="flex flex-col gap-1">
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
              <div className="flex flex-col gap-1">
                <dt className="text-sm font-medium">Was Sie tun</dt>
                <dd className="text-muted-foreground">{fillTemplate(next.step.instruction, vars)}</dd>
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
  )
}
