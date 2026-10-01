"use client"

import { useActionState } from "react"
import {
  acceptInvitationAction,
  addProvidersAction,
  anotherSetupAction,
  changePasswordAction,
  inviteMemberAction,
  renameCustomerAction,
  updateAgencyProfileAction,
  type FormState,
} from "@/lib/actions"
import { ProviderChecks } from "@/components/provider-checks"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const initial: FormState = {}

function FormAlert({ state, title }: { state: FormState; title: string }) {
  if (state.error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{state.error}</AlertDescription>
      </Alert>
    )
  }
  if (state.saved) {
    return (
      <Alert>
        <AlertTitle>Gespeichert</AlertTitle>
        <AlertDescription>{state.saved}</AlertDescription>
      </Alert>
    )
  }
  return null
}

export function RenameCustomerForm({
  customerId,
  name,
}: {
  customerId: string
  name: string
}) {
  const [state, action, pending] = useActionState(renameCustomerAction, initial)
  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="customerId" value={customerId} />
      <FormAlert state={state} title="Name nicht gespeichert" />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="customer-name">Anzeigename</FieldLabel>
          <Input id="customer-name" name="name" defaultValue={name} required />
        </Field>
      </FieldGroup>
      <Button type="submit" variant="outline" disabled={pending} className="w-full sm:w-fit">
        {pending ? <Spinner data-icon="inline-start" aria-label="Bitte warten" /> : null}
        Name speichern
      </Button>
    </form>
  )
}

export function AddProvidersForm({
  setupId,
  customerId,
  excludeIds,
}: {
  setupId: string
  customerId: string
  excludeIds: string[]
}) {
  const [state, action, pending] = useActionState(addProvidersAction, initial)
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="setupId" value={setupId} />
      <input type="hidden" name="customerId" value={customerId} />
      <FormAlert state={state} title="Anbieter nicht hinzugefügt" />
      <ProviderChecks
        prefix={`add-${setupId}`}
        excludeIds={excludeIds}
        legend="Weitere Anbieter"
        description="Dieselben Schritte, derselbe Link. Schon gewählte Anbieter bleiben."
      />
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? <Spinner data-icon="inline-start" aria-label="Bitte warten" /> : null}
        Zur Einrichtung hinzufügen
      </Button>
    </form>
  )
}

export function AnotherSetupForm({ customerId }: { customerId: string }) {
  const [state, action, pending] = useActionState(anotherSetupAction, initial)
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="customerId" value={customerId} />
      <FormAlert state={state} title="Einrichtung nicht angelegt" />
      <ProviderChecks
        prefix={`neu-${customerId}`}
        legend="Anbieter"
        description="Ein zweiter Link, zum Beispiel für ein späteres Projekt. Die Kundin oder der Kunde öffnet ihn getrennt."
      />
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? <Spinner data-icon="inline-start" aria-label="Bitte warten" /> : null}
        Weitere Einrichtung anlegen
      </Button>
    </form>
  )
}

export function AcceptInvitationForm({
  setupId,
  customerId,
  providerId,
  stepId,
}: {
  setupId: string
  customerId: string
  providerId: string
  stepId: string
}) {
  const [state, action, pending] = useActionState(acceptInvitationAction, initial)
  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="setupId" value={setupId} />
      <input type="hidden" name="customerId" value={customerId} />
      <input type="hidden" name="providerId" value={providerId} />
      <input type="hidden" name="stepId" value={stepId} />
      <FormAlert state={state} title="Nicht gespeichert" />
      <Button type="submit" size="sm" disabled={pending} className="w-full sm:w-fit">
        {pending ? <Spinner data-icon="inline-start" aria-label="Bitte warten" /> : null}
        Einladung in meinem Postfach angenommen
      </Button>
    </form>
  )
}

export function InviteMemberForm() {
  const [state, action, pending] = useActionState(inviteMemberAction, initial)
  return (
    <form action={action} className="flex flex-col gap-3">
      <FormAlert state={state} title="Einladung nicht angelegt" />
      <Field>
        <FieldLabel htmlFor="invite-email">E-Mail</FieldLabel>
        <Input id="invite-email" name="email" type="email" autoComplete="email" required />
        <FieldDescription>
          Die Person setzt selbst Name und Passwort. Eine E-Mail verschickt diese App nicht.
        </FieldDescription>
      </Field>
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? <Spinner data-icon="inline-start" aria-label="Bitte warten" /> : null}
        Einladungslink erzeugen
      </Button>
    </form>
  )
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, initial)
  return (
    <form action={action} className="flex flex-col gap-3">
      <FormAlert state={state} title="Passwort nicht geändert" />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="currentPassword">Aktuelles Passwort</FieldLabel>
          <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="nextPassword">Neues Passwort</FieldLabel>
          <Input id="nextPassword" name="nextPassword" type="password" autoComplete="new-password" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="passwordAgain">Neues Passwort wiederholen</FieldLabel>
          <Input id="passwordAgain" name="passwordAgain" type="password" autoComplete="new-password" required />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? <Spinner data-icon="inline-start" aria-label="Bitte warten" /> : null}
        Passwort ändern
      </Button>
    </form>
  )
}

export function AgencyProfileForm({
  name,
  email,
  logoUrl,
  bannerUrl,
}: {
  name: string
  email: string
  logoUrl: string | null
  bannerUrl: string | null
}) {
  const [state, action, pending] = useActionState(updateAgencyProfileAction, initial)
  return (
    <form action={action} className="flex flex-col gap-3">
      <FormAlert state={state} title="Agentur nicht gespeichert" />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="agency-name">Name</FieldLabel>
          <Input id="agency-name" name="name" defaultValue={name} required />
        </Field>
        <Field>
          <FieldLabel htmlFor="agency-email">Einladungsadresse</FieldLabel>
          <Input id="agency-email" name="email" type="email" defaultValue={email} required />
          <FieldDescription>
            Diese Adresse tragen Kundinnen und Kunden bei den Anbietern ein. Sie kann von Ihrer Anmelde-E-Mail abweichen.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="agency-logo">Logo</FieldLabel>
          {logoUrl ? (
            // Blob-URLs liegen außerhalb des Bild-Optimierers.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="size-12 object-contain" />
          ) : null}
          <Input id="agency-logo" name="logo" type="file" accept="image/png,image/jpeg,image/webp,image/gif" />
          <FieldDescription>
            Erscheint auf dem Kundenlink. PNG, JPEG, WebP oder GIF, höchstens 2 MB. Die Seite bleibt schwarz und weiß.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="agency-banner">Banner</FieldLabel>
          {bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bannerUrl} alt="" className="h-24 w-full object-cover" />
          ) : null}
          <Input id="agency-banner" name="banner" type="file" accept="image/png,image/jpeg,image/webp,image/gif" />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? <Spinner data-icon="inline-start" aria-label="Bitte warten" /> : null}
        Agentur speichern
      </Button>
    </form>
  )
}
