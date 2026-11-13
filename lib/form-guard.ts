/**
 * Protections anti-abus pour les routes de formulaires publics.
 *
 * - Honeypot : champ invisible "website" que seuls les robots remplissent.
 * - Rate limit : fenêtre glissante en mémoire, par IP.
 *   ⚠️ En serverless (Vercel), la mémoire n'est pas partagée entre instances :
 *   c'est un frein « best effort ». Pour une garantie forte, brancher Upstash
 *   Redis / Vercel KV ou activer une règle Vercel Firewall.
 */

export const HONEYPOT_FIELD = "website"

export function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  const value = body?.[HONEYPOT_FIELD]
  return typeof value === "string" && value.trim().length > 0
}

const buckets = new Map<string, number[]>()

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
}

/** Retourne true si la requête dépasse `limit` appels sur `windowMs`. */
export function isRateLimited(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now()
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs)
  hits.push(now)
  buckets.set(key, hits)

  // Nettoyage opportuniste pour éviter une croissance illimitée
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k)
    }
  }

  return hits.length > limit
}

/** Vérifie qu'un champ texte est une chaîne non vide de longueur raisonnable. */
export function isValidText(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max
}

export const EMAIL_REGEX = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/
