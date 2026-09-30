import { existsSync } from "node:fs"
import path from "node:path"

export function stepGuidePath(providerId: string, stepId: string) {
  const file = path.join(process.cwd(), "public", "guides", providerId, `${stepId}.gif`)
  if (!existsSync(file)) return null
  return `/guides/${providerId}/${stepId}.gif`
}
