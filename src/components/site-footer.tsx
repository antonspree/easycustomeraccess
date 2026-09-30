import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-4 text-sm text-muted-foreground">
        <p>EasyCustomerAccess führt durch Einrichtungen und speichert Bestätigungen lokal.</p>
        <Link href="/datenschutz" className="underline-offset-4 hover:underline">
          Datenschutz
        </Link>
      </div>
    </footer>
  )
}
