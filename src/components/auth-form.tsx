"use client"

import { useActionState } from "react"
import { loginAction, registerAction, type FormState } from "@/lib/actions"
import { Button } from "@/components/button"
import { FormError, Label, TextInput } from "@/components/field"

const initial: FormState = {}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initial)
  return (
    <form action={action} className="flex w-full max-w-[320px] flex-col gap-4">
      <FormError>{state.error}</FormError>
      <div>
        <Label htmlFor="name">Name der Agentur</Label>
        <TextInput id="name" name="name" autoComplete="organization" required />
      </div>
      <div>
        <Label htmlFor="email">E-Mail</Label>
        <TextInput id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <Label htmlFor="password">Passwort</Label>
        <TextInput id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      </div>
      <Button type="submit" disabled={pending}>
        Agentur registrieren
      </Button>
    </form>
  )
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial)
  return (
    <form action={action} className="flex w-full max-w-[320px] flex-col gap-4">
      <FormError>{state.error}</FormError>
      <div>
        <Label htmlFor="email">E-Mail</Label>
        <TextInput id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <Label htmlFor="password">Passwort</Label>
        <TextInput id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <Button type="submit" disabled={pending}>
        Anmelden
      </Button>
    </form>
  )
}
