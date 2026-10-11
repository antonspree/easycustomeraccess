import type { ProviderDefinition } from "../types.ts"
import { cloudflare } from "./cloudflare.ts"
import { github } from "./github.ts"
import { googleAnalytics } from "./google-analytics.ts"
import { googleSearchConsole } from "./google-search-console.ts"
import { ionos } from "./ionos.ts"
import { netlify } from "./netlify.ts"
import { plausible } from "./plausible.ts"
import { resend } from "./resend.ts"
import { sanity } from "./sanity.ts"
import { stripe } from "./stripe.ts"
import { supabase } from "./supabase.ts"
import { vercel } from "./vercel.ts"

export const providers: ProviderDefinition[] = [
  supabase,
  vercel,
  netlify,
  cloudflare,
  github,
  googleAnalytics,
  googleSearchConsole,
  stripe,
  resend,
  sanity,
  ionos,
  plausible,
]

export function getProvider(id: string) {
  return providers.find((provider) => provider.id === id) ?? null
}
