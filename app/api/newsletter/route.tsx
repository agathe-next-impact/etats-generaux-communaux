import { NextResponse } from "next/server"
import { isWordPressMailerConfigured, sendFormViaWordPress } from "@/lib/wordpress-mailer"
import { EMAIL_REGEX, getClientIp, isHoneypotTriggered, isRateLimited, isValidText } from "@/lib/form-guard"

/**
 * Inscription newsletter : validation et anti-abus ici, envoi des deux emails
 * (admin + confirmation abonné) par WordPress.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Robot détecté : on répond OK sans rien envoyer
    if (isHoneypotTriggered(body)) {
      return NextResponse.json({ message: "Inscription réussie ! Vous recevrez bientôt un email de confirmation." })
    }

    if (isRateLimited(`newsletter:${getClientIp(request)}`, 3)) {
      return NextResponse.json({ message: "Trop de tentatives. Merci de réessayer plus tard." }, { status: 429 })
    }

    const { nom, prenom, email, telephone, accepteConditions } = body

    if (!isValidText(nom, 100) || !isValidText(prenom, 100) || !isValidText(email, 254)) {
      return NextResponse.json({ message: "Nom, prénom et email sont requis" }, { status: 400 })
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ message: "Format d'email invalide" }, { status: 400 })
    }

    if (telephone !== undefined && telephone !== "" && !isValidText(telephone, 30)) {
      return NextResponse.json({ message: "Numéro de téléphone invalide" }, { status: 400 })
    }

    if (!accepteConditions) {
      return NextResponse.json(
        { message: "Vous devez accepter de donner vos informations personnelles" },
        { status: 400 },
      )
    }

    if (!isWordPressMailerConfigured()) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[newsletter] Mode développement : inscription simulée (WP_FORMS_SECRET non défini)")
        return NextResponse.json({ message: "Inscription simulée (mode développement)." })
      }
      console.error("[newsletter] WP_FORMS_SECRET non défini")
      return NextResponse.json(
        { message: "Le service d'inscription est indisponible. Veuillez réessayer plus tard." },
        { status: 503 },
      )
    }

    try {
      await sendFormViaWordPress({ type: "newsletter", nom, prenom, email, telephone: telephone || "" })
    } catch (sendError) {
      console.error("[newsletter] Échec de l'envoi via WordPress:", sendError instanceof Error ? sendError.message : sendError)
      return NextResponse.json({ message: "Erreur lors de l'inscription. Veuillez réessayer plus tard." }, { status: 500 })
    }

    return NextResponse.json({ message: "Inscription réussie ! Vous recevrez bientôt un email de confirmation." })
  } catch (error) {
    console.error("[newsletter] Erreur de traitement:", error instanceof Error ? error.message : error)
    return NextResponse.json({ message: "Erreur lors du traitement de l'inscription" }, { status: 500 })
  }
}
