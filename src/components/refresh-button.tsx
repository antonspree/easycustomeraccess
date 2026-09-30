"use client"

import { RefreshCwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RefreshButton() {
  return (
    <Button type="button" variant="outline" size="sm" onClick={() => window.location.reload()}>
      <RefreshCwIcon data-icon="inline-start" />
      Stand aktualisieren
    </Button>
  )
}
