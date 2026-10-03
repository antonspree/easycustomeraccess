import assert from "node:assert/strict"
import test from "node:test"
import { ratePassword } from "./password-strength.ts"

test("kurze und übliche Passwörter gelten nicht", () => {
  assert.equal(ratePassword("").accepted, false)
  assert.equal(ratePassword("geheim1234").accepted, false)
  assert.equal(ratePassword("passwort123").accepted, false)
  assert.equal(ratePassword("aaaaaaaaaaaa").accepted, false)
  assert.equal(ratePassword("abcdefghijkl").accepted, false)
})

test("Name und E-Mail zählen nicht als Passwort", () => {
  const rated = ratePassword("studio-nord-mail", { email: "studio-nord-mail@example.com", name: "Studio Nord" })
  assert.equal(rated.accepted, false)
  assert.match(rated.hint, /E-Mail/)
})

test("ein Satz ab 12 Zeichen ist ausreichend, ein längerer ist stark", () => {
  const enough = ratePassword("Bergwanderung!")
  assert.equal(enough.accepted, true)
  assert.ok(enough.score >= 2)

  const strong = ratePassword("die konten bleiben bei der kundschaft")
  assert.equal(strong.accepted, true)
  assert.equal(strong.score, 4)
  assert.equal(strong.label, "Stark")
})
