"use client"

import { RouteError } from "@/components/route-error"

export default function SetupError({
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
      title="Die Einrichtung konnte nicht geladen werden"
    />
  )
}
