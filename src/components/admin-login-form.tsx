"use client"

import { useActionState } from "react"
import { adminLoginAction } from "@/app/verwaltung/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(adminLoginAction, {} as { error?: string })
  return (
    <form action={action} className="flex flex-col gap-4">
      {state.error ? (
        <Alert variant="destructive">
          <AlertTitle>Anmeldung fehlgeschlagen</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="admin-email">E-Mail</FieldLabel>
          <Input id="admin-email" name="email" type="email" autoComplete="username" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="admin-password">Passwort</FieldLabel>
          <Input id="admin-password" name="password" type="password" autoComplete="current-password" required />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? <Spinner data-icon="inline-start" aria-label="Bitte warten" /> : null}
        Anmelden
      </Button>
    </form>
  )
}
