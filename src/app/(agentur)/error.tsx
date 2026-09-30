"use client"

import { RouteError } from "@/components/route-error"

export default function AgencyError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <RouteError
      error={error}
      retry={retry}
      title="Die Übersicht der Agentur konnte nicht geladen werden"
    />
  )
}
