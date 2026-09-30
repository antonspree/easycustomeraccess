import { listCategories, providers } from "@/lib/providers/catalog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"

export function ProviderChecks({
  prefix,
  excludeIds = [],
  legend,
  description,
}: {
  prefix: string
  excludeIds?: string[]
  legend: string
  description: string
}) {
  const excluded = new Set(excludeIds)
  const visible = providers.filter((provider) => !excluded.has(provider.id))
  const categories = listCategories().filter((category) =>
    visible.some((provider) => provider.category === category),
  )

  if (visible.length === 0) {
    return <p className="text-sm text-muted-foreground">Alle Katalog-Anbieter sind schon in dieser Einrichtung.</p>
  }

  return (
    <FieldSet>
      <FieldLegend>{legend}</FieldLegend>
      <FieldDescription>{description}</FieldDescription>
      <div className="flex flex-col gap-6">
        {categories.map((category) => (
          <FieldGroup key={category} className="gap-3">
            <p className="text-sm font-medium">{category}</p>
            {visible
              .filter((provider) => provider.category === category)
              .map((provider) => (
                <Field key={provider.id} orientation="horizontal">
                  <input
                    id={`${prefix}-provider-${provider.id}`}
                    name="providerId"
                    value={provider.id}
                    type="checkbox"
                    className="mt-0.5 size-4 shrink-0 rounded-[4px] border border-input accent-primary"
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={`${prefix}-provider-${provider.id}`}>
                      {provider.name}
                    </FieldLabel>
                    <FieldDescription>{provider.summary}</FieldDescription>
                  </FieldContent>
                </Field>
              ))}
          </FieldGroup>
        ))}
      </div>
    </FieldSet>
  )
}
