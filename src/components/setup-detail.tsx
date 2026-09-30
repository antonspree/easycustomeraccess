import { AcceptInvitationForm } from "@/components/agency-forms"
import { CopyLink } from "@/components/copy-link"
import { StatusBadge } from "@/components/status-badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { resolveBlockAction } from "@/lib/actions"
import type { SetupBundle } from "@/lib/db"
import { inviteLines } from "@/lib/invitations"
import { getAdapter } from "@/lib/providers/adapter"
import { setupProgress } from "@/lib/providers/status"
import { fillTemplate, formatDateTime, type TemplateVars } from "@/lib/text"

export function SetupDetail({
  setup,
  origin,
  customerId,
  vars,
}: {
  setup: SetupBundle
  origin: string
  customerId: string
  vars: TemplateVars
}) {
  const progress = setupProgress({
    opened: Boolean(setup.openedAt),
    providers: setup.providers,
  })
  const url = `${origin}/einrichten/${setup.token}`
  const lines = inviteLines({
    providers: setup.providers,
    invitations: setup.invitations,
  })
  const openBlocks = setup.blocks.filter((block) => !block.resolvedAt)

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

        {lines.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">Einladungen im Postfach</p>
            {lines.map((line) => (
              <div key={`${line.providerId}-${line.stepId}`} className="flex flex-col gap-2 rounded-lg border p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm">{line.providerName}</span>
                  {line.state === "angenommen" ? (
                    <Badge variant="default">Einladung angenommen</Badge>
                  ) : (
                    <Badge variant="outline">Einladung noch nicht angenommen</Badge>
                  )}
                </div>
                {line.state === "angenommen" && line.acceptedAt ? (
                  <p className="text-sm text-muted-foreground">
                    {line.memberName} am {formatDateTime(line.acceptedAt)}. Das ist Ihre eigene Notiz, kein Abruf beim Anbieter.
                  </p>
                ) : (
                  <AcceptInvitationForm
                    setupId={setup.id}
                    customerId={customerId}
                    providerId={line.providerId}
                    stepId={line.stepId}
                  />
                )}
              </div>
            ))}
          </div>
        ) : null}

        {openBlocks.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">Hinweise der Kundschaft</p>
            {openBlocks.map((block) => (
              <div key={`${block.providerId}-${block.stepId}`} className="flex flex-col gap-2 rounded-lg border p-3">
                <p className="text-sm">
                  {block.providerId} · {block.stepId}
                </p>
                <p>{block.note}</p>
                <p className="text-sm text-muted-foreground">{formatDateTime(block.createdAt)}</p>
                <form action={resolveBlockAction}>
                  <input type="hidden" name="customerId" value={customerId} />
                  <input type="hidden" name="setupId" value={setup.id} />
                  <input type="hidden" name="providerId" value={block.providerId} />
                  <input type="hidden" name="stepId" value={block.stepId} />
                  <Button type="submit" variant="outline" size="sm">
                    Hinweis erledigt
                  </Button>
                </form>
              </div>
            ))}
          </div>
        ) : null}

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
