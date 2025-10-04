export interface WordPressPost {
  id: number
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  date: string
  slug: string
  featured_media: number
  categories: number[]
  tags: number[]
  author: number
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string
      alt_text: string
    }>
    "wp:term"?: Array<
      Array<{
        id: number
        name: string
        slug: string
      }>
    >
    author?: Array<{
      name: string
      slug: string
    }>
  }
}

export interface WordPressCategory {
  id: number
  name: string
  slug: string
  count: number
}

export interface WordPressResource {
  id: number
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  featured_media: number
  categories: number[]
  acf?: {
    descriptif?: string
    video?: string
    fichiers?: Array<{
      document?: {
        url: string
        filename: string
        filesize: number
        mime_type: string
      }
      titre_du_document?: string
      descriptif_du_document?: string
    }>
  }
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string
      alt_text: string
    }>
    "wp:term"?: Array<
      Array<{
        id: number
        name: string
        slug: string
      }>
    >
  }
}

export interface WordPressLocalGroup {
  id: number
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  featured_media: number
  acf?: {
    nom_de_groupe?: string
    localisation?: {
      address: string
      lat: number
      lng: number
    }
    descriptif?: string
    nom_de_contact?: string
    email_de_contact?: string
    telephone_de_contact?: string
    site_web?: string
  }
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string
      alt_text: string
    }>
  }
}

export interface WordPressEvent {
  id: number
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  date: string
  slug: string
  featured_media: number
  categories: number[]
  acf?: {
    description?: string // Description field from ACF
    lien_vers_levenement_en_ligne?: string // Online event link (oembed)
    date?: string // Date field (d/m/Y format)
    heure?: string // Time field (g:i a format)
    lieu?: {
      // Google Map field
      address: string
      lat: number
      lng: number
    }
  }
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string
      alt_text: string
    }>
    "wp:term"?: Array<
      Array<{
        id: number
        name: string
        slug: string
      }>
    >
  }
}

export interface WordPressTaxonomy {
  id: number
  name: string
  slug: string
  count: number
}

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://demo.wp-api.org/wp-json/wp/v2"

async function validateJsonResponse(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type")

  if (!contentType || !contentType.includes("application/json")) {
    console.error(`Expected JSON response but got ${contentType}`)
    throw new Error(`Invalid response type: ${contentType}`)
  }

  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch (error) {
    console.error("Failed to parse JSON response:", text.substring(0, 200))
    throw new Error("Invalid JSON response from WordPress API")
  }
}

export async function getPosts(params?: {
  page?: number
  per_page?: number
  categories?: string
  search?: string
  orderby?: string
  order?: "asc" | "desc"
}): Promise<{ posts: WordPressPost[]; totalPages: number }> {
  const searchParams = new URLSearchParams()

  if (params?.page) searchParams.set("page", params.page.toString())
  if (params?.per_page) searchParams.set("per_page", params.per_page.toString())
  if (params?.categories) searchParams.set("categories", params.categories)
  if (params?.search) searchParams.set("search", params.search)
  if (params?.orderby) searchParams.set("orderby", params.orderby)
  if (params?.order) searchParams.set("order", params.order)

  searchParams.set("_embed", "true")

  try {
    const response = await fetch(`${WP_API_URL}/posts?${searchParams.toString()}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`)
    }

    const posts = await validateJsonResponse(response)
    const totalPages = Number.parseInt(response.headers.get("X-WP-TotalPages") || "1")

    return { posts: Array.isArray(posts) ? posts : [], totalPages }
  } catch (error) {
    console.error("Error fetching WordPress posts:", error)
    return {
      posts: [
        {
          id: 1,
          title: { rendered: "Article de démonstration" },
          content: {
            rendered:
              "<p>Ceci est un article de démonstration en attendant la configuration de votre API WordPress.</p>",
          },
          excerpt: { rendered: "<p>Article de démonstration...</p>" },
          date: new Date().toISOString(),
          slug: "demo-article",
          featured_media: 0,
          categories: [1],
          tags: [],
          author: 1,
        },
      ],
      totalPages: 1,
    }
  }
}

