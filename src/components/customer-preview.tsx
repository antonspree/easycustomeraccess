import { fill, getProvider } from "@/lib/catalog"

export function CustomerPreview({
  providerIds,
  vars,
}: {
  providerIds: string[]
  vars: { email: string; agency: string; agencyEmail: string }
}) {
  return (
    <div className="mt-8 border-t border-[var(--divider)] pt-8">
      <h2 className="text-[20px] font-semibold leading-[1.2]">Was die Kundschaft sieht</h2>
      <p className="mt-5 text-[16px] leading-[1.5] text-[#757575]">
        Dieselben Schritte, dieselbe Reihenfolge. Die Person bestätigt einen Schritt nach dem anderen. Jeder Schritt
        hat eine ausführliche Anleitung mit Hinweisen und Stolperstellen.
      </p>
      <ol className="mt-5 flex flex-col gap-3">
        {providerIds.map((id) => {
          const provider = getProvider(id)
          if (!provider) return null
          return (
            <li key={provider.id} className="rounded-[16px] border border-[var(--divider)] bg-white px-4 py-3">
              <p className="text-[16px] font-medium leading-[1.4]">{provider.name}</p>
              <p className="mt-1 text-[14px] leading-[1.45] text-[var(--text-64)]">{provider.summary}</p>
              <ol className="mt-3 flex list-decimal flex-col gap-1 pl-5 text-[14px] leading-[1.45] text-[var(--text-64)]">
                {provider.steps.map((step) => (
                  <li key={step.id}>{fill(step.title, vars)}</li>
                ))}
              </ol>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
