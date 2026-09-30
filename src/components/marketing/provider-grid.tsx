import {
  ArrowUpRightIcon,
  ChartLineIcon,
  CloudIcon,
  CreditCardIcon,
  DatabaseIcon,
  FileTextIcon,
  GitBranchIcon,
  GlobeIcon,
  MailIcon,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { providers } from "@/lib/providers/catalog"
import { cn } from "@/lib/utils"

const icons: Record<string, typeof DatabaseIcon> = {
  Backend: DatabaseIcon,
  Hosting: CloudIcon,
  Code: GitBranchIcon,
  Analyse: ChartLineIcon,
  Abrechnung: CreditCardIcon,
  Versand: MailIcon,
  Inhalt: FileTextIcon,
  Domain: GlobeIcon,
}

/** Katalograster aus blocks.so grid-list-03, nur Schwarz und Violett. */
export function ProviderGrid() {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 lg:grid-cols-3">
      {providers.map((provider) => {
        const Icon = icons[provider.category] ?? DatabaseIcon
        return (
          <Card
            className="group relative rounded-none border-0 bg-card py-0 shadow-none"
            key={provider.id}
          >
            <CardContent className="flex flex-col gap-4 p-6">
              <span
                className={cn(
                  "inline-flex w-fit rounded-lg bg-secondary p-3 text-primary ring-2 ring-primary/30 ring-inset",
                )}
              >
                <Icon aria-hidden className="size-6" />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-balance text-foreground">
                  {provider.name}
                </h3>
                <p className="text-sm text-pretty text-foreground/75">{provider.summary}</p>
                <p className="text-sm font-medium text-primary">{provider.category}</p>
              </div>
              <span aria-hidden className="pointer-events-none absolute top-6 right-6 text-primary">
                <ArrowUpRightIcon className="size-6" />
              </span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
