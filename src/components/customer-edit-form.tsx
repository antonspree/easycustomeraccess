"use client"

import { useActionState, useRef, useState } from "react"
import { deleteCustomerAction, type FormState, updateCustomerAction } from "@/lib/actions"
import { Button } from "@/components/button"
import { FormError, Label, TextInput } from "@/components/field"
import { ProviderPicker } from "@/components/provider-picker"

type Props = {
  customerId: string
  name: string
  email: string
  providerIds: string[]
}

const initial: FormState = {}

export function CustomerEditForm({ customerId, name, email, providerIds }: Props) {
  const [state, action, pending] = useActionState(updateCustomerAction.bind(null, customerId), initial)
  const [showDelete, setShowDelete] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <form action={action} className="flex flex-col gap-8">
        <FormError>{state.error}</FormError>
        <div className="flex max-w-[320px] flex-col gap-4">
          <div>
            <Label htmlFor="customer-name">Name</Label>
            <TextInput id="customer-name" name="name" defaultValue={name} autoComplete="name" required />
          </div>
          <div>
            <Label htmlFor="customer-email">E-Mail</Label>
            <TextInput
              id="customer-email"
              name="email"
              type="email"
              defaultValue={email}
              autoComplete="email"
              required
            />
          </div>
        </div>
        <ProviderPicker defaultSelected={providerIds} />
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={pending}>
            Speichern
          </Button>
          <Button
            type="button"
            quiet
            onClick={() => {
              setShowDelete(true)
              dialogRef.current?.showModal()
            }}
          >
            Kunde löschen
          </Button>
        </div>
      </form>

      <dialog
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close()
        }}
        className="rounded-[24px] border border-[var(--divider)] bg-white p-6 backdrop:bg-[rgba(0,0,0,0.2)]"
      >
        <div className="flex flex-col gap-5">
          <h3 className="text-[20px] font-semibold leading-[1.2]">Kunde wirklich löschen?</h3>
          <p className="text-[16px] leading-[1.5] text-[var(--text-64)]">
            Der Kunde und alle Daten (Setup, Anbieter, Bestätigungen) werden gelöscht. Der geheime Link funktioniert
            danach nicht mehr. Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          <div className="flex items-center gap-3">
            <form
              action={async () => {
                await deleteCustomerAction(customerId)
              }}
            >
              <Button type="submit">Ja, löschen</Button>
            </form>
            <Button
              type="button"
              quiet
              onClick={() => {
                dialogRef.current?.close()
                setShowDelete(false)
              }}
            >
              Abbrechen
            </Button>
          </div>
        </div>
      </dialog>
    </>
  )
}
