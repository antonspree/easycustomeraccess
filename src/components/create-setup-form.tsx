"use client"

import { useActionState } from "react"
import { createSetupAction, type FormState } from "@/lib/actions"
import { ProviderChecks } from "@/components/provider-checks"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const initial: FormState = {}

export function CreateSetupForm({ agencyEmail }: { agencyEmail: string }) {
  const [state, action, pending] = useActionState(createSetupAction, initial)

  return (
    <form action={action} className="flex flex-col gap-8">
      {state.error ? (
        <Alert variant="destructive">
          <AlertTitle>Einrichtung nicht gespeichert</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="customerName">Name</FieldLabel>
          <Input id="customerName" name="customerName" autoComplete="name" required />
          <FieldDescription>Person oder Firma, auf deren Namen die Konten laufen.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="email">E-Mail</FieldLabel>
          <Input id="email" name="email" type="email" autoComplete="email" required />
          <FieldDescription>
            Mit dieser Adresse legt die Kundin oder der Kunde die Konten an und bestätigt die Schritte.
          </FieldDescription>
        </Field>
      </FieldGroup>

      <ProviderChecks
        legend="Anbieter"
        description={`Ein Link deckt alle gewählten Anbieter ab. Eingeladen wird ${agencyEmail}. Es wird dabei kein Konto bei einem Anbieter angelegt.`}
      />

      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? <Spinner data-icon="inline-start" aria-label="Bitte warten" /> : null}
        Kunde und Link anlegen
      </Button>
    </form>
  )
}
