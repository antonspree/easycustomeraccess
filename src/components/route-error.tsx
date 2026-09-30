"use client"

import { useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function RouteError({
  error,
  retry,
  title,
}: {
  error: Error & { digest?: string }
  retry: () => void
  title: string
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8">
      <Alert variant="destructive">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          Die Seite konnte nicht geladen werden. Bereits bestätigte Schritte bleiben gespeichert.
        </AlertDescription>
      </Alert>
      <Button type="button" variant="outline" className="w-fit" onClick={() => retry()}>
        Erneut versuchen
      </Button>
    </div>
  )
}
