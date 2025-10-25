import { NextResponse } from "next/server"
import { getArchivePageTitles } from "@/lib/wordpress"

export async function POST(request: Request) {
  try {
    console.log("[v0] Newsletter API: Request received")

    const body = await request.json()
    console.log("[v0] Newsletter API: Body parsed successfully")

    const { nom, prenom, email, telephone, accepteConditions } = body

    // Validation
    if (!nom || !prenom || !email) {
      console.log("[v0] Newsletter API: Validation failed - missing required fields")
      return NextResponse.json({ message: "Nom, prénom et email sont requis" }, { status: 400 })
    }

    if (!accepteConditions) {
      console.log("[v0] Newsletter API: Validation failed - conditions not accepted")
      return NextResponse.json(
        { message: "Vous devez accepter de donner vos informations personnelles" },
        { status: 400 },
      )
    }

    // Get recipient email from WordPress
    let recipientEmail = "contact@lesetatsgenerauxcommunaux.org" // Default fallback

    try {
      console.log("[v0] Newsletter API: Fetching WordPress data...")
      const archiveTitles = await getArchivePageTitles()
      if (archiveTitles?.page_newsletter?.email_denvoi_des_inscriptions_a_la_newsletter) {
        recipientEmail = archiveTitles.page_newsletter.email_denvoi_des_inscriptions_a_la_newsletter
        console.log("[v0] Using newsletter email from WordPress:", recipientEmail)
      } else {
        console.log("[v0] No newsletter email in WordPress, using fallback:", recipientEmail)
      }
    } catch (wpError) {
      console.error("[v0] Failed to fetch WordPress data:", wpError)
      console.log("[v0] Using fallback email:", recipientEmail)
      // Continue with fallback email
    }

    // Send data to WordPress to handle email sending
    const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace("/wp-json/wp/v2", "")
    const response = await fetch(`${wpApiUrl}/wp-json/mytheme/v1/newsletter-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom,
        prenom,
        email,
        telephone,
        recipient_email: recipientEmail,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Erreur lors de l'envoi de l'email")
    }

    const result = await response.json()

    console.log("[v0] Newsletter subscription processed successfully by WordPress:", result)

    return NextResponse.json({
      message: "Inscription réussie",
      data: result,
    })
  } catch (error) {
    console.error("[v0] Error processing newsletter subscription:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      {
        message: "Erreur lors du traitement de l'inscription",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
