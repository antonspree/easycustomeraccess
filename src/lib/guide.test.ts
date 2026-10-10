import assert from "node:assert/strict"
import test from "node:test"
import { guideFor } from "./guide.ts"

test("guideFor markiert nur den nächsten offenen Schritt als aktuell", () => {
  const guide = guideFor(
    ["vercel", "netlify"],
    [
      { providerId: "vercel", stepId: "konto" },
      { providerId: "vercel", stepId: "email" },
    ],
  )
  assert.equal(guide.providers.length, 2)
  assert.equal(guide.current?.provider.id, "vercel")
  assert.equal(guide.current?.step.id, "team")
  assert.equal(guide.providers[0]?.doneCount, 2)
  assert.equal(guide.providers[0]?.complete, false)
  assert.equal(guide.providers[1]?.current, false)
})

test("guideFor ist leer, wenn alles bestätigt ist", () => {
  const guide = guideFor(
    ["netlify"],
    [
      { providerId: "netlify", stepId: "konto" },
      { providerId: "netlify", stepId: "email" },
      { providerId: "netlify", stepId: "einladung" },
    ],
  )
  assert.equal(guide.current, null)
  assert.equal(guide.providers[0]?.complete, true)
})
