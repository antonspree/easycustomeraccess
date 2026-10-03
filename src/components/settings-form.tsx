"use client"

import { useActionState } from "react"
import { updateAgencyAction, type FormState } from "@/lib/actions"
import { Button } from "@/components/button"
import { FormError, Label, TextInput } from "@/components/field"

const initial: FormState = {}

export function SettingsForm({ name }: { name: string }) {
  const [state, action, pending] = useActionState(updateAgencyAction, initial)
  return (
    <form action={action} className="flex w-full max-w-[300px] flex-col gap-4">
      <FormError>{state.error}</FormError>
      <div>
        <Label htmlFor="agency-name">Name</Label>
        <TextInput id="agency-name" name="name" defaultValue={name} required />
      </div>
      <Button type="submit" disabled={pending} className="self-start">
        Speichern
      </Button>
    </form>
  )
}
