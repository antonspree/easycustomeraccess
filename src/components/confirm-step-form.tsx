"use client"

import { useActionState } from "react"
import { confirmStepAction, type FormState } from "@/lib/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

const initial: FormState = {}

export function ConfirmStepForm({
  token,
  providerId,
  stepId,
  email,
}: {
  token: string
  providerId: string
  stepId: string
  email: string
}) {
  const [state, action, pending] = useActionState(confirmStepAction, initial)

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="providerId" value={providerId} />
      <input type="hidden" name="stepId" value={stepId} />
      {state.error ? (
        <Alert variant="destructive">
          <AlertTitle>Bestätigung nicht gespeichert</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? <Spinner data-icon="inline-start" aria-label="Bitte warten" /> : null}
        Ich habe das mit {email} bestätigt
      </Button>
    </form>
  )
}
