import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

export default function CustomerNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl px-4 py-8">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Kunde nicht gefunden</EmptyTitle>
          <EmptyDescription>
            Dieser Kunde gehört nicht zu Ihrer Agentur oder der Link ist veraltet.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button render={<Link href="/uebersicht" />}>Zur Übersicht</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
