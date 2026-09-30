"use client"

import { CircleCheckIcon } from "lucide-react"
import { useState } from "react"
import { Progress } from "@/components/ui/progress"
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

/** Ablauf aus blocks.so onboarding-03. */
export function LinkSteps() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
      <div className="flex items-center justify-end gap-4">
        <span className="text-sm text-foreground">
          Schritt {activeStep + 1}/{steps.length}
        </span>
        <Progress className="w-32" value={(activeStep / steps.length) * 100} />
      </div>
      <ul className="flex flex-col gap-3">
        {steps.map((step, index) => (
          <li key={step.id}>
            <button
              className={cn(
                "relative w-full cursor-pointer rounded-lg border bg-card p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                index === activeStep ? "border-primary" : "border-border",
              )}
              onClick={() => setActiveStep(index)}
              type="button"
            >
              <div className="flex items-start gap-3">
                {index < activeStep ? (
                  <CircleCheckIcon aria-hidden className="size-6 shrink-0 text-primary" />
                ) : (
                  <span
                    aria-hidden
                    className="flex size-6 items-center justify-center font-medium text-primary"
                  >
                    {step.id}
                  </span>
                )}
                <div className="flex flex-col gap-1">
                  <h3
                    className={cn(
                      "font-medium",
                      index < activeStep ? "text-foreground/70 line-through" : "text-foreground",
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-6 text-foreground/80">{step.description}</p>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
      <div className="rounded-lg bg-secondary p-4">
        <h4 className="text-sm font-medium text-foreground">Wenn jemand nicht weiterkommt</h4>
        <p className="mt-1 text-sm text-foreground/80">
          Die Person hinterlässt einen Hinweis am aktuellen Schritt. Das Konto bleibt bei ihr. Sie sehen den Hinweis in der Übersicht und können nachfassen.
        </p>
      </div>
    </div>
  )
}
