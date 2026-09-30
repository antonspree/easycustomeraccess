"use client"

import { useActionState } from "react"
import { blockStepAction, type FormState } from "@/lib/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"

const initial: FormState = {}

export function StuckForm({
  token,
  providerId,
  stepId,
}: {
  token: string
  providerId: string
  stepId: string
}) {
  const [state, action, pending] = useActionState(blockStepAction, initial)

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="providerId" value={providerId} />
      <input type="hidden" name="stepId" value={stepId} />
      {state.error ? (
        <Alert variant="destructive">
          <AlertTitle>Notiz nicht gespeichert</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <Field>
        <FieldLabel htmlFor="stuck-note">Ich komme nicht weiter</FieldLabel>
        <textarea
          id="stuck-note"
          name="note"
          required
          rows={3}
          maxLength={500}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
        />
        <FieldDescription>
          Die Agentur sieht den Hinweis und kann nachfassen. Das Konto bleibt bei Ihnen.
        </FieldDescription>
      </Field>
      <Button type="submit" variant="outline" disabled={pending} className="w-full sm:w-auto">
        {pending ? <Spinner data-icon="inline-start" aria-label="Bitte warten" /> : null}
        Hinweis an die Agentur
      </Button>
    </form>
  )
}
