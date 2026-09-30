import type { ProviderStatus } from "@/lib/providers/types"

export function providerStatus(input: {
  opened: boolean
  confirmedCount: number
  totalSteps: number
}): ProviderStatus {
  if (input.totalSteps > 0 && input.confirmedCount >= input.totalSteps) {
    return "fertig"
  }
  if (!input.opened && input.confirmedCount === 0) {
    return "offen"
  }
  return "wartet"
}
