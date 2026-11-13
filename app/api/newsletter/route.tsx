import { NextResponse } from "next/server"
import { getArchivePageTitles } from "@/lib/wordpress"
import nodemailer from "nodemailer"
import { escapeHtml } from "@/lib/sanitize"
import { EMAIL_REGEX, getClientIp, isHoneypotTriggered, isRateLimited, isValidText } from "@/lib/form-guard"

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

    // Validation
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

    let recipientEmail = "agathe@next-impact.digital"

    try {
      const archiveTitles = await getArchivePageTitles()

      if (archiveTitles?.page_newsletter?.email_denvoi_des_inscriptions_a_la_newsletter) {
        recipientEmail = archiveTitles.page_newsletter.email_denvoi_des_inscriptions_a_la_newsletter
      }
    } catch (wpError) {
      console.error("Failed to fetch WordPress data:", wpError)
    }

    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    // Gmail requires the "from" address to match the authenticated user
    const smtpFrom = process.env.SMTP_FROM || `Les EGC <${smtpUser}>`

    // Check if SMTP is configured
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error("[Newsletter] SMTP non configuré : inscription non transmise.")
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({ message: "Inscription simulée (mode développement, SMTP non configuré)." })
      }
      return NextResponse.json(
        { message: "Le service d'inscription est indisponible. Veuillez réessayer plus tard." },
        { status: 503 },
      )
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number.parseInt(smtpPort || "587"),
      secure: smtpPort === "465",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    // Email to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #6CB33F; padding-bottom: 10px;">
          Nouvelle inscription à la newsletter
        </h2>
        <div style="margin: 20px 0;">
          <p><strong>Nom:</strong> ${escapeHtml(nom)}</p>
          <p><strong>Prénom:</strong> ${escapeHtml(prenom)}</p>
          <p><strong>Email:</strong> <a href="mailto:${encodeURIComponent(email)}">${escapeHtml(email)}</a></p>
          <p><strong>Téléphone:</strong> ${escapeHtml(telephone || "Non fourni")}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Cette inscription a été effectuée le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}.
        </p>
      </div>
    `

    // Email to subscriber
    const siteDomain = process.env.SITE_DOMAIN || "lesetatsgenerauxcommunaux.org"
    const logoUrl = `https://${siteDomain}/images/logo-egc.png`

    const subscriberEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
        <img src="${logoUrl}" alt="Logo Les EGC" style="max-width: 200px; margin-bottom: 20px;" />
        <div style="text-align: left;">
          <h2 style="color: #333; border-bottom: 2px solid #6CB33F; padding-bottom: 10px;">
            Bienvenue dans notre newsletter !
          </h2>
          <p>Bonjour ${escapeHtml(prenom)},</p>
          <p>Merci de vous être inscrit(e) à notre newsletter. Vous recevrez bientôt nos actualités et informations.</p>
          <p>Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Les États Généraux Communaux
          </p>
        </div>
      </div>
    `

    try {
      // Verify SMTP connection first
      await transporter.verify()

      // Send email to admin
      await transporter.sendMail({
        from: smtpFrom,
        to: recipientEmail,
        subject: "Nouvelle inscription à la newsletter",
        html: adminEmailHtml,
      })

      // Send confirmation email to subscriber
      await transporter.sendMail({
        from: smtpFrom,
        to: email,
        subject: "Confirmation d'inscription à la newsletter",
        html: subscriberEmailHtml,
      })

      return NextResponse.json({
        message: "Inscription réussie ! Vous recevrez bientôt un email de confirmation.",
      })
    } catch (emailError) {
      console.error("[Newsletter] Error sending email:", emailError instanceof Error ? emailError.message : emailError)
      return NextResponse.json(
        { message: "Erreur lors de l'inscription. Veuillez réessayer plus tard." },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error processing newsletter subscription:", error)
    return NextResponse.json(
      { message: "Erreur lors du traitement de l'inscription" },
      { status: 500 },
    )
  }
}
