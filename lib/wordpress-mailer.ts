import { getWordPressBaseUrl } from "@/lib/wordpress"

/**
 * Délègue l'envoi des emails à WordPress (plugin wordpress-integration/egc-forms-mailer.php).
 * Le front ne détient aucun identifiant mail : seulement le secret partagé WP_FORMS_SECRET,
 * identique à la constante EGC_FORMS_SECRET de wp-config.php.
 * WordPress choisit lui-même le destinataire (champ ACF newsletter).
 */

export type FormPayload =
  | { type: "contact"; nom: string; email: string; sujet: string; message: string }
  | { type: "newsletter"; nom: string; prenom: string; email: string; telephone?: string }

export function isWordPressMailerConfigured(): boolean {
  return Boolean(process.env.WP_FORMS_SECRET)
}

/** Lève une erreur si WordPress refuse ou échoue à envoyer. */
export async function sendFormViaWordPress(payload: FormPayload): Promise<void> {
  const response = await fetch(`${getWordPressBaseUrl()}/wp-json/egc/v1/send-form`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-EGC-Forms-Secret": process.env.WP_FORMS_SECRET || "",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => "")
    throw new Error(`WordPress a répondu ${response.status}: ${detail.slice(0, 200)}`)
  }
}
