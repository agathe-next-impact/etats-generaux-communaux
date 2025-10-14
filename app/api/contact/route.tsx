import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, email, sujet, message, emailDestination } = body

    // Validate required fields
    if (!nom || !email || !sujet || !message) {
      return NextResponse.json({ message: "Tous les champs sont requis" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Format d'email invalide" }, { status: 400 })
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("[v0] RESEND_API_KEY is not configured")
      return NextResponse.json(
        { message: "Configuration email manquante. Veuillez contacter l'administrateur." },
        { status: 500 },
      )
    }

    // Initialize Resend client
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Send email using Resend
    try {
      const { data, error } = await resend.emails.send({
        from: "Les EGC <noreply@lesegc.fr>", // Replace with your verified domain
        to: emailDestination || "agathe.karinthi.martin@gmail.com", // Fallback to default email
        replyTo: email, // Allow recipient to reply directly to sender
        subject: `[Contact] ${sujet}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #6CB33F; padding-bottom: 10px;">
              Nouveau message de contact
            </h2>
            <div style="margin: 20px 0;">
              <p><strong>Nom:</strong> ${nom}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Sujet:</strong> ${sujet}</p>
            </div>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Message:</strong></p>
              <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Ce message a été envoyé depuis le formulaire de contact du site Les EGC.
            </p>
          </div>
        `,
      })

      if (error) {
        console.error("[v0] Resend error:", error)
        return NextResponse.json({ message: "Erreur lors de l'envoi de l'email. Veuillez réessayer." }, { status: 500 })
      }

      console.log("[v0] Email sent successfully via Resend:", data)

      return NextResponse.json(
        {
          message: "Message envoyé avec succès",
          data: {
            nom,
            email,
            sujet,
            destination: emailDestination,
            emailId: data?.id,
          },
        },
        { status: 200 },
      )
    } catch (emailError) {
      console.error("[v0] Error sending email with Resend:", emailError)
      return NextResponse.json({ message: "Erreur lors de l'envoi de l'email. Veuillez réessayer." }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Error processing contact form:", error)
    return NextResponse.json({ message: "Erreur lors de l'envoi du message. Veuillez réessayer." }, { status: 500 })
  }
}
