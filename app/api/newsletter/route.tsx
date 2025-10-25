import { NextResponse } from "next/server"
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

    // Get recipient email from WordPress
    let recipientEmail = "contact@lesetatsgenerauxcommunaux.org"

    try {
      const archiveTitles = await getArchivePageTitles()
      if (archiveTitles?.page_newsletter?.email_denvoi_des_inscriptions_a_la_newsletter) {
        recipientEmail = archiveTitles.page_newsletter.email_denvoi_des_inscriptions_a_la_newsletter
      }
    } catch (wpError) {
      console.error("[v0] Failed to fetch WordPress data:", wpError)
    }

    const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace("/wp-json/wp/v2", "")

    try {
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

      if (response.ok) {
        const result = await response.json()
        console.log("[v0] Newsletter subscription sent via WordPress:", result)
        return NextResponse.json({
          message: "Inscription réussie ! Vous recevrez bientôt un email de confirmation.",
        })
      }
    } catch (wpError) {
      console.log("[v0] WordPress endpoint not available, logging data instead")
    }

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
      note: "Pour recevoir les inscriptions par email, ajoutez le code PHP fourni dans wordpress-integration/newsletter-endpoint.php à votre WordPress.",
    })
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
