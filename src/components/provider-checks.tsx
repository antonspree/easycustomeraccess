"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { providers, stepGrantsAccess } from "@/lib/providers/catalog"
import type { ProviderDefinition } from "@/lib/providers/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FieldDescription,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"

function plain(text: string) {
  return text
    .replaceAll("{customerEmail}", "die E-Mail der Kundschaft")
    .replaceAll("{agencyEmail}", "die Einladungsadresse der Agentur")
    .replaceAll("{customerName}", "der Name der Kundschaft")
    .replaceAll("{agencyName}", "die Agentur")
}

function ProviderMark({ id }: { id: string }) {
  return (
    <Image
      src={`/logos/${id}.svg`}
      alt=""
      width={32}
      height={32}
      unoptimized
      className="size-8 shrink-0"
    />
  )
}

export function ProviderChecks({
  prefix,
  excludeIds = [],
  legend,
  description,
}: {
  prefix?: string
  excludeIds?: string[]
  legend: string
  description: string
}) {
  const [query, setQuery] = useState("")
  const excluded = useMemo(() => new Set(excludeIds), [excludeIds])
  const visible = providers.filter((provider) => !excluded.has(provider.id))
  const needle = query.trim().toLowerCase()

  if (visible.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Alle Katalog-Anbieter sind schon in dieser Einrichtung.
      </p>
    )
  }

  const matches = visible.filter((provider) => {
    if (!needle) return true
    return (
      provider.name.toLowerCase().includes(needle) ||
      provider.summary.toLowerCase().includes(needle) ||
      provider.category.toLowerCase().includes(needle)
    )
  })

  return (
    <FieldSet>
      <FieldLegend>{legend}</FieldLegend>
      <FieldDescription>{description}</FieldDescription>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Anbieter suchen"
        aria-label="Anbieter suchen"
        className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
      />
      {matches.length === 0 ? (
        <p className="text-sm text-muted-foreground">Kein Anbieter passt zu dieser Suche.</p>
      ) : null}
      <ul>
        {visible.map((provider) => {
          const id = prefix ? `${prefix}-provider-${provider.id}` : `provider-${provider.id}`
          const shown = matches.some((item) => item.id === provider.id)
          return (
            <li
              key={provider.id}
              className={cn(
                "flex items-center gap-3 border-b px-3 py-3 last:border-b-0",
                !shown && "hidden",
              )}
            >
              <input
                id={id}
                name="providerId"
                value={provider.id}
                type="checkbox"
                className="size-4 shrink-0 accent-primary"
              />
              <ProviderMark id={provider.id} />
              <div className="min-w-0 flex-1">
                <label htmlFor={id} className="font-medium">
                  {provider.name}
                </label>
                <p className="text-sm text-muted-foreground">{provider.summary}</p>
              </div>
              <ProviderInfo provider={provider} />
            </li>
          )
        })}
      </ul>
    </FieldSet>
  )
}

function ProviderInfo({ provider }: { provider: ProviderDefinition }) {
  const access = provider.steps.find((step) => stepGrantsAccess(step))
  return (
    <Dialog>
      <DialogTrigger
        className="px-1 text-sm underline-offset-4 hover:underline"
        aria-label={`Mehr über ${provider.name}`}
      >
        i
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-3 pr-8">
            <ProviderMark id={provider.id} />
            <DialogTitle>{provider.name}</DialogTitle>
          </div>
          <DialogDescription>{provider.category}</DialogDescription>
        </DialogHeader>
        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
          <section className="flex flex-col gap-1">
            <h3 className="font-medium">Wofür die Agentur den Anbieter braucht</h3>
            <p>{plain(provider.summary)}</p>
          </section>
          <section className="flex flex-col gap-2">
            <h3 className="font-medium">Was die Kundin oder der Kunde tut</h3>
            <ol className="flex list-decimal flex-col gap-1 pl-5">
              {provider.steps.map((step) => (
                <li key={step.id}>{plain(step.title)}</li>
              ))}
            </ol>
            <p className="text-sm text-muted-foreground">
              Die Person erledigt das selbst bei {provider.name}. EasyCustomerAccess legt dabei kein Konto an.
            </p>
          </section>
          <section className="flex flex-col gap-1">
            <h3 className="font-medium">Welche Rolle die Agentur bekommt</h3>
            <p>{access ? plain(access.agencyRole) : "In diesem Ablauf bekommt die Agentur keine eigene Rolle."}</p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
