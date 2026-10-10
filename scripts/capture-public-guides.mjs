import { mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import puppeteer from "puppeteer-core"

const root = join(import.meta.dirname, "..", "public", "guides")

const pages = [
  ["supabase/konto.png", "https://supabase.com/dashboard/sign-up"],
  ["vercel/konto.png", "https://vercel.com/signup"],
  ["netlify/konto.png", "https://app.netlify.com/signup"],
  ["cloudflare/konto.png", "https://dash.cloudflare.com/sign-up"],
  ["github/konto.png", "https://github.com/signup"],
  ["stripe/konto.png", "https://dashboard.stripe.com/register"],
  ["resend/konto.png", "https://resend.com/signup"],
  ["sanity/konto.png", "https://www.sanity.io/get-started"],
  ["ionos/konto.png", "https://login.ionos.de/"],
  ["plausible/konto.png", "https://plausible.io/register"],
  ["google-analytics/google.png", "https://accounts.google.com/lifecycle/steps/signup/name?dsh=1"],
  ["google-search-console/konto.png", "https://search.google.com/search-console"],
]

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--hide-scrollbars",
    "--font-render-hinting=none",
    "--enable-unsafe-swiftshader",
  ],
  defaultViewport: { width: 1280, height: 840, deviceScaleFactor: 1 },
})

try {
  for (const [rel, url] of pages) {
    const file = join(root, rel)
    mkdirSync(dirname(file), { recursive: true })
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(25000)
    try {
      await page.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
      )
      await page.goto(url, { waitUntil: "domcontentloaded" })
      await page.evaluate(() => document.fonts?.ready)
      await new Promise((resolve) => setTimeout(resolve, 2500))
      await page.screenshot({ path: file, type: "png" })
      console.log("ok", rel)
    } catch (error) {
      console.error("fail", rel, error instanceof Error ? error.message : error)
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}
