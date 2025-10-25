import { NextResponse } from "next/server"
import { getArchivePageTitles } from "@/lib/wordpress"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom, prenom, email, telephone, accepteConditions } = body

    console.log("[v0] Newsletter subscription received:", { nom, prenom, email, telephone })

    // Validation
    if (!nom || !prenom || !email) {
      return NextResponse.json({ message: "Nom, prénom et email sont requis" }, { status: 400 })
    }

    if (!accepteConditions) {
      return NextResponse.json(
        { message: "Vous devez accepter de donner vos informations personnelles" },
        { status: 400 },
      )
    }

    // Get recipient email from WordPress
    let recipientEmail = "contact@lesetatsgenerauxcommunaux.org"

    try {
      const archiveTitles = await getArchivePageTitles()
      if (archiveTitles?.page_newsletter?.email_denvoi_des_inscriptions_a_la_newsletter) {
        recipientEmail = archiveTitles.page_newsletter.email_denvoi_des_inscriptions_a_la_newsletter
        console.log("[v0] Using recipient email from WordPress:", recipientEmail)
      }
    } catch (wpError) {
      console.error("[v0] Failed to fetch WordPress data:", wpError)
    }

    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const smtpFrom =
      process.env.SMTP_FROM || `Les EGC <noreply@${process.env.SITE_DOMAIN || "lesetatsgenerauxcommunaux.org"}>`

    // Check if SMTP is configured
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log("[v0] SMTP not configured. Required environment variables:")
      console.log("[v0] - SMTP_HOST (e.g., smtp.gmail.com)")
      console.log("[v0] - SMTP_PORT (e.g., 587)")
      console.log("[v0] - SMTP_USER (your email address)")
      console.log("[v0] - SMTP_PASS (your email password or app password)")
      console.log("[v0] - SMTP_FROM (optional, sender email)")
      console.log("[v0] Logging subscription data instead:")
      console.log("=== NOUVELLE INSCRIPTION NEWSLETTER ===")
      console.log("Nom:", nom)
      console.log("Prénom:", prenom)
      console.log("Email:", email)
      console.log("Téléphone:", telephone || "Non fourni")
      console.log("Email destinataire:", recipientEmail)
      console.log("Date:", new Date().toISOString())
      console.log("=====================================")

      return NextResponse.json({
        message: "Inscription enregistrée ! Les données ont été transmises.",
        note: "Pour recevoir les inscriptions par email, configurez les variables d'environnement SMTP.",
      })
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number.parseInt(smtpPort || "587"),
      secure: smtpPort === "465", // true for 465, false for other ports
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
          <p><strong>Nom:</strong> ${nom}</p>
          <p><strong>Prénom:</strong> ${prenom}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Téléphone:</strong> ${telephone || "Non fourni"}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Cette inscription a été effectuée le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}.
        </p>
      </div>
    `

    // Email to subscriber
    const subscriberEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #6CB33F; padding-bottom: 10px;">
          Bienvenue dans notre newsletter !
        </h2>
        <p>Bonjour ${prenom},</p>
        <p>Merci de vous être inscrit(e) à notre newsletter. Vous recevrez bientôt nos actualités et informations.</p>
        <p>Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet email.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Les États Généraux Communaux
        </p>
      </div>
    `

    try {
      console.log("[v0] Attempting to send admin notification email...")
      console.log("[v0] From:", smtpFrom)
      console.log("[v0] To:", recipientEmail)
      console.log("[v0] SMTP Host:", smtpHost)
      console.log("[v0] SMTP Port:", smtpPort)

      // Send email to admin
      const adminEmailResult = await transporter.sendMail({
        from: smtpFrom,
        to: recipientEmail,
        subject: "Nouvelle inscription à la newsletter",
        html: adminEmailHtml,
      })

      console.log("[v0] Admin notification email sent successfully!")
      console.log("[v0] Admin email result:", JSON.stringify(adminEmailResult, null, 2))
      console.log("[v0] Admin email sent to:", recipientEmail)

      console.log("[v0] Attempting to send confirmation email to subscriber...")
      console.log("[v0] Subscriber email:", email)

      // Send confirmation email to subscriber
      const subscriberEmailResult = await transporter.sendMail({
        from: smtpFrom,
        to: email,
        subject: "Confirmation d'inscription à la newsletter",
        html: subscriberEmailHtml,
      })

      console.log("[v0] Confirmation email sent successfully!")
      console.log("[v0] Subscriber email result:", JSON.stringify(subscriberEmailResult, null, 2))
      console.log("[v0] Confirmation email sent to subscriber:", email)

      return NextResponse.json({
        message: "Inscription réussie ! Vous recevrez bientôt un email de confirmation.",
      })
    } catch (emailError) {
      console.error("[v0] Error sending email:", emailError)
      console.error("[v0] Error details:", {
        message: emailError instanceof Error ? emailError.message : "Unknown error",
        stack: emailError instanceof Error ? emailError.stack : undefined,
      })
      return NextResponse.json(
        {
          message: "Erreur lors de l'envoi de l'email. Veuillez vérifier la configuration SMTP.",
          error: emailError instanceof Error ? emailError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Error processing newsletter subscription:", error)
    return NextResponse.json(
      {
        message: "Erreur lors du traitement de l'inscription",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
