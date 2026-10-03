"use client"

import { useState } from "react"
import { quietClass } from "@/components/button"

export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <p className="min-w-0 flex-1 truncate text-[16px] leading-[1.5]">{url}</p>
      <button
        type="button"
        className={quietClass}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
          } catch {
            setCopied(false)
          }
        }}
      >
        {copied ? "Kopiert" : "Kopieren"}
      </button>
    </div>
  )
}
