import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyLink } from "@/components/copy-link"
import { StatusBadge } from "@/components/status-badge"
import type { SetupBundle } from "@/lib/db"
import { getAdapter } from "@/lib/providers/adapter"
import { setupProgress } from "@/lib/providers/status"
import { fillTemplate, formatDateTime, type TemplateVars } from "@/lib/text"

export function SetupDetail({
  setup,
  origin,
  vars,
}: {
  setup: SetupBundle
  origin: string
  vars: TemplateVars
}) {
  const progress = setupProgress({
    opened: Boolean(setup.openedAt),
    providers: setup.providers,
  })
  const url = `${origin}/einrichten/${setup.token}`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Einrichtung</CardTitle>
        <CardDescription>
          {progress.confirmed} von {progress.total} Schritten bestätigt
          {setup.openedAt
            ? `. Link geöffnet am ${formatDateTime(setup.openedAt)}.`
            : ". Der Link wurde noch nicht geöffnet."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <CopyLink url={url} />
        <p className="text-sm text-muted-foreground">
          Offen heißt: der Link ist noch nicht geöffnet. Wartet auf den Kunden heißt: die Einrichtung ist angelaufen, aber noch nicht vollständig. Fertig heißt: alle Schritte dieses Anbieters sind mit der E-Mail des Kunden bestätigt.
        </p>
        <Accordion multiple>
          {progress.providers.map((provider) => {
            const adapter = provider.definition
              ? getAdapter(provider.definition.adapterId)
              : null
            return (
              <AccordionItem key={provider.providerId} value={provider.providerId}>
                <AccordionTrigger>
                  <span className="flex flex-wrap items-center gap-2 pr-2">
                    <span>{provider.definition?.name ?? provider.providerId}</span>
                    <StatusBadge status={provider.status} />
                    <span className="text-muted-foreground">
                      {provider.confirmedCount} von {provider.totalSteps}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3">
                    {adapter && !adapter.createsResources ? (
                      <p className="text-muted-foreground">
                        Nur Anleitung. Nach der Zustimmung wird bei diesem Anbieter nichts über eine Schnittstelle angelegt.
                      </p>
                    ) : null}
                    <ol className="flex flex-col gap-3">
                      {provider.definition?.steps.map((step, index) => {
                        const confirmation = provider.confirmations.find(
                          (item) => item.stepId === step.id,
                        )
                        return (
                          <li key={step.id} className="flex flex-col gap-1">
                            <p className="font-medium">
                              {index + 1}. {step.title}
                            </p>
                            <p className="text-muted-foreground">
                              {confirmation?.confirmedEmail && confirmation.confirmedAt
                                ? `Bestätigt als ${confirmation.confirmedEmail} am ${formatDateTime(confirmation.confirmedAt)}.`
                                : "Noch nicht bestätigt."}
                            </p>
                            <p>{fillTemplate(step.instruction, vars)}</p>
                          </li>
                        )
                      })}
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </CardContent>
    </Card>
  )
}
