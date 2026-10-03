"use client"

import { useActionState } from "react"
import { createCustomerAction, type FormState } from "@/lib/actions"
import { Button } from "@/components/button"
import { FormError, Label, TextInput } from "@/components/field"
import { ProviderPicker } from "@/components/provider-picker"

const initial: FormState = {}

export function CustomerForm() {
  const [state, action, pending] = useActionState(createCustomerAction, initial)
  return (
    <form action={action} className="flex flex-col gap-8">
      <FormError>{state.error}</FormError>
      <div className="flex max-w-[320px] flex-col gap-4">
        <div>
          <Label htmlFor="customer-name">Name</Label>
          <TextInput id="customer-name" name="name" autoComplete="name" required />
        </div>
        <div>
          <Label htmlFor="customer-email">E-Mail</Label>
          <TextInput id="customer-email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>
      <ProviderPicker />
      <Button type="submit" disabled={pending} className="self-start">
        Kunde anlegen
      </Button>
    </form>
  )
}