export async function getPost(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await fetch(`${WP_API_URL}/posts?slug=${slug}&_embed=true`, {
      next: { revalidate: 300 },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`)
    }

    const posts = await validateJsonResponse(response)
    return Array.isArray(posts) && posts.length > 0 ? posts[0] : null
  } catch (error) {
    console.error("Error fetching WordPress post:", error)
    return null
  }
}

export async function getCategories(): Promise<WordPressCategory[]> {
  try {
    const response = await fetch(`${WP_API_URL}/categories?per_page=100`, {
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`)
    }

    const categories = await validateJsonResponse(response)
    return Array.isArray(categories) ? categories : []
  } catch (error) {
    console.error("Error fetching WordPress categories:", error)
    return [
      { id: 1, name: "Actualités", slug: "actualites", count: 5 },
      { id: 2, name: "Actions", slug: "actions", count: 3 },
      { id: 3, name: "Ressources", slug: "ressources", count: 8 },
    ]
  }
}

export async function getResources(params?: {
  categories?: string
  search?: string
}): Promise<WordPressResource[]> {
  try {
    const searchParams = new URLSearchParams()
    searchParams.set("per_page", "100")
    searchParams.set("_embed", "true")
    searchParams.set("acf_format", "standard")

    if (params?.categories && params.categories !== "all") {
      // Try to get category ID from slug for proper API filtering
      try {
        const categoriesResponse = await fetch(`${WP_API_URL}/categorie-de-ressource?slug=${params.categories}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })

        if (categoriesResponse.ok) {
          const categoryData = await validateJsonResponse(categoriesResponse)
          if (Array.isArray(categoryData) && categoryData.length > 0) {
            searchParams.set("categorie-de-ressource", categoryData[0].id.toString())
            console.log("[v0] Using category ID for filtering:", categoryData[0].id)
          }
        } else {
          // Fallback to slug if ID lookup fails
          searchParams.set("categorie-de-ressource", params.categories)
          console.log("[v0] Using category slug for filtering:", params.categories)
        }
      } catch (error) {
        console.log("[v0] Category ID lookup failed, using slug:", params.categories)
        searchParams.set("categorie-de-ressource", params.categories)
      }
    }

    if (params?.search) {
      searchParams.set("search", params.search)
    }

    console.log("[v0] Fetching resources with params:", searchParams.toString())

    const response = await fetch(`${WP_API_URL}/ressource?${searchParams.toString()}`, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("[v0] API request failed:", response.status, response.statusText)
      throw new Error(`Failed to fetch resources: ${response.status} ${response.statusText}`)
    }

    const resources = await validateJsonResponse(response)
    console.log("[v0] Resources fetched with filters:", resources.length, "resources")
    return Array.isArray(resources) ? resources : []
  } catch (error) {
    console.error("[v0] Error fetching WordPress resources:", error)
    console.log("[v0] No resources found - Configure WordPress CPT 'ressource' with ACF fields to add resources")

    return []
  }
}

export async function getLocalGroups(): Promise<WordPressLocalGroup[]> {
  try {
    // Try to fetch from the "groupe-locaux" custom post type
    const response = await fetch(`${WP_API_URL}/groupe-locaux?per_page=100&_embed=true&acf_format=standard`, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch local groups: ${response.status} ${response.statusText}`)
    }

    const groups = await validateJsonResponse(response)
    console.log("[v0] Local groups fetched from WordPress:", groups.length, "groups")
    return Array.isArray(groups) ? groups : []
  } catch (error) {
    console.error("Error fetching WordPress local groups:", error)
    console.log(
      "[v0] Using demo local groups data - Configure WordPress CPT 'groupe-locaux' with ACF fields to see real data",
    )

    // Return demo data with the correct structure
    return [
      {
        id: 1,
        title: { rendered: "Collectif Paris Centre" },
        content: { rendered: "<p>Groupe local actif dans le centre de Paris.</p>" },
        featured_media: 0,
        acf: {
          nom_de_groupe: "Collectif Paris Centre",
          localisation: {
            address: "Place de la République, 75003 Paris, France",
            lat: 48.8676,
            lng: 2.3631,
          },
          descriptif:
            "Groupe local engagé dans les actions citoyennes au cœur de Paris. Nous organisons des événements, des débats et des actions de sensibilisation.",
          nom_de_contact: "Marie Dubois",
          email_de_contact: "paris.centre@collectif.org",
          telephone_de_contact: "01 42 34 56 78",
          site_web: "https://paris-centre.collectif.org",
        },
      },
      {
        id: 2,
        title: { rendered: "Groupe Lyon Solidaire" },
        content: { rendered: "<p>Collectif lyonnais pour l'action sociale.</p>" },
        featured_media: 0,
        acf: {
          nom_de_groupe: "Groupe Lyon Solidaire",
          localisation: {
            address: "Place Bellecour, 69002 Lyon, France",
            lat: 45.7578,
            lng: 4.832,
          },
          descriptif:
            "Association lyonnaise dédiée à l'entraide et à l'action sociale. Nous menons des projets de solidarité locale et d'engagement citoyen.",
          nom_de_contact: "Pierre Martin",
          email_de_contact: "lyon@collectif.org",
          telephone_de_contact: "04 78 90 12 34",
          site_web: "https://lyon.collectif.org",
        },
      },
      {
        id: 3,
        title: { rendered: "Collectif Marseille Action" },
        content: { rendered: "<p>Mouvement citoyen marseillais.</p>" },
        featured_media: 0,
        acf: {
          nom_de_groupe: "Collectif Marseille Action",
          localisation: {
            address: "Vieux-Port, 13001 Marseille, France",
            lat: 43.2965,
            lng: 5.3698,
          },
          descriptif:
            "Mouvement citoyen marseillais axé sur l'écologie urbaine et la démocratie participative. Nous organisons des actions de terrain et des débats publics.",
          nom_de_contact: "Sophie Moreau",
          email_de_contact: "marseille@collectif.org",
          telephone_de_contact: "04 91 23 45 67",
          site_web: "https://marseille.collectif.org",
        },
      },
      {
        id: 4,
        title: { rendered: "Groupe Toulouse Engagement" },
        content: { rendered: "<p>Collectif toulousain pour l'engagement citoyen.</p>" },
        featured_media: 0,
        acf: {
          nom_de_groupe: "Groupe Toulouse Engagement",
          localisation: {
            address: "Place du Capitole, 31000 Toulouse, France",
            lat: 43.6043,
            lng: 1.4437,
          },
          descriptif:
            "Groupe local toulousain focalisé sur l'engagement citoyen et les initiatives participatives. Nous développons des projets collaboratifs et des actions de sensibilisation.",
          nom_de_contact: "Jean Dupont",
          email_de_contact: "toulouse@collectif.org",
          telephone_de_contact: "05 61 78 90 12",
          site_web: "https://toulouse.collectif.org",
        },
      },
      {
        id: 5,
        title: { rendered: "Collectif Bordeaux Citoyen" },
        content: { rendered: "<p>Association bordelaise pour la citoyenneté active.</p>" },
        featured_media: 0,
        acf: {
          nom_de_groupe: "Collectif Bordeaux Citoyen",
          localisation: {
            address: "Place de la Bourse, 33000 Bordeaux, France",
            lat: 44.8378,
            lng: -0.5792,
          },
          descriptif:
            "Association bordelaise promouvant la citoyenneté active et l'engagement local. Nous organisons des ateliers, des conférences et des actions citoyennes.",
          nom_de_contact: "Claire Leroy",
          email_de_contact: "bordeaux@collectif.org",
          telephone_de_contact: "05 56 34 78 90",
          site_web: "https://bordeaux.collectif.org",
        },
      },
    ]
  }
}

export async function getResourceCategories(): Promise<WordPressTaxonomy[]> {
  try {
    const response = await fetch(`${WP_API_URL}/categorie-de-ressource?per_page=100`, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch resource categories: ${response.status} ${response.statusText}`)
    }

    const categories = await validateJsonResponse(response)
    console.log("[v0] Resource categories fetched:", categories.length, "categories")
    return Array.isArray(categories) ? categories : []
  } catch (error) {
    console.error("Error fetching resource categories:", error)
    console.log(
      "[v0] No resource categories found - Configure WordPress taxonomy 'categorie-de-ressource' to add categories",
    )

    return []
  }
}

export async function getEvents(params?: {
  type?: string
  search?: string
  status?: string
}): Promise<WordPressEvent[]> {
  try {
    const searchParams = new URLSearchParams()
    searchParams.set("per_page", "100")
    searchParams.set("_embed", "true")
    searchParams.set("acf_format", "standard")
    searchParams.set("orderby", "date")
    searchParams.set("order", "desc")

    if (params?.type && params.type !== "all") {
      try {
        const categoriesResponse = await fetch(`${WP_API_URL}/categorie-devenement?slug=${params.type}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })

        if (categoriesResponse.ok) {
          const categoryData = await validateJsonResponse(categoriesResponse)
          if (Array.isArray(categoryData) && categoryData.length > 0) {
            searchParams.set("categorie-devenement", categoryData[0].id.toString())
            console.log("[v0] Using event category ID for filtering:", categoryData[0].id)
          }
        } else {
          searchParams.set("categorie-devenement", params.type)
          console.log("[v0] Using event category slug for filtering:", params.type)
        }
      } catch (error) {
        console.log("[v0] Event category ID lookup failed, using slug:", params.type)
        searchParams.set("categorie-devenement", params.type)
      }
    }

    if (params?.search) {
      searchParams.set("search", params.search)
    }

    console.log("[v0] Fetching events with params:", searchParams.toString())

    const response = await fetch(`${WP_API_URL}/evenement?${searchParams.toString()}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes for events
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("[v0] Events API request failed:", response.status, response.statusText)
      throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`)
    }

    const events = await validateJsonResponse(response)
    console.log("[v0] Events fetched:", events.length, "events")
    return Array.isArray(events) ? events : []
  } catch (error) {
    console.error("[v0] Error fetching WordPress events:", error)
    console.log("[v0] Using demo events data - Configure WordPress CPT 'evenement' with ACF fields to see real data")

    return [
      {
        id: 1,
        title: { rendered: "Conférence sur l'écologie urbaine" },
        content: { rendered: "<p>Une conférence passionnante sur les enjeux de l'écologie en ville.</p>" },
        excerpt: { rendered: "<p>Découvrez les solutions innovantes pour une ville plus verte.</p>" },
        date: "2024-02-15T10:00:00",
        slug: "conference-ecologie-urbaine",
        featured_media: 0,
        categories: [1],
        acf: {
          description: "Une conférence passionnante sur les enjeux de l'écologie en ville avec des experts reconnus.",
          lien_vers_levenement_en_ligne: "https://www.youtube.com/watch?v=example",
          date: "15/02/2024",
          heure: "2:00 pm",
          lieu: {
            address: "Centre de conférences de Paris, 123 Avenue des Champs-Élysées, 75008 Paris",
            lat: 48.8698,
            lng: 2.3076,
          },
        },
      },
      {
        id: 2,
        title: { rendered: "Atelier de co-construction citoyenne" },
        content: { rendered: "<p>Participez à un atelier collaboratif pour imaginer la ville de demain.</p>" },
        excerpt: { rendered: "<p>Atelier participatif ouvert à tous les citoyens.</p>" },
        date: "2024-02-10T09:00:00",
        slug: "atelier-coconstruction",
        featured_media: 0,
        categories: [2],
        acf: {
          description: "Atelier participatif pour co-construire des solutions citoyennes innovantes.",
          date: "10/02/2024",
          heure: "9:00 am",
          lieu: {
            address: "Mairie du 11ème arrondissement, Place Léon Blum, 75011 Paris",
            lat: 48.8566,
            lng: 2.3776,
          },
        },
      },
      {
        id: 3,
        title: { rendered: "Manifestation pour le climat" },
        content: { rendered: "<p>Rejoignez-nous pour une manifestation pacifique pour le climat.</p>" },
        excerpt: { rendered: "<p>Mobilisation citoyenne pour l'urgence climatique.</p>" },
        date: "2024-02-20T14:00:00",
        slug: "manifestation-climat",
        featured_media: 0,
        categories: [3],
        acf: {
          description:
            "Manifestation pacifique pour sensibiliser à l'urgence climatique et demander des actions concrètes.",
          date: "20/02/2024",
          heure: "2:00 pm",
          lieu: {
            address: "Place de la République, 75003 Paris",
            lat: 48.8676,
            lng: 2.3631,
          },
        },
      },
      {
        id: 4,
        title: { rendered: "Formation aux outils numériques citoyens" },
        content: { rendered: "<p>Apprenez à utiliser les outils numériques pour l'engagement citoyen.</p>" },
        excerpt: { rendered: "<p>Formation pratique aux outils numériques.</p>" },
        date: "2024-01-25T10:00:00",
        slug: "formation-numerique",
        featured_media: 0,
        categories: [4],
        acf: {
          description: "Formation complète aux outils numériques pour renforcer l'engagement citoyen.",
          lien_vers_levenement_en_ligne: "https://meet.google.com/example",
          date: "25/01/2024",
          heure: "10:00 am",
          lieu: {
            address: "Espace numérique citoyen, 45 Rue de Rivoli, 75001 Paris",
            lat: 48.8566,
            lng: 2.3522,
          },
        },
      },
    ]
  }
}

