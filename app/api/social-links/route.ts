import { NextResponse } from "next/server"

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || ""

export async function GET() {
  try {
    const baseUrl = WP_API_URL.replace(/\/wp-json\/wp\/v2\/?$/, "")
    const customEndpoint = `${baseUrl}/wp-json/mytheme/v1/titres-pages-darchives`

    const response = await fetch(customEndpoint, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch social links: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Retourne les données des réseaux sociaux
    const socialLinks = data?.acf?.reseaux_sociaux || []
    
    return NextResponse.json(Array.isArray(socialLinks) ? socialLinks : [])
  } catch (error) {
    console.error("[API] Error fetching social links:", error)
    return NextResponse.json([], { status: 500 })
  }
}
