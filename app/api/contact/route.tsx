import { type NextRequest, NextResponse } from "next/server"
import { escapeHtml } from "@/lib/sanitize"
import { isMailerConfigured, sendMail } from "@/lib/mailer"
import { getFormRecipient } from "@/lib/form-recipient"
import { EMAIL_REGEX, getClientIp, isHoneypotTriggered, isRateLimited, isValidText } from "@/lib/form-guard"

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

    if (!isMailerConfigured()) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[contact] Mode développement : email simulé (SMTP non configuré)")
        return NextResponse.json({ message: "Message envoyé avec succès (mode développement)" }, { status: 200 })
      }
      console.error("[contact] SMTP non configuré : SMTP_HOST/SMTP_USER/SMTP_PASS manquant")
      return NextResponse.json(
        { message: "Le service d'envoi est indisponible. Veuillez réessayer plus tard." },
        { status: 503 },
      )
    }

    const recipient = await getFormRecipient()

    try {
      await sendMail({
        to: recipient,
        replyTo: email,
        subject: `[Contact] ${sujet}`,
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
    } catch (mailError) {
      console.error("[contact] Erreur SMTP:", mailError instanceof Error ? mailError.message : mailError)
      return NextResponse.json({ message: "Erreur lors de l'envoi de l'email. Veuillez réessayer." }, { status: 500 })
    }

    return NextResponse.json({ message: "Message envoyé avec succès" }, { status: 200 })
  } catch (error) {
    console.error("[contact] Erreur de traitement:", error instanceof Error ? error.message : error)
    return NextResponse.json({ message: "Erreur lors de l'envoi du message. Veuillez réessayer." }, { status: 500 })
  }
}
