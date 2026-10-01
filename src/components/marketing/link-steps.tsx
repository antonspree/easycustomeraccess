"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const steps = [
  {
    id: "1.",
    title: "Kunde und Anbieter anlegen",
    description:
      "Sie tragen Name und E-Mail der Kundin oder des Kunden ein und wählen die Anbieter aus dem Katalog. Die Konten sollen auf diese E-Mail laufen.",
  },
  {
    id: "2.",
    title: "Einen geheimen Link schicken",
    description:
      "Die ganze Einrichtung hängt an einem Link. Die Person meldet sich in EasyCustomerAccess nicht an und braucht kein Passwort bei Ihnen.",
  },
  {
    id: "3.",
    title: "Schritte mit der eigenen E-Mail bestätigen",
    description:
      "Es geht immer nur der nächste Schritt. Bestätigt wird mit der hinterlegten Adresse, nicht mit der E-Mail der Agentur.",
  },
  {
    id: "4.",
    title: "Einladung im eigenen Postfach annehmen",
    description:
      "Sie sehen offen, wartet oder fertig. Wenn die Einladung bestätigt ist, markieren Sie selbst, dass Sie sie im Postfach angenommen haben.",
  },
]

export function LinkSteps() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="flex w-full flex-col gap-8">
      <p className="text-sm text-muted-foreground">
        Schritt {activeStep + 1} von {steps.length}
      </p>
      <ol className="flex flex-col">
        {steps.map((step, index) => (
          <li key={step.id} className="border-t">
            <button
              className="w-full cursor-pointer py-5 text-left focus-visible:outline-none focus-visible:underline"
              onClick={() => setActiveStep(index)}
              type="button"
            >
              <span className="flex items-baseline gap-4">
                <span className="w-6 text-sm text-muted-foreground">{step.id}</span>
                <span className="flex flex-col gap-2">
                  <span className={cn("font-medium", index === activeStep ? "text-foreground" : "text-muted-foreground")}>
                    {step.title}
                  </span>
                  {index === activeStep ? (
                    <span className="text-sm leading-6 text-foreground/80">{step.description}</span>
                  ) : null}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="text-sm leading-6 text-muted-foreground">
        Wenn jemand nicht weiterkommt, hinterlässt die Person einen Hinweis am aktuellen Schritt. Das Konto bleibt bei ihr. Sie sehen den Hinweis in der Übersicht und können nachfassen.
      </p>
    </div>
  )
}