export async function getEventCategories(): Promise<WordPressTaxonomy[]> {
  try {
    const response = await fetch(`${WP_API_URL}/categorie-devenement?per_page=100`, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch event categories: ${response.status} ${response.statusText}`)
    }

    const categories = await validateJsonResponse(response)
    console.log("[v0] Event categories fetched:", categories.length, "categories")
    return Array.isArray(categories) ? categories : []
  } catch (error) {
    console.error("Error fetching event categories:", error)
    console.log(
      "[v0] Using demo event categories - Configure WordPress taxonomy 'categorie-devenement' to add categories",
    )

    return [
      { id: 1, name: "Conférence", slug: "conference", count: 5 },
      { id: 2, name: "Atelier", slug: "atelier", count: 8 },
      { id: 3, name: "Manifestation", slug: "manifestation", count: 3 },
      { id: 4, name: "Formation", slug: "formation", count: 6 },
      { id: 5, name: "Débat", slug: "debat", count: 4 },
    ]
  }
}

export const getEventTypes = getEventCategories

// Utility function to strip HTML tags from content
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "")
}

// Utility function to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export async function getEvent(slug: string): Promise<WordPressEvent | null> {
  try {
    const response = await fetch(`${WP_API_URL}/evenement?slug=${slug}&_embed=true&acf_format=standard`, {
      next: { revalidate: 300 },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.status} ${response.statusText}`)
    }

    const events = await validateJsonResponse(response)
    return Array.isArray(events) && events.length > 0 ? events[0] : null
  } catch (error) {
    console.error("Error fetching WordPress event:", error)
    return null
  }
}

