# EasyCustomerAccess

EasyCustomerAccess ist für Web- und Media-Agenturen. Eine Agentur richtet Konten bei Drittanbietern so ein, dass sie auf den Namen und die E-Mail der Kundschaft laufen, auch in kostenlosen Tarifen. Die Kundin oder der Kunde bestätigt die Schritte über einen geheimen Link. Die Agentur wird als Mitglied eingeladen und sieht den Stand.

Diese Version legt keine Konten, Organisationen oder Projekte über eine Anbieter-API an. Sie führt durch die Schritte und speichert die Bestätigung. Neue Anbieter kommen als Eintrag in den Katalog, nicht als eigene App. Ein späterer API-Adapter kann pro Anbieter nach der Zustimmung ergänzt werden, ohne die Oberfläche neu zu bauen.

## Lokal starten

Voraussetzungen: Node.js 22.

```bash
npm install
npm run dev
```

Die App läuft unter [http://127.0.0.1:43127](http://127.0.0.1:43127).

Daten liegen in `data/eca.sqlite` (lokal, ohne API-Schlüssel). Der Ordner ist nicht Teil des Repos. Agenturen melden sich mit E-Mail und Passwort an. Es gibt keinen externen Anmeldedienst.

```bash
npm test
npm run lint
```

## Ablauf

1. Agentur registrieren und anmelden.
2. Kunden anlegen und Anbieter aus dem Katalog wählen.
3. Den einen Link der Einrichtung öffnen.
4. Schritte nacheinander mit der eigenen E-Mail bestätigen.
5. In der Übersicht den Stand je Anbieter sehen: offen, wartet auf den Kunden, fertig.

Enthalten sind Supabase, Vercel, Netlify, Cloudflare, GitHub, Google Analytics, Google Search Console, Stripe, Resend, Sanity, IONOS und Plausible.
