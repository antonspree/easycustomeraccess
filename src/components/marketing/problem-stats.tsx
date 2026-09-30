import { Card, CardContent } from "@/components/ui/card"

const data = [
  {
    name: "Wem das Konto gehört",
    stat: "Kunde",
    change: "nicht der Agentur",
  },
  {
    name: "Kunden-Login in dieser App",
    stat: "Keiner",
    change: "ein geheimer Link",
  },
  {
    name: "Stand je Anbieter",
    stat: "3",
    change: "offen, wartet, fertig",
  },
  {
    name: "Angelegt über eine API",
    stat: "Nichts",
    change: "die Person handelt selbst",
  },
]

/** Layout aus blocks.so stats-03, ohne Grün/Rot. */
export function ProblemStats() {
  return (
    <dl className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((item) => (
        <Card className="py-4 shadow-none" key={item.name}>
          <CardContent className="flex flex-col gap-2">
            <dt className="text-sm font-medium text-foreground">{item.name}</dt>
            <dd className="flex flex-col gap-1">
              <span className="text-3xl font-semibold text-foreground tabular-nums">
                {item.stat}
              </span>
              <span className="text-sm font-medium text-primary">{item.change}</span>
            </dd>
          </CardContent>
        </Card>
      ))}
    </dl>
  )
}
