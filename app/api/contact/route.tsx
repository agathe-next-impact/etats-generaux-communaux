import { type NextRequest, NextResponse } from "next/server"
import { isWordPressMailerConfigured, sendFormViaWordPress } from "@/lib/wordpress-mailer"
import { EMAIL_REGEX, getClientIp, isHoneypotTriggered, isRateLimited, isValidText } from "@/lib/form-guard"

/**
 * Formulaire de contact : validation et anti-abus ici, envoi par WordPress.
 * Le destinataire est choisi côté WordPress, jamais depuis la requête client.
 */
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

    if (!isWordPressMailerConfigured()) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[contact] Mode développement : email simulé (WP_FORMS_SECRET non défini)")
        return NextResponse.json({ message: "Message envoyé avec succès (mode développement)" }, { status: 200 })
      }
      console.error("[contact] WP_FORMS_SECRET non défini")
      return NextResponse.json(
        { message: "Le service d'envoi est indisponible. Veuillez réessayer plus tard." },
        { status: 503 },
      )
    }

    try {
      await sendFormViaWordPress({ type: "contact", nom, email, sujet, message })
    } catch (sendError) {
      console.error("[contact] Échec de l'envoi via WordPress:", sendError instanceof Error ? sendError.message : sendError)
      return NextResponse.json({ message: "Erreur lors de l'envoi de l'email. Veuillez réessayer." }, { status: 500 })
    }

    return NextResponse.json({ message: "Message envoyé avec succès" }, { status: 200 })
  } catch (error) {
    console.error("[contact] Erreur de traitement:", error instanceof Error ? error.message : error)
    return NextResponse.json({ message: "Erreur lors de l'envoi du message. Veuillez réessayer." }, { status: 500 })
  }
}