export async function getResource(slug: string): Promise<WordPressResource | null> {
  try {
    const response = await fetch(`${WP_API_URL}/ressource?slug=${slug}&_embed=true&acf_format=standard`, {
      next: { revalidate: 300 },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch resource: ${response.status} ${response.statusText}`)
    }

    const resources = await validateJsonResponse(response)
    return Array.isArray(resources) && resources.length > 0 ? resources[0] : null
  } catch (error) {
    console.error("Error fetching WordPress resource:", error)
    return null
  }
}

export async function getPageBySlug(slug: string): Promise<any | null> {
  try {
    console.log(`[v0] Fetching WordPress page with slug: ${slug}`)
    console.log(`[v0] API URL: ${WP_API_URL}/pages?slug=${slug}&acf_format=standard`)

    const response = await fetch(`${WP_API_URL}/pages?slug=${slug}&acf_format=standard`, {
      next: { revalidate: 300 },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    console.log(`[v0] Response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      console.error(`[v0] Failed to fetch page "${slug}": ${response.status} ${response.statusText}`)
      console.error(`[v0] Full URL attempted: ${WP_API_URL}/pages?slug=${slug}&acf_format=standard`)

      if (response.status === 404) {
        console.error(`[v0] Page "${slug}" not found in WordPress. Please check:`)
        console.error(`[v0] 1. The page exists in WordPress admin`)
        console.error(`[v0] 2. The page slug is exactly "${slug}"`)
        console.error(`[v0] 3. The page is published (not draft)`)
        console.error(`[v0] 4. WordPress REST API is accessible at: ${WP_API_URL}`)
      }

      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`)
    }

    const pages = await validateJsonResponse(response)
    console.log(`[v0] Pages found:`, pages.length)

    if (Array.isArray(pages) && pages.length > 0) {
      console.log(`[v0] Page data retrieved successfully for "${slug}"`)
      console.log(`[v0] Page ACF fields:`, Object.keys(pages[0].acf || {}))

      if (pages[0].acf) {
        console.log(`[v0] ACF field values:`)
        Object.entries(pages[0].acf).forEach(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            console.log(`[v0] - ${key}:`, JSON.stringify(value, null, 2))
          } else {
            console.log(`[v0] - ${key}:`, value)
          }
        })
      } else {
        console.log(`[v0] No ACF data found - check if ACF plugin is installed and fields are configured`)
      }

      return pages[0]
    } else {
      console.log(`[v0] No pages found with slug "${slug}"`)
      return null
    }
  } catch (error) {
    console.error(`[v0] Error fetching WordPress page "${slug}":`, error)
    return null
  }
}
