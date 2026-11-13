import { getArchivePageTitles } from "@/lib/wordpress"
import { EMAIL_REGEX } from "@/lib/form-guard"

/**
 * Adresse qui reçoit les formulaires du site (contact ET newsletter).
 * Toujours déterminée côté serveur, jamais depuis la requête client.
 *
 * Ordre de priorité :
 * 1. ACF « email_denvoi_des_inscriptions_a_la_newsletter » (options des pages d'archives, WordPress)
 * 2. Variable d'environnement CONTACT_EMAIL
 * 3. Adresse par défaut historique
 */
const DEFAULT_RECIPIENT = "agathe@next-impact.digital"

export async function getFormRecipient(): Promise<string> {
  try {
    const titles = await getArchivePageTitles()
    const fromWp = titles?.page_newsletter?.email_denvoi_des_inscriptions_a_la_newsletter
    if (typeof fromWp === "string" && EMAIL_REGEX.test(fromWp.trim())) return fromWp.trim()
  } catch (error) {
    console.error("[forms] Impossible de lire le destinataire WordPress:", error instanceof Error ? error.message : error)
  }
  return process.env.CONTACT_EMAIL || DEFAULT_RECIPIENT
}
