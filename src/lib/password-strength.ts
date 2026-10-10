export type PasswordRating = {
  score: 0 | 1 | 2 | 3 | 4
  label: string
  hint: string
  accepted: boolean
}

const labels = ["Offen", "Zu schwach", "Ausreichend", "Gut", "Stark"] as const

const common = new Set([
  "password",
  "passwort",
  "passw0rd",
  "123456",
  "12345678",
  "123456789",
  "1234567890",
  "qwerty",
  "qwertz",
  "asdfgh",
  "letmein",
  "iloveyou",
  "admin",
  "administrator",
  "willkommen",
  "geheim",
  "hallo",
  "sommer",
  "winter",
  "herbst",
  "welcome",
  "monkey",
  "dragon",
  "master",
  "login",
  "abc123",
  "test",
  "testtest",
  "schatz",
  "liebe",
  "fussball",
  "changeme",
  "blokr",
])

const rows = ["abcdefghijklmnopqrstuvwxyz", "qwertzuiopasdfghjklyxcvbnm", "qwertyuiopasdfghjklzxcvbnm", "0123456789"]

function isCommon(value: string) {
  const lower = value.toLowerCase()
  if (common.has(lower)) return true
  const stripped = lower.replace(/[^a-zäöüß]/g, "")
  return stripped.length >= 4 && common.has(stripped)
}

function isSequence(value: string) {
  const lower = value.toLowerCase()
  return rows.some((row) => {
    const reversed = [...row].reverse().join("")
    const longest = Math.min(lower.length, 8)
    if (longest < 6) return row.includes(lower) || reversed.includes(lower)
    for (let size = lower.length; size >= longest; size -= 1) {
      for (let index = 0; index <= lower.length - size; index += 1) {
        const slice = lower.slice(index, index + size)
        if (row.includes(slice) || reversed.includes(slice)) return true
      }
    }
    return false
  })
}

function repeats(value: string) {
  return /^(.)\1+$/.test(value) || /(.)\1{4,}/.test(value)
}

function classes(value: string) {
  return [/[a-zäöü]/, /[A-ZÄÖÜ]/, /\d/, /[^A-Za-zÄÖÜäöüß0-9]/].filter((pattern) => pattern.test(value)).length
}

function containsContext(value: string, context?: { email?: string; name?: string }) {
  const lower = value.toLowerCase()
  const email = context?.email?.trim().toLowerCase() ?? ""
  const local = email.split("@")[0] ?? ""
  const name = context?.name?.trim().toLowerCase() ?? ""
  if (email && lower === email) return true
  if (local.length >= 4 && lower.includes(local)) return true
  if (name.length >= 4 && lower.includes(name)) return true
  return false
}

export function ratePassword(password: string, context?: { email?: string; name?: string }): PasswordRating {
  const value = password ?? ""
  if (!value) {
    return { score: 0, label: labels[0], hint: "Mindestens 12 Zeichen.", accepted: false }
  }
  if (value.length > 128) {
    return { score: 0, label: labels[1], hint: "Höchstens 128 Zeichen.", accepted: false }
  }
  if (value.length < 12) {
    return { score: value.length >= 8 ? 1 : 0, label: labels[1], hint: "Mindestens 12 Zeichen.", accepted: false }
  }
  if (isCommon(value)) {
    return { score: 0, label: labels[1], hint: "Dieses Passwort ist zu üblich.", accepted: false }
  }
  if (containsContext(value, context)) {
    return { score: 0, label: labels[1], hint: "Name und E-Mail gehören nicht ins Passwort.", accepted: false }
  }
  if (repeats(value) || isSequence(value)) {
    return { score: 1, label: labels[1], hint: "Wiederholungen und Reihen sind zu leicht zu erraten.", accepted: false }
  }

  let score: 0 | 1 | 2 | 3 | 4 = 2
  if (value.length >= 16) score = 3
  if (value.length >= 20) score = 4
  if (value.length >= 14 && classes(value) >= 3 && score < 4) score = (score + 1) as 2 | 3 | 4
  if (value.length >= 16 && value.includes(" ")) score = 4

  return {
    score,
    label: labels[score],
    hint: "Erfüllt die Anforderung.",
    accepted: true,
  }
}
