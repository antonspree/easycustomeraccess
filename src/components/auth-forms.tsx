"use client"

import { useActionState } from "react"
import Link from "next/link"
import { loginAction, registerAction, type FormState } from "@/lib/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const initial: FormState = {}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initial)
  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error ? (
        <Alert variant="destructive">
          <AlertTitle>Registrierung nicht möglich</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <FieldGroup>
        <Field data-invalid={state.error ? true : undefined}>
          <FieldLabel htmlFor="agencyName">Name der Agentur</FieldLabel>
          <Input id="agencyName" name="agencyName" autoComplete="organization" required aria-invalid={state.error ? true : undefined} />
          <FieldDescription>So sehen Kunden, wer sie durch die Einrichtung führt.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="email">E-Mail der Agentur</FieldLabel>
          <Input id="email" name="email" type="email" autoComplete="email" required />
          <FieldDescription>
            Damit melden Sie sich an. Dieselbe Adresse laden Kundinnen und Kunden bei den Anbietern ein. Später kann die Einladungsadresse in den Agentur-Einstellungen abweichen.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Passwort</FieldLabel>
          <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
        </Field>
        <Field>
          <FieldLabel htmlFor="passwordAgain">Passwort wiederholen</FieldLabel>
          <Input id="passwordAgain" name="passwordAgain" type="password" autoComplete="new-password" required minLength={8} />
        </Field>
        {state.error ? <FieldError>{state.error}</FieldError> : null}
      </FieldGroup>
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? <Spinner data-icon="inline-start" aria-label="Bitte warten" /> : null}
        Agentur anlegen
      </Button>
      <p className="text-sm text-muted-foreground">
        Schon registriert? <Link href="/anmelden" className="underline underline-offset-4">Anmelden</Link>
      </p>
    </form>
  )
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial)
  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error ? (
        <Alert variant="destructive">
          <AlertTitle>Anmeldung fehlgeschlagen</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <FieldGroup>
        <Field data-invalid={state.error ? true : undefined}>
          <FieldLabel htmlFor="email">E-Mail</FieldLabel>
          <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={state.error ? true : undefined} />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Passwort</FieldLabel>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? <Spinner data-icon="inline-start" aria-label="Bitte warten" /> : null}
        Anmelden
      </Button>
      <p className="text-sm text-muted-foreground">
        Neu hier? <Link href="/registrieren" className="underline underline-offset-4">Agentur registrieren</Link>
      </p>
    </form>
  )
}
