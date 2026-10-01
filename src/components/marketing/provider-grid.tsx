import { providers } from "@/lib/providers/catalog"

export function ProviderGrid() {
  return (
    <ul className="grid grid-cols-1 gap-x-16 sm:grid-cols-2 lg:grid-cols-3">
      {providers.map((provider) => (
        <li key={provider.id} className="flex flex-col gap-2 border-t py-6">
          <h3 className="font-medium">{provider.name}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{provider.summary}</p>
          <p className="text-sm">{provider.category}</p>
        </li>
      ))}
    </ul>
  )
}
