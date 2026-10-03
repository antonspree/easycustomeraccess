"use client"

import { useActionState, useState } from "react"
import { loginAction, registerAction, type FormState } from "@/lib/actions"
import { Button } from "@/components/button"
import { FormError, Label, TextInput } from "@/components/field"
import { ratePassword } from "@/lib/password-strength"

const initial: FormState = {}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initial)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const rating = ratePassword(password, { email, name })

  return (
    <form action={action} className="flex w-full max-w-[320px] flex-col gap-4">
      <FormError>{state.error}</FormError>
      <div>
        <Label htmlFor="name">Name der Agentur</Label>
        <TextInput
          id="name"
          name="name"
          autoComplete="organization"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="email">E-Mail</Label>
        <TextInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="password">Passwort</Label>
        <TextInput
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          maxLength={128}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-describedby="password-strength"
        />
        <div
          id="password-strength"
          className="mt-[6px]"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={rating.score}
          aria-valuetext={rating.label}
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-1 gap-1">
              {[0, 1, 2, 3].map((step) => (
                <span
                  key={step}
                  className={step < rating.score ? "h-1 flex-1 rounded-full bg-[#151515]" : "h-1 flex-1 rounded-full bg-[var(--fill-08)]"}
                />
              ))}
            </div>
            <span className="text-[14px] leading-[1.5] text-[var(--text-64)]">{rating.label}</span>
          </div>
          <p className="mt-[6px] text-[14px] leading-[1.5] text-[var(--text-36)]">{rating.hint}</p>
        </div>
      </div>
      <Button type="submit" disabled={pending || !rating.accepted}>
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
