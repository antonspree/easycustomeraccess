"use client"

import { useActionState } from "react"
import { acceptTeamInviteAction, type FormState } from "@/lib/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const initial: FormState = {}

export function JoinForm({ token, email }: { token: string; email: string }) {
  const [state, action, pending] = useActionState(acceptTeamInviteAction, initial)

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      {state.error ? (
        <Alert variant="destructive">
          <AlertTitle>Beitritt nicht möglich</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="join-email">E-Mail</FieldLabel>
          <Input id="join-email" value={email} readOnly />
          <FieldDescription>Mit dieser Adresse melden Sie sich danach an.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="join-name">Ihr Name</FieldLabel>
          <Input id="join-name" name="name" autoComplete="name" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="join-password">Passwort</FieldLabel>
          <Input id="join-password" name="password" type="password" autoComplete="new-password" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="join-password-again">Passwort wiederholen</FieldLabel>
          <Input id="join-password-again" name="passwordAgain" type="password" autoComplete="new-password" required />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? <Spinner data-icon="inline-start" aria-label="Bitte warten" /> : null}
        Team beitreten
      </Button>
    </form>
  )
}
