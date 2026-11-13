"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { GoogleAnalytics } from "@/components/google-analytics"
import { Clarity } from "@/components/clarity"

/**
 * Bandeau de consentement (CNIL) : GA et Clarity ne se chargent qu'après acceptation.
 * - « Tout refuser » aussi visible que « Tout accepter »
 * - choix conservé 6 mois, puis redemandé
 * - réouverture possible via <CookieSettingsButton /> (pied de page)
 */

const STORAGE_KEY = "egc-consent"
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182 // ~6 mois
const OPEN_EVENT = "egc:open-cookie-settings"

type Consent = { analytics: boolean; date: number }

function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Consent
    if (typeof parsed?.analytics !== "boolean" || Date.now() - parsed.date > MAX_AGE_MS) return null
    return parsed
  } catch {
    return null
  }
}

function writeConsent(analytics: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics, date: Date.now() }))
  } catch {
    // stockage indisponible : le choix vaut pour la session en cours
  }
}

interface CookieConsentProps {
  gaId?: string
  clarityId?: string
}

export function CookieConsent({ gaId, clarityId }: CookieConsentProps) {
  const [consent, setConsent] = useState<Consent | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const stored = readConsent()
    setConsent(stored)
    setOpen(!stored)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, reopen)
    return () => window.removeEventListener(OPEN_EVENT, reopen)
  }, [])

  // Aucun traceur configuré : pas de bandeau
  if (!gaId && !clarityId) return null

  const choose = (analytics: boolean) => {
    const hadAccepted = consent?.analytics === true
    writeConsent(analytics)
    setConsent({ analytics, date: Date.now() })
    setOpen(false)
    // Retrait du consentement : recharger pour décharger les scripts déjà présents
    if (hadAccepted && !analytics) window.location.reload()
  }

  return (
    <>
      {consent?.analytics && gaId && <GoogleAnalytics gaId={gaId} />}
      {consent?.analytics && clarityId && <Clarity clarityId={clarityId} />}

      {open && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Gestion des cookies"
          className="fixed inset-x-0 bottom-0 z-[100] border-t-4 border-[#E73628] bg-white p-4 shadow-2xl sm:p-6"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm leading-relaxed text-gray-800">
              Nous utilisons des cookies de mesure d&apos;audience (Google Analytics, Microsoft Clarity) pour
              améliorer le site. Ils ne sont déposés qu&apos;avec votre accord.{" "}
              <Link href="/politique-cookies" className="font-semibold underline">
                En savoir plus
              </Link>
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => choose(false)}
                className="rounded-md border-2 border-gray-900 px-4 py-2 text-sm font-bold text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E73628]"
              >
                Tout refuser
              </button>
              <button
                type="button"
                onClick={() => choose(true)}
                className="rounded-md border-2 border-gray-900 bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E73628]"
              >
                Tout accepter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/** Lien « Gérer les cookies » qui rouvre le bandeau. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className={className}
    >
      Gérer les cookies
    </button>
  )
}
