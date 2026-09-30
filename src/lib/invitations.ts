import { getProvider, stepGrantsAccess } from "@/lib/providers/catalog"

export type InviteLine = {
  providerId: string
  providerName: string
  stepId: string
  state: "offen" | "angenommen"
  acceptedAt?: string
  memberName?: string
}

export function inviteLines(input: {
  providers: { providerId: string; confirmations: { stepId: string }[] }[]
  invitations: {
    providerId: string
    stepId: string
    acceptedAt: string
    memberName: string
  }[]
}): InviteLine[] {
  const accepted = new Map(
    input.invitations.map((item) => [`${item.providerId}:${item.stepId}`, item]),
  )
  const lines: InviteLine[] = []
  for (const provider of input.providers) {
    const definition = getProvider(provider.providerId)
    if (!definition) continue
    for (const step of definition.steps) {
      if (!stepGrantsAccess(step)) continue
      if (!provider.confirmations.some((item) => item.stepId === step.id)) continue
      const hit = accepted.get(`${provider.providerId}:${step.id}`)
      lines.push({
        providerId: provider.providerId,
        providerName: definition.name,
        stepId: step.id,
        state: hit ? "angenommen" : "offen",
        acceptedAt: hit?.acceptedAt,
        memberName: hit?.memberName,
      })
    }
  }
  return lines
}
