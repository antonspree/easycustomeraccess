"use client"

import { useMemo, useRef, useState } from "react"
import { providers } from "@/lib/catalog"

export function ProviderPicker({ defaultSelected }: { defaultSelected?: string[] } = {}) {
  const [query, setQuery] = useState("")
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [info, setInfo] = useState<(typeof providers)[number] | null>(null)
  const needle = query.trim().toLowerCase()
  const matches = useMemo(
    () =>
      providers.filter((provider) => {
        if (!needle) return true
        return (
          provider.name.toLowerCase().includes(needle) ||
          provider.summary.toLowerCase().includes(needle)
        )
      }),
    [needle],
  )

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[20px] font-semibold leading-[1.2]">Anbieter</h2>
        <p className="mt-5 text-[16px] leading-[1.5] text-[#757575]">
          Ein Link für alle gewählten Anbieter. Die Kundschaft legt die Konten selbst an.
        </p>
      </div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Anbieter suchen"
        aria-label="Anbieter suchen"
        className="h-[38px] w-full rounded-[8px] border border-[var(--border)] bg-white px-[14px] text-[16px] outline-none placeholder:text-[var(--text-32)] focus:border-[rgba(21,21,21,0.24)] focus:shadow-[0_0_0_3px_rgba(21,21,21,0.04)]"
      />
      {matches.length === 0 ? (
        <p className="text-[14px] leading-[1.5] text-[var(--text-64)]">Kein Anbieter passt zu dieser Suche.</p>
      ) : null}
      <ul className="rounded-[24px] border border-[var(--divider)] bg-[var(--surface-glass)] px-4">
        {providers.map((provider) => {
          const shown = matches.some((item) => item.id === provider.id)
          return (
            <li
              key={provider.id}
              className={shown ? "flex items-start gap-3 border-b border-[var(--divider)] py-3 last:border-b-0" : "hidden"}
            >
              <input
                id={`provider-${provider.id}`}
                name="providerId"
                value={provider.id}
                type="checkbox"
                defaultChecked={defaultSelected?.includes(provider.id)}
                className="mt-1 size-4 shrink-0 accent-[#353535]"
              />
              <div className="min-w-0 flex-1">
                <label htmlFor={`provider-${provider.id}`} className="text-[16px] font-medium leading-[1.5]">
                  {provider.name}
                </label>
                <p className="text-[14px] font-normal leading-[1.5] text-[var(--text-64)]">{provider.summary}</p>
              </div>
              <button
                type="button"
                aria-label={`Mehr über ${provider.name}`}
                className="rounded-[16px] px-[5px] text-[14px] leading-none text-[var(--text-36)] transition-colors duration-150 hover:text-[var(--text)]"
                onClick={() => {
                  setInfo(provider)
                  dialogRef.current?.showModal()
                }}
              >
                i
              </button>
            </li>
          )
        })}
      </ul>
      <dialog
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close()
        }}
      >
        <div className="flex flex-col gap-3">
          <h3 className="text-[16px] font-medium leading-[1.5]">{info?.name}</h3>
          <p className="text-[14px] font-normal leading-[1.5] text-[var(--text-64)]">{info?.more}</p>
          <button
            type="button"
            className="self-start text-[14px] font-medium leading-[1.5] text-[var(--text-64)]"
            onClick={() => dialogRef.current?.close()}
          >
            Schließen
          </button>
        </div>
      </dialog>
    </div>
  )
}
