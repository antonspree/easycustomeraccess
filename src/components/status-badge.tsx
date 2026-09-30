import { Badge } from "@/components/ui/badge"
import { STATUS_LABEL, type ProviderStatus } from "@/lib/providers/types"

const variant: Record<ProviderStatus, "outline" | "secondary" | "default"> = {
  offen: "outline",
  wartet: "secondary",
  fertig: "default",
}

export function StatusBadge({ status }: { status: ProviderStatus }) {
  return <Badge variant={variant[status]}>{STATUS_LABEL[status]}</Badge>
}
