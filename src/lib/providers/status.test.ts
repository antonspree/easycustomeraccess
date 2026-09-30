import assert from "node:assert/strict"
import test from "node:test"
import { providerStatus } from "./status-rules.ts"

test("offen, bevor der Link geöffnet wurde", () => {
  assert.equal(
    providerStatus({ opened: false, confirmedCount: 0, totalSteps: 4 }),
    "offen",
  )
})

test("wartet, sobald der Link offen ist", () => {
  assert.equal(
    providerStatus({ opened: true, confirmedCount: 0, totalSteps: 4 }),
    "wartet",
  )
})

test("wartet bei einem angefangenen Anbieter", () => {
  assert.equal(
    providerStatus({ opened: true, confirmedCount: 1, totalSteps: 4 }),
    "wartet",
  )
})

test("fertig, wenn alle Schritte bestätigt sind", () => {
  assert.equal(
    providerStatus({ opened: true, confirmedCount: 4, totalSteps: 4 }),
    "fertig",
  )
})
