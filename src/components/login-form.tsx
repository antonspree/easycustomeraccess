"use client"

import { useActionState } from "react"
import Link from "next/link"
import { loginAction, registerAction, type FormState } from "@/lib/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const initial: FormState = {}

function AuthScreen({
  title,
  description,
  children,
  switchHref,
  switchLabel,
  className,
}: {
  title: string
  description: string
  children: React.ReactNode
  switchHref: string
  switchLabel: string
  className?: string
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className={cn("flex w-full max-w-sm flex-col gap-6", className)}>
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <span aria-hidden className="size-2.5 rounded-full bg-primary" />
          EasyCustomerAccess
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
        <FieldDescription className="px-6 text-center">
          <Link href={switchHref} className="text-primary underline underline-offset-4">
            {switchLabel}
          </Link>
          {" · "}
          <Link href="/datenschutz" className="text-primary underline underline-offset-4">
            Datenschutz
          </Link>
        </FieldDescription>
      </div>
    </div>
  )
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial)
  return (
    <AuthScreen
      title="Anmelden"
      description="Mit Ihrer E-Mail und Ihrem Passwort. Die Anmeldung gilt für Ihre Agentur."
      switchHref="/registrieren"
      switchLabel="Agentur registrieren"
    >
      <form action={action}>
        <FieldGroup>
          {state.error ? (
            <Alert variant="destructive">
              <AlertTitle>Anmeldung fehlgeschlagen</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}
          <Field data-invalid={state.error ? true : undefined}>
            <FieldLabel htmlFor="email">E-Mail</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={state.error ? true : undefined}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Passwort</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </Field>
          <Field>
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? <Spinner data-icon="inline-start" aria-label="Bitte warten" /> : null}
              Anmelden
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthScreen>
  )
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initial)
  return (
    <AuthScreen
      className="max-w-md"
      title="Agentur registrieren"
      description="Die Anmeldung gilt nur für diese Agentur. Kunden melden sich hier nicht an."
      switchHref="/anmelden"
      switchLabel="Schon registriert? Anmelden"
    >
      <form action={action}>
        <FieldGroup>
          {state.error ? (
            <Alert variant="destructive">
              <AlertTitle>Registrierung nicht möglich</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}
          <Field data-invalid={state.error ? true : undefined}>
            <FieldLabel htmlFor="agencyName">Name der Agentur</FieldLabel>
            <Input
              id="agencyName"
              name="agencyName"
              autoComplete="organization"
              required
              aria-invalid={state.error ? true : undefined}
            />
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
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="passwordAgain">Passwort wiederholen</FieldLabel>
            <Input
              id="passwordAgain"
              name="passwordAgain"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </Field>
          {state.error ? <FieldError>{state.error}</FieldError> : null}
          <Field>
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? <Spinner data-icon="inline-start" aria-label="Bitte warten" /> : null}
              Agentur anlegen
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthScreen>
  )
}
