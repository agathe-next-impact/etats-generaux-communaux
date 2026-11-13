import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { escapeHtml } from "@/lib/sanitize"
import { getParticiperPageData } from "@/lib/wordpress"
import { EMAIL_REGEX, getClientIp, isHoneypotTriggered, isRateLimited, isValidText } from "@/lib/form-guard"

/**
 * Le destinataire est TOUJOURS déterminé côté serveur (ACF de la page "participer",
 * puis variable CONTACT_EMAIL). Il ne doit jamais provenir de la requête client.
 */
async function getRecipient(): Promise<string | null> {
  try {
    const page = await getParticiperPageData()
    const fromWp = page?.acf?.adresse_mail_denvoi_du_formulaire
    if (typeof fromWp === "string" && EMAIL_REGEX.test(fromWp)) return fromWp
  } catch (error) {
    console.error("[contact] Impossible de lire le destinataire WordPress:", error)
  }
  return process.env.CONTACT_EMAIL || null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Robot détecté : on répond OK sans rien envoyer
    if (isHoneypotTriggered(body)) {
      return NextResponse.json({ message: "Message envoyé avec succès" }, { status: 200 })
    }

    if (isRateLimited(`contact:${getClientIp(request)}`, 5)) {
      return NextResponse.json(
        { message: "Trop de messages envoyés. Merci de réessayer plus tard." },
        { status: 429 },
      )
    }

    const { nom, email, sujet, message } = body

    if (!isValidText(nom, 200) || !isValidText(email, 254) || !isValidText(sujet, 200) || !isValidText(message, 10000)) {
      return NextResponse.json({ message: "Tous les champs sont requis" }, { status: 400 })
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ message: "Format d'email invalide" }, { status: 400 })
    }

    const recipient = await getRecipient()
    // TODO: aligner sur le domaine vérifié dans Resend (défaut historique conservé pour ne rien casser)
    const siteDomain = process.env.SITE_DOMAIN || "next-event.fr"
    const apiKey = process.env.RESEND_API_KEY

    if (!recipient || !siteDomain || !apiKey) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[contact] Mode développement : email simulé (RESEND_API_KEY, SITE_DOMAIN ou destinataire manquant)")
        return NextResponse.json({ message: "Message envoyé avec succès (mode développement)" }, { status: 200 })
      }
      console.error("[contact] Configuration incomplète : RESEND_API_KEY, SITE_DOMAIN ou destinataire manquant")
      return NextResponse.json({ message: "Le service d'envoi est indisponible. Veuillez réessayer plus tard." }, { status: 503 })
    }

    const resend = new Resend(apiKey)
    const safeSubject = sujet.replace(/[\r\n]+/g, " ")

    const { data, error } = await resend.emails.send({
      from: `Les EGC <noreply@${siteDomain}>`,
      to: recipient,
      replyTo: email,
      subject: `[Contact] ${safeSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #6CB33F; padding-bottom: 10px;">
            Nouveau message de contact
          </h2>
          <div style="margin: 20px 0;">
            <p><strong>Nom:</strong> ${escapeHtml(nom)}</p>
            <p><strong>Email:</strong> <a href="mailto:${encodeURIComponent(email)}">${escapeHtml(email)}</a></p>
            <p><strong>Sujet:</strong> ${escapeHtml(sujet)}</p>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Message:</strong></p>
            <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Ce message a été envoyé depuis le formulaire de contact du site Les EGC.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("[contact] Erreur Resend:", error.name, error.message)
      return NextResponse.json({ message: "Erreur lors de l'envoi de l'email. Veuillez réessayer." }, { status: 500 })
    }

    return NextResponse.json({ message: "Message envoyé avec succès", emailId: data?.id }, { status: 200 })
  } catch (error) {
    console.error("[contact] Erreur de traitement:", error instanceof Error ? error.message : error)
    return NextResponse.json({ message: "Erreur lors de l'envoi du message. Veuillez réessayer." }, { status: 500 })
  }
}
