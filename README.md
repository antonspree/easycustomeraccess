# Blokr

Blokr ist für Web- und Media-Agenturen. Eine Agentur richtet Konten bei Drittanbietern so ein, dass sie auf den Namen und die E-Mail der Kundschaft laufen. Die Kundin oder der Kunde bestätigt die Schritte über einen geheimen Link. Die Agentur wird eingeladen und sieht den Stand.

Die App legt keine Konten bei den Anbietern an und verschickt keine E-Mails.

## Lokal starten

Voraussetzungen: Node.js 22.

```bash
npm install
npm run dev
```

Die App läuft unter [http://127.0.0.1:43133](http://127.0.0.1:43133).

Ohne `DATABASE_URL` liegen die Daten in `data/blokr.sqlite`. In der Produktion zeigt `DATABASE_URL` auf eine neue Neon-Datenbank. Die Verbindung steht nur in der Umgebung des Hosts, nicht im Git.

**Hinweis:** Beim Update von einer älteren Version (EasyCustomerAccess/Okklar) bitte die alte `data/eca.sqlite` löschen oder zu `data/blokr.sqlite` umbenennen.

```bash
npm test
```
