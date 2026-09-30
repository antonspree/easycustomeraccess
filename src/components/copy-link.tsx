"use client"

import { CopyIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function CopyLink({ url }: { url: string }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <p className="min-w-0 flex-1 truncate rounded-lg border bg-muted px-3 py-2 text-sm">
        {url}
      </p>
      <Button
        type="button"
        variant="outline"
        className="w-full sm:w-auto"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url)
            toast.success("Link kopiert")
          } catch {
            toast.error("Der Link ließ sich nicht kopieren. Bitte markieren Sie ihn von Hand.")
          }
        }}
      >
        <CopyIcon data-icon="inline-start" />
        Link kopieren
      </Button>
    </div>
  )
}
