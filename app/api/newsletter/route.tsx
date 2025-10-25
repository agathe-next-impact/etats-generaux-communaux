import { NextResponse } from "next/server"
import { Resend } from "resend"
import { getArchivePageTitles } from "@/lib/wordpress"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom, prenom, email, telephone, accepteConditions } = body

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

    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.log("[v0] ⚠️ RESEND_API_KEY not configured")
      console.log("[v0] 💡 To enable real email sending, add a valid RESEND_API_KEY")
      console.log("[v0] Get your API key at: https://resend.com/api-keys")
      console.log("[v0] Simulating successful newsletter subscription...")

      // Simulate success for development
      return NextResponse.json({
        message: "Inscription simulée avec succès (mode développement)",
        data: { nom, prenom, email, telephone },
      })
    }

    const archiveTitles = await getArchivePageTitles()
    const recipientEmail =
      archiveTitles?.page_newsletter?.email_denvoi_des_inscriptions_a_la_newsletter ||
      "contact@etats-generaux-communaux.fr"

    console.log("[v0] Newsletter recipient email:", recipientEmail)

    const resend = new Resend(apiKey)

    // Send notification email to admin
    const { data, error } = await resend.emails.send({
      from: "Newsletter EGC <noreply@etats-generaux-communaux.fr>",
      to: recipientEmail, // Use email from page_newsletter ACF field
      subject: "Nouvelle inscription à la newsletter",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #E73628;">Nouvelle inscription à la newsletter</h2>
          <p>Une nouvelle personne s'est inscrite à la newsletter :</p>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0;"><strong>Nom :</strong> ${nom}</li>
            <li style="margin: 10px 0;"><strong>Prénom :</strong> ${prenom}</li>
            <li style="margin: 10px 0;"><strong>Email :</strong> ${email}</li>
            ${telephone ? `<li style="margin: 10px 0;"><strong>Téléphone :</strong> ${telephone}</li>` : ""}
          </ul>
          <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            Cette personne a accepté de donner ses informations personnelles pour recevoir la newsletter.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      return NextResponse.json({ message: "Erreur lors de l'envoi de l'email" }, { status: 500 })
    }

    console.log("[v0] Newsletter subscription email sent successfully:", data)

    // Send confirmation email to subscriber
    await resend.emails.send({
      from: "Newsletter EGC <noreply@etats-generaux-communaux.fr>",
      to: email,
      subject: "Bienvenue à la newsletter des États Généraux Communaux",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4AAD33;">Bienvenue ${prenom} !</h2>
          <p>Merci de vous être inscrit(e) à notre newsletter.</p>
          <p>Vous recevrez désormais nos actualités, événements et initiatives directement dans votre boîte mail.</p>
          <p style="margin-top: 30px;">À très bientôt,<br><strong>L'équipe des États Généraux Communaux</strong></p>
          <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            Si vous souhaitez vous désinscrire, vous pouvez le faire à tout moment en cliquant sur le lien de désinscription présent dans nos emails.
          </p>
        </div>
      `,
    })

    return NextResponse.json({
      message: "Inscription réussie",
      data: { id: data?.id },
    })
  } catch (error) {
    console.error("[v0] Error processing newsletter subscription:", error)
    return NextResponse.json({ message: "Erreur lors du traitement de l'inscription" }, { status: 500 })
  }
}
