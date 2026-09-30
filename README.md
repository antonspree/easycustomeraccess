# EasyCustomerAccess

EasyCustomerAccess ist für Web- und Media-Agenturen. Eine Agentur richtet Konten bei Drittanbietern so ein, dass sie auf den Namen und die E-Mail der Kundschaft laufen, auch in kostenlosen Tarifen. Die Kundin oder der Kunde bestätigt die Schritte über einen geheimen Link. Die Agentur wird als Mitglied eingeladen und sieht den Stand.

Diese Version legt keine Konten, Organisationen oder Projekte über eine Anbieter-API an. Sie führt durch die Schritte und speichert die Bestätigung. Neue Anbieter kommen als Eintrag in den Katalog, nicht als eigene App. Ein späterer API-Adapter kann pro Anbieter nach der Zustimmung ergänzt werden, ohne die Oberfläche neu zu bauen. Unter Agentur → Anbindungen steht jeder Anbieter auf „Nur Anleitung“.

Vor einem öffentlichen Betrieb ergänzt der Betreiber Impressum und die verantwortliche Stelle. Die Seite Datenschutz beschreibt nur, was die App wirklich speichert.

## Lokal starten

Voraussetzungen: Node.js 22.

```bash
npm install
npm run dev
```

Die App läuft unter [http://127.0.0.1:43127](http://127.0.0.1:43127).

Ohne `DATABASE_URL` liegen die Daten in `data/eca.sqlite` (lokal, ohne API-Schlüssel). Der Ordner ist nicht Teil des Repos. In der Produktion auf Vercel zeigt `DATABASE_URL` auf Neon Postgres desselben Kontos. Die Verbindungszeichenfolge steht nur in den Umgebungsvariablen, nicht im Git. Teammitglieder melden sich mit E-Mail und Passwort an. Es gibt keinen externen Anmeldedienst und keinen E-Mail-Versand.

```bash
npm test
npm run lint
```

## Ablauf

1. Agentur registrieren. Die erste Person ist Inhaberin oder Inhaber. Die E-Mail ist zunächst auch die Einladungsadresse für die Anbieter.
2. Kunden anlegen und Anbieter aus dem Katalog wählen. Später lassen sich Anbieter ergänzen oder eine zweite Einrichtung mit eigenem Link anlegen.
3. Den Link der Einrichtung öffnen.
4. Schritte nacheinander mit der eigenen E-Mail bestätigen. Wer nicht weiterkommt, hinterlässt einen Hinweis.
5. In der Übersicht den Stand je Anbieter sehen: offen, wartet auf den Kunden, fertig. Einladungen, die der Kunde bestätigt hat, markiert die Agentur selbst als im Postfach angenommen.
6. Weitere Personen über Team einladen: Link kopieren, kein Mailversand. Hinweise stehen in der App.

Enthalten sind Supabase, Vercel, Netlify, Cloudflare, GitHub, Google Analytics, Google Search Console, Stripe, Resend, Sanity, IONOS und Plausible.

Die Schrift ist durchgehend Source Sans 3.
