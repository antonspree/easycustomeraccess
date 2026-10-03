import assert from "node:assert/strict"
import test from "node:test"
import { openLabel, progressFor } from "./progress.ts"

const supabase = {
  id: "supabase",
  steps: ["konto", "email", "organisation", "einladung", "projekt", "pruefen"].map((id) => ({
    id,
    sentence: id,
  })),
}
const vercel = {
  id: "vercel",
  steps: ["konto", "email", "team", "einladung"].map((id) => ({ id, sentence: id })),
}
const netlify = {
  id: "netlify",
  steps: ["konto", "email", "einladung"].map((id) => ({ id, sentence: id })),
}

test("ein Anbieter bleibt offen, bis alle Schritte bestätigt sind", () => {
  const start = progressFor([supabase], [])
  assert.equal(start.total, 6)
  assert.equal(start.confirmed, 0)
  assert.equal(start.openProviders, 1)
  assert.equal(start.next?.stepId, "konto")

  const mid = progressFor([supabase], [{ providerId: "supabase", stepId: "konto" }])
  assert.equal(mid.confirmed, 1)
  assert.equal(mid.openProviders, 1)
  assert.equal(mid.next?.stepId, "email")

  const done = progressFor(
    [supabase],
    supabase.steps.map((step) => ({ providerId: "supabase", stepId: step.id })),
  )
  assert.equal(done.openProviders, 0)
  assert.equal(done.next, null)
  assert.equal(openLabel(0), "Keine offenen Anbieter")
})

test("der nächste Schritt springt zum folgenden Anbieter", () => {
  const result = progressFor(
    [vercel, netlify],
    vercel.steps.map((step) => ({ providerId: "vercel", stepId: step.id })),
  )
  assert.equal(result.openProviders, 1)
  assert.equal(result.next?.providerId, "netlify")
  assert.equal(result.next?.stepId, "konto")
})
