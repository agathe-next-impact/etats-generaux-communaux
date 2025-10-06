import { type NextRequest, NextResponse } from "next/server"

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

    // In a real application, you would send an email here using a service like:
    // - Resend (https://resend.com)
    // - SendGrid
    // - Nodemailer with SMTP
    // - AWS SES
    // etc.

    // For now, we'll just log the data and return success
    console.log("[v0] Contact form submission:")
    console.log("[v0] - From:", nom, `<${email}>`)
    console.log("[v0] - To:", emailDestination)
    console.log("[v0] - Subject:", sujet)
    console.log("[v0] - Message:", message)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // TODO: Implement actual email sending
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'noreply@yourdomain.com',
    //   to: emailDestination,
    //   subject: `[Contact] ${sujet}`,
    //   html: `
    //     <h2>Nouveau message de ${nom}</h2>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Sujet:</strong> ${sujet}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `
    // })

    return NextResponse.json(
      {
        message: "Message envoyé avec succès",
        data: {
          nom,
          email,
          sujet,
          destination: emailDestination,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error processing contact form:", error)
    return NextResponse.json({ message: "Erreur lors de l'envoi du message. Veuillez réessayer." }, { status: 500 })
  }
}
