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

export function ProblemStats() {
  return (
    <dl className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((item) => (
        <div key={item.name} className="flex flex-col gap-2">
          <dt className="text-sm text-muted-foreground">{item.name}</dt>
          <dd className="font-heading text-4xl">{item.stat}</dd>
          <dd className="text-sm text-muted-foreground">{item.change}</dd>
        </div>
      ))}
    </dl>
  )
}
