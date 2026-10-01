import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl px-4 py-10">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Seite nicht gefunden</EmptyTitle>
          <EmptyDescription>Diese Adresse gibt es in EasyCustomerAccess nicht.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button render={<Link href="/" />}>Zur Startseite</Button>
        </EmptyContent>
      </Empty>
    </main>
  )
}
