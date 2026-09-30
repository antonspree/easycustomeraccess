export type ProviderStep = {
  id: string
  title: string
  /** Was die Kundin oder der Kunde konkret tut. */
  instruction: string
  /** Welche E-Mail dabei benutzt wird. Platzhalter: {customerEmail}, {agencyEmail}, {customerName}, {agencyName}. */
  email: string
  /** Welche Rolle die Agentur bekommt. */
  agencyRole: string
  /** Woran man erkennt, dass der Schritt erledigt ist. */
  doneMeans: string
  href?: string
  hrefLabel?: string
  /** Der Kunde vergibt hier der Agentur eine Rolle. Die Agentur bestätigt später die Annahme. */
  grantsAccess?: boolean
}

export type ProviderDefinition = {
  id: string
  name: string
  category: string
  summary: string
  /**
   * Schlüssel im Adapter-Register.
   * Heute immer "guide". Ein späterer API-Adapter (Organisation oder Projekt
   * nach Zustimmung) ersetzt nur diesen Schlüssel, nicht die Oberfläche.
   */
  adapterId: string
  steps: ProviderStep[]
}

export type ProviderStatus = "offen" | "wartet" | "fertig"

export const STATUS_LABEL: Record<ProviderStatus, string> = {
  offen: "Offen",
  wartet: "Wartet auf den Kunden",
  fertig: "Fertig",
}
