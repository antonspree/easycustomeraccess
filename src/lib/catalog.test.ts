import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { resolve } from "node:path"
import test from "node:test"
import { allowedPlaceholders, minutesFor, placeholderTokens, providers } from "./catalog.ts"

const publicRoot = resolve(import.meta.dirname, "../../public")
const allowed = new Set(allowedPlaceholders())
const ids = new Set<string>()

test("jeder Anbieter hat eine eindeutige ID und mindestens einen Schritt", () => {
  assert.ok(providers.length >= 12)
  for (const provider of providers) {
    assert.ok(provider.id)
    assert.ok(provider.name)
    assert.ok(provider.summary)
    assert.ok(provider.more)
    assert.ok(provider.steps.length > 0)
    assert.equal(ids.has(provider.id), false, `doppelte Anbieter-ID ${provider.id}`)
    ids.add(provider.id)
  }
})

test("jeder Schritt hat Text, gültige Platzhalter und vorhandene Bilder", () => {
  for (const provider of providers) {
    const stepIds = new Set<string>()
    for (const step of provider.steps) {
      assert.ok(step.id, `${provider.id}: Schritt ohne ID`)
      assert.equal(stepIds.has(step.id), false, `${provider.id}: doppelte Schritt-ID ${step.id}`)
      stepIds.add(step.id)
      assert.ok(step.sentence.trim(), `${provider.id}/${step.id}: sentence fehlt`)
      assert.ok(step.title.trim(), `${provider.id}/${step.id}: title fehlt`)
      assert.ok(step.intro.trim(), `${provider.id}/${step.id}: intro fehlt`)
      assert.ok(step.doneWhen.trim(), `${provider.id}/${step.id}: doneWhen fehlt`)
      assert.ok(step.minutes > 0, `${provider.id}/${step.id}: minutes`)
      assert.ok(step.substeps.length >= 2, `${provider.id}/${step.id}: zu wenige Unterschritte`)
      for (const line of step.substeps) assert.ok(line.trim())

      const texts = [
        step.sentence,
        step.title,
        step.intro,
        step.doneWhen,
        step.urlLabel ?? "",
        step.help ?? "",
        ...(step.substeps ?? []),
        ...(step.tips ?? []),
        ...(step.pitfalls ?? []),
        step.image?.alt ?? "",
        step.image?.caption ?? "",
      ]
      for (const text of texts) {
        for (const token of placeholderTokens(text)) {
          assert.ok(allowed.has(token as "{email}"), `${provider.id}/${step.id}: unbekannter Platzhalter ${token}`)
        }
      }

      if (step.url) {
        assert.match(step.url, /^https:\/\//, `${provider.id}/${step.id}: URL muss https sein`)
        assert.ok(step.urlLabel?.trim(), `${provider.id}/${step.id}: urlLabel fehlt`)
      }

      assert.ok(step.image, `${provider.id}/${step.id}: Bild fehlt`)
      assert.ok(step.image.src.startsWith("/guides/"), `${provider.id}/${step.id}: Bildpfad`)
      assert.ok(existsSync(resolve(publicRoot, step.image.src.slice(1))), `${provider.id}/${step.id}: Datei fehlt ${step.image.src}`)
      assert.ok(step.image.alt.trim())
      assert.ok(step.image.kind === "screenshot" || step.image.kind === "schematic")
    }
  }
})

test("die Zeitschätzung bleibt positiv", () => {
  assert.ok(minutesFor(providers) >= 30)
})
