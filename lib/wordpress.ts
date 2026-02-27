// Minimal interface for WordPressCategory (used in getCategories)
export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// Minimal interface for WordPressResource (used in getResources, getResource)
export interface WordPressResource {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  modified: string;
  slug: string;
  featured_media: number;
  categories: number[];
  tags: number[];
  author: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ 
      source_url: string; 
      alt_text: string;
      media_details?: {
        width: number;
        height: number;
      };
    }>;
    "wp:term"?: Array<Array<{ id: number; name: string; slug: string }>>;
    author?: Array<{ name: string; slug: string }>;
  };
  acf?: Record<string, any>;
}
export interface WordPressPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  slug: string;
  featured_media: number;
  categories: number[];
  tags: number[];
  author: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text: string }>;
    "wp:term"?: Array<Array<{ id: number; name: string; slug: string }>>;
    author?: Array<{ name: string; slug: string }>;
  };
}

export interface WordPressLocalGroup {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  featured_media: number;
  categories: number[];
  tags: number[];
  author: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    "wp:term"?: Array<
      Array<{
        id: number;
        name: string;
        slug: string;
      }>
    >;
    author?: Array<{
      name: string;
      slug: string;
    }>;
  };
  acf?: {
    nom_de_groupe: string;
    localisation: {
      address: string;
      lat: number;
      lng: number;
    };
    descriptif: string;
    nom_de_contact: string;
    email_de_contact: string;
    telephone_de_contact: string;
    site_web: string;
  };
}

export interface WordPressEvent {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  slug: string;
  featured_media: number;
  categories: number[];
  tags: number[];
  author: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    "wp:term"?: Array<
      Array<{
        id: number;
        name: string;
        slug: string;
      }>
    >;
    author?: Array<{
      name: string;
      slug: string;
    }>;
  };
  acf?: {
    description: string;
    lien_vers_levenement_en_ligne?: string;
    date: string;
    heure: string;
    lieu: {
      address: string;
      lat: number;
      lng: number;
    };
  };
}

export interface WordPressTaxonomy {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface HomePageACF {
  section_municipales?: {
    video?: string;
    titre_actus?: string;
    soustitre_actus?: string;
    titre_video?: string;
    soustitre_video?: string;
  };
  section_hero?: {
    titre?: string;
    "sous-titre"?: string;
    chapeau?: string;
    cta_de_gauche?: {
      libelle_de_gauche?: string;
      lien_de_gauche?: {
        url: string;
        title: string;
        target: string;
      };
    };
    cta_de_droite?: {
      libelle_de_droite?: string;
      lien_de_droite?: {
        url: string;
        title: string;
        target: string;
      };
    };
    cta_15?: {
      url: string;
      title: string;
      target: string;
    };
    image?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
  };
  groupe_de_liens?: {
    liste_des_liens?: Array<{
      libelle?: string;
      lien?: {
        url: string;
        title: string;
        target: string;
      };
      texte?: string;
      icone?: {
        url: string;
        alt: string;
        width: number;
        height: number;
      };
    }>;
  };
  historique?: {
    titre?: string;
    "sous-titre"?: string;
    liste_des_liens?: Array<{
      libelle?: string;
      lien?: {
        url: string;
        title: string;
        target: string;
      };
      texte?: string;
      icone?: {
        url: string;
        alt: string;
        width: number;
        height: number;
      };
    }>;
  };
  historique_egc?: {
    titre?: string;
    "sous-titre"?: string;
    liste_des_liens?: Array<{
      libelle?: string;
      lien?: {
        url: string;
        title: string;
        target: string;
      };
      texte?: string;
      icone?: {
        url: string;
        alt: string;
        width: number;
        height: number;
      };
    }>;
  };
  section_actus_evenements?: {
    titre_actus?: string;
    soustitre_actus?: string;
    titre_evenements?: string;
    soustitre_evenements?: string;
  };
  section_groupes_evenements?: {
    titre_groupes_locaux?: string;
    soustitre_groupes_locaux?: string;
    titre_evenements?: string;
    soustitre_evenements?: string;
  };
  section_manifeste?: {
    titre?: string;
    chapeau?: string;
    texte?: string;
    cta_de_gauche?: {
      libelle_de_gauche?: string;
      lien_de_gauche?: {
        url: string;
        title: string;
        target: string;
      };
    };
    cta_de_droite?: {
      libelle_de_droite?: string;
      lien_de_droite?: {
        url: string;
        title: string;
        target: string;
      };
    };
  };
}

export interface AboutPageACF {
  titre_principal?: string;
  "sous-titre_principal"?: string;
  chapeau?: string;
  fondateurs?: Array<{
    nom?: string;
    descriptif?: string;
    logo?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
    lien?: string;
  }>;
  partenaires?: Array<{
    nom?: string;
    descriptif?: string;
    logo?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
    lien?: string;
  }>;
}

export interface ParticiperPageACF {
  titre?: string;
  chapeau?: string;
  adresse_mail_denvoi_du_formulaire?: string;
}

export interface DoleancesPageACF {
  titre?: string;
  chapeau?: string;
  axes?: Array<{
    titre?: string;
    chapeau?: string;
    contenu?: Array<{
      titre?: string;
      texte?: string;
    }>;
    encadre_comment_agir?: {
      titre_comment_agir?: string;
      contenu?: string;
    };
  }>;
  cta?: {
    texte_du_cta_gauche?: string;
    lien_du_cta_de_gauche?: {
      url: string;
      title: string;
      target: string;
    };
    texte_du_cta_droite?: string;
    lien_du_cta_de_droite?: {
      url: string;
      title: string;
      target: string;
    };
  };
  bandeau_synthese?: {
    titre?: string;
    descriptif?: string;
    image_couleur?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
    lien_couleur?: {
      url: string;
      title: string;
      target: string;
    };
    image_noir_et_blanc?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
    lien_noir_et_blanc?: {
      url: string;
      title: string;
      target: string;
    };
  };
}

export interface DemanderDoleancesPageACF {
  titre?: string;
  contenu?: Array<{
    "sous-titre"?: string;
    contenu?: string;
  }>;
}

export interface ArchivePageTitles {
  page_ressources_et_kits?: {
    titre?: string;
    "sous-titre"?: string;
  };
  page_blog?: {
    titre?: string;
    "sous-titre"?: string;
  };
  page_communes?: {
    titre?: string;
    "sous-titre"?: string;
  };
  page_evenements?: {
    titre?: string;
    "sous-titre"?: string;
  };
  page_newsletter?: {
    titre?: string;
    "sous-titre"?: string;
    email_denvoi_des_inscriptions_a_la_newsletter?: string;
  };
  email?: string;
  affichage_de_la_topbar?: boolean;
}

export interface HomePageData {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: HomePageACF;
}

export interface AboutPageData {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: AboutPageACF;
}

export interface ParticiperPageData {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: ParticiperPageACF;
}

export interface DoleancesPageData {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: DoleancesPageACF;
}

export interface DemanderDoleancesPageData {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: DemanderDoleancesPageACF;
}

export interface LegalNoticePageData {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: {
    contenu: string;
  };
}

// Liste blanche des URLs WordPress autorisées (sécurité)
const ALLOWED_WORDPRESS_URLS = [
  "https://admin.lesetatsgenerauxcommunaux.org/wp-json/wp/v2",
  "https://staging.lesetatsgenerauxcommunaux.org/wp-json/wp/v2",
];

const DEFAULT_WP_API_URL = "https://admin.lesetatsgenerauxcommunaux.org/wp-json/wp/v2";

// Validation de l'URL WordPress pour éviter les injections
function getSecureWordPressApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  
  // Si pas d'URL en variable d'environnement, utiliser l'URL par défaut
  if (!envUrl) {
    return DEFAULT_WP_API_URL;
  }
  
  // Vérifier que l'URL est dans la liste blanche
  if (ALLOWED_WORDPRESS_URLS.includes(envUrl)) {
    return envUrl;
  }
  
  // En développement, on peut autoriser localhost
  if (process.env.NODE_ENV === "development" && envUrl.startsWith("http://localhost")) {
    console.warn("[WordPress API] Using localhost URL in development mode:", envUrl);
    return envUrl;
  }
  
  // URL non autorisée : log d'avertissement et fallback vers l'URL par défaut
  console.error(
    `[WordPress API] URL non autorisée détectée: "${envUrl}". ` +
    `Utilisation de l'URL par défaut. ` +
    `URLs autorisées: ${ALLOWED_WORDPRESS_URLS.join(", ")}`
  );
  return DEFAULT_WP_API_URL;
}

const WP_API_URL = getSecureWordPressApiUrl();

async function validateJsonResponse(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    console.error(`Expected JSON response but got ${contentType}`);
    throw new Error(`Invalid response type: ${contentType}`);
  }

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse JSON response:", text.substring(0, 200));
    throw new Error("Invalid JSON response from WordPress API");
  }
}

export async function getPosts(params?: {
  page?: number;
  per_page?: number;
  categories?: string;
  search?: string;
  orderby?: string;
  order?: "asc" | "desc";
}): Promise<{ posts: WordPressPost[]; totalPages: number }> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.per_page)
    searchParams.set("per_page", params.per_page.toString());
  if (params?.categories) searchParams.set("categories", params.categories);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.orderby) searchParams.set("orderby", params.orderby);
  if (params?.order) searchParams.set("order", params.order);

  searchParams.set("_embed", "true");

  try {
    const response = await fetch(
      `${WP_API_URL}/posts?${searchParams.toString()}`,
      {
        next: { revalidate: 60 }, // Revalidate every 1 minute
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("WordPress not available");
    }

    const posts = await validateJsonResponse(response);
    const totalPages = Number.parseInt(
      response.headers.get("X-WP-TotalPages") || "1",
    );

    return { posts: Array.isArray(posts) ? posts : [], totalPages };
  } catch (error) {
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
    };
  }
}

export async function getPost(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await fetch(
      `${WP_API_URL}/posts?slug=${slug}&_embed=true`,
      {
        next: { revalidate: 60 },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch post: ${response.status} ${response.statusText}`,
      );
    }

    const posts = await validateJsonResponse(response);
    return Array.isArray(posts) && posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error("Error fetching WordPress post:", error);
    return null;
  }
}

export async function getCategories(): Promise<WordPressCategory[]> {
  try {
    const response = await fetch(`${WP_API_URL}/categories?per_page=100`, {
      next: { revalidate: 60 }, // Revalidate every 1 minute
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("WordPress not available");
    }

    const categories = await validateJsonResponse(response);
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    return [
      { id: 1, name: "Actualités", slug: "actualites", count: 5 },
      { id: 2, name: "Actions", slug: "actions", count: 3 },
      { id: 3, name: "Ressources", slug: "ressources", count: 8 },
    ];
  }
}

export async function getResources(params?: {
  categories?: string;
  search?: string;
}): Promise<WordPressResource[]> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("per_page", "100");
    searchParams.set("_embed", "true");
    searchParams.set("acf_format", "standard");

    if (params?.categories && params.categories !== "all") {
      // Try to get category ID from slug for proper API filtering
      try {
        const categoriesResponse = await fetch(
          `${WP_API_URL}/categorie-de-ressource?slug=${params.categories}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        );

        if (categoriesResponse.ok) {
          const categoryData = await validateJsonResponse(categoriesResponse);
          if (Array.isArray(categoryData) && categoryData.length > 0) {
            searchParams.set(
              "categorie-de-ressource",
              categoryData[0].id.toString(),
            );
          }
        } else {
          // Fallback to slug if ID lookup fails
          searchParams.set("categorie-de-ressource", params.categories);
        }
      } catch (error) {
        searchParams.set("categorie-de-ressource", params.categories);
      }
    }

    if (params?.search) {
      searchParams.set("search", params.search);
    }

    const response = await fetch(
      `${WP_API_URL}/ressource?${searchParams.toString()}`,
      {
        next: { revalidate: 60 },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error(
        "[v0] API request failed:",
        response.status,
        response.statusText,
      );
      throw new Error(
        `Failed to fetch resources: ${response.status} ${response.statusText}`,
      );
    }

    const resources = await validateJsonResponse(response);
    return Array.isArray(resources) ? resources : [];
  } catch (error) {
    console.error("[v0] Error fetching WordPress resources:", error);

    return [];
  }
}

export async function getLocalGroups(): Promise<WordPressLocalGroup[]> {
  try {
    // Try to fetch from the "groupe-locaux" custom post type
    const response = await fetch(
      `${WP_API_URL}/groupe-locaux?per_page=100&_embed=true&acf_format=standard`,
      {
        next: { revalidate: 60 },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("WordPress not available");
    }

    const groups = await validateJsonResponse(response);
    return Array.isArray(groups) ? groups : [];
  } catch (error) {
    return [];
  }
}

export async function getResourceCategories(): Promise<WordPressTaxonomy[]> {
  try {
    const response = await fetch(
      `${WP_API_URL}/categorie-de-ressource?per_page=100`,
      {
        next: { revalidate: 60 },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.warn(
        `[v0] WordPress resource categories not available (${response.status}), using demo data`,
      );
      throw new Error("WordPress not available");
    }

    const categories = await validateJsonResponse(response);
    console.warn(
      "[v0] Resource categories fetched:",
      categories.length,
      "categories",
    );
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.warn(
      "[v0] Using demo event categories - Configure WordPress taxonomy 'categorie-de-ressource' to add categories",
    );

    return [];
  }
}

export async function getEvents(params?: {
  type?: string;
  search?: string;
  status?: string;
}): Promise<WordPressEvent[]> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("per_page", "100");
    searchParams.set("_embed", "true");
    searchParams.set("acf_format", "standard");
    searchParams.set("orderby", "date");
    searchParams.set("order", "desc");

    if (params?.type && params.type !== "all") {
      try {
        const categoriesResponse = await fetch(
          `${WP_API_URL}/categorie-devenement?slug=${params.type}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        );

        if (categoriesResponse.ok) {
          const categoryData = await validateJsonResponse(categoriesResponse);
          if (Array.isArray(categoryData) && categoryData.length > 0) {
            searchParams.set(
              "categorie-devenement",
              categoryData[0].id.toString(),
            );
            console.warn(
              "[v0] Using event category ID for filtering:",
              categoryData[0].id,
            );
          }
        } else {
          searchParams.set("categorie-devenement", params.type);
          console.warn(
            "[v0] Using event category slug for filtering:",
            params.type,
          );
        }
      } catch (error) {
        console.warn(
          "[v0] Event category ID lookup failed, using slug:",
          params.type,
        );
        searchParams.set("categorie-devenement", params.type);
      }
    }

    if (params?.search) {
      searchParams.set("search", params.search);
    }

    console.warn("[v0] Fetching events with params:", searchParams.toString());

    const response = await fetch(
      `${WP_API_URL}/evenement?${searchParams.toString()}`,
      {
        next: { revalidate: 60 }, // Revalidate every 1 minute for events
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.warn(
        `[v0] WordPress events not available (${response.status}), using demo data`,
      );
      throw new Error("WordPress not available");
    }

    const events = await validateJsonResponse(response);
    console.warn("[v0] Events fetched:", events.length, "events");
    return Array.isArray(events) ? events : [];
  } catch (error) {
    return [];
  }
}

export async function getEventCategories(): Promise<WordPressTaxonomy[]> {
  try {
    const response = await fetch(
      `${WP_API_URL}/categorie-devenement?per_page=100`,
      {
        next: { revalidate: 60 },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.warn(
        `[v0] WordPress event categories not available (${response.status}), using demo data`,
      );
      throw new Error("WordPress not available");
    }

    const categories = await validateJsonResponse(response);
    console.warn(
      "[v0] Event categories fetched:",
      categories.length,
      "categories",
    );
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.warn(
      "[v0] Using demo event categories - Configure WordPress taxonomy 'categorie-devenement' to add categories",
    );

    return [
      { id: 1, name: "Conférence", slug: "conference", count: 5 },
      { id: 2, name: "Atelier", slug: "atelier", count: 8 },
      { id: 3, name: "Manifestation", slug: "manifestation", count: 3 },
      { id: 4, name: "Formation", slug: "formation", count: 6 },
      { id: 5, name: "Débat", slug: "debat", count: 4 },
    ];
  }
}

export const getEventTypes = getEventCategories;

// Utility function to strip HTML tags from content
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

// Utility function to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function getEvent(slug: string): Promise<WordPressEvent | null> {
  try {
    const response = await fetch(
      `${WP_API_URL}/evenement?slug=${slug}&_embed=true&acf_format=standard`,
      {
        next: { revalidate: 60 },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch event: ${response.status} ${response.statusText}`,
      );
    }

    const events = await validateJsonResponse(response);
    return Array.isArray(events) && events.length > 0 ? events[0] : null;
  } catch (error) {
    console.error("Error fetching WordPress event:", error);
    return null;
  }
}

export async function getResource(
  idOrSlug: string,
): Promise<WordPressResource | null> {
  try {
    const isNumericId = /^\d+$/.test(idOrSlug);

    let response: Response;

    if (isNumericId) {
      // Fetch by ID
      response = await fetch(
        `${WP_API_URL}/ressource/${idOrSlug}?_embed=true&acf_format=standard`,
        {
          next: { revalidate: 60 },
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
    } else {
      // Fetch by slug
      response = await fetch(
        `${WP_API_URL}/ressource?slug=${idOrSlug}&_embed=true&acf_format=standard`,
        {
          next: { revalidate: 60 },
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (!response.ok) {
      console.error(
        `[v0] Failed to fetch resource: ${response.status} ${response.statusText}`,
      );
      throw new Error(
        `Failed to fetch resource: ${response.status} ${response.statusText}`,
      );
    }

    if (isNumericId) {
      // When fetching by ID, the response is a single object
      const resource = await validateJsonResponse(response);
      return resource;
    } else {
      // When fetching by slug, the response is an array
      const resources = await validateJsonResponse(response);
      return Array.isArray(resources) && resources.length > 0
        ? resources[0]
        : null;
    }
  } catch (error) {
    console.error("[v0] Error fetching WordPress resource:", error);
    return null;
  }
}

export async function getPageBySlug(slug: string): Promise<any | null> {
  try {
    const response = await fetch(
      `${WP_API_URL}/pages?slug=${slug}&acf_format=standard`,
      {
        next: { revalidate: 60 },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const pages = await validateJsonResponse(response);

    if (Array.isArray(pages) && pages.length > 0) {
      const page = pages[0];
      console.warn(`[v0] Page "${slug}" loaded successfully`);
      return page;
    }

    return null;
  } catch (error) {
    console.warn(
      `[v0] Could not fetch page "${slug}", trying alternative methods...`,
    );
    return null;
  }
}

export async function getHomePageData(): Promise<HomePageData | null> {
  try {
    // Method 1: Try slug "accueil"
    let page = await getPageBySlug("accueil");

    if (page) {
      return page as HomePageData;
    }

    // Method 2: Try by page ID 771 (from ACF export)
    console.warn("[v0] Trying to fetch homepage by ID 771");
    try {
      const response = await fetch(
        `${WP_API_URL}/pages/771?acf_format=standard`,
        {
          next: { revalidate: 60 },
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        page = await validateJsonResponse(response);
        console.warn("[v0] Homepage loaded successfully (ID: 771)");
        return page as HomePageData;
      }
    } catch (error) {}

    // Method 3: Try other common slugs
    const commonSlugs = ["home", "homepage", "index", "front-page"];
    for (const slug of commonSlugs) {
      page = await getPageBySlug(slug);
      if (page) {
        console.warn(`[v0] Homepage loaded successfully (slug: ${slug})`);
        return page as HomePageData;
      }
    }

    // Method 4: Try to get the front page from WordPress settings
    try {
      const response = await fetch(
        `${WP_API_URL}/pages?per_page=100&acf_format=standard`,
        {
          next: { revalidate: 60 },
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const pages = await validateJsonResponse(response);

        if (Array.isArray(pages) && pages.length > 0) {
          console.warn("[v0] Using first available page as homepage");
          return pages[0] as HomePageData;
        }
      }
    } catch (error) {}

    console.warn(
      "[v0] Using default homepage structure (WordPress not configured)",
    );
    return {
      id: 0,
      title: { rendered: "Accueil" },
      content: { rendered: "" },
      acf: {
        section_hero: {
          titre: "Bienvenue",
          "sous-titre": "Site en construction",
          chapeau: "Configurez votre WordPress pour voir le contenu réel.",
        },
        historique: {
          titre: "Notre histoire",
          "sous-titre": "Découvrez notre parcours",
          liste_des_liens: [],
        },
      },
    };
  } catch (error) {
    console.error("[v0] Critical error in getHomePageData:", error);
    return {
      id: 0,
      title: { rendered: "Accueil" },
      content: { rendered: "" },
      acf: {
        section_hero: {
          titre: "Bienvenue",
          "sous-titre": "Site en construction",
          chapeau: "Configurez votre WordPress pour voir le contenu réel.",
        },
        historique: {
          titre: "Notre histoire",
          "sous-titre": "Découvrez notre parcours",
          liste_des_liens: [],
        },
      },
    };
  }
}

export async function getAboutPageData(): Promise<AboutPageData | null> {
  try {
    console.warn("[v0] Fetching about page ACF data");

    // Try to fetch the about page by slug
    const page = await getPageBySlug("a-propos");

    if (page) {
      console.warn("[v0] About page found with slug 'a-propos'");
      console.warn(
        "[v0] About page ACF data:",
        page.acf ? "found" : "not found",
      );
      return page as AboutPageData;
    }

    console.warn("[v0] No about page found with slug 'a-propos'");
    console.warn("[v0] Please ensure:");
    console.warn("[v0] 1. A page exists in WordPress with slug 'a-propos'");
    console.warn("[v0] 2. The page is published (not draft)");
    console.warn("[v0] 3. ACF fields are properly configured on the page");
    console.warn("[v0] 4. WordPress REST API is accessible at:", WP_API_URL);

    return null;
  } catch (error) {
    console.error("[v0] Error fetching about page data:", error);
    return null;
  }
}

export async function getParticiperPageData(): Promise<ParticiperPageData | null> {
  try {
    console.warn("[v0] Fetching participer page ACF data");

    // Try to fetch the participer page by slug
    const page = await getPageBySlug("participer");

    if (page) {
      console.warn("[v0] Participer page found with slug 'participer'");
      console.warn(
        "[v0] Participer page ACF data:",
        page.acf ? "found" : "not found",
      );
      return page as ParticiperPageData;
    }

    console.warn("[v0] No participer page found with slug 'participer'");
    console.warn("[v0] Please ensure:");
    console.warn("[v0] 1. A page exists in WordPress with slug 'participer'");
    console.warn("[v0] 2. The page is published (not draft)");
    console.warn("[v0] 3. ACF fields are properly configured on the page");
    console.warn("[v0] 4. WordPress REST API is accessible at:", WP_API_URL);

    return null;
  } catch (error) {
    console.error("[v0] Error fetching participer page data:", error);
    return null;
  }
}

export async function getDoleancesPageData(): Promise<DoleancesPageData | null> {
  try {
    console.warn("[v0] Fetching les-doleances page ACF data");

    // Try to fetch the doleances page by slug
    const page = await getPageBySlug("les-doleances");

    if (page) {
      console.warn("[v0] Les Doléances page found with slug 'les-doleances'");
      console.warn(
        "[v0] Les Doléances page ACF data:",
        page.acf ? "found" : "not found",
      );
      return page as DoleancesPageData;
    }

    console.warn("[v0] No les-doleances page found with slug 'les-doleances'");
    console.warn("[v0] Please ensure:");
    console.warn(
      "[v0] 1. A page exists in WordPress with slug 'les-doleances'",
    );
    console.warn("[v0] 2. The page is published (not draft)");
    console.warn("[v0] 3. ACF fields are properly configured on the page");
    console.warn("[v0] 4. WordPress REST API is accessible at:", WP_API_URL);

    return null;
  } catch (error) {
    console.error("[v0] Error fetching les-doleances page data:", error);
    return null;
  }
}

export async function getDemanderDoleancesPageData(): Promise<DemanderDoleancesPageData | null> {
  try {
    console.warn("[v0] Fetching demander-les-doleances page ACF data");

    const page = await getPageBySlug("demander-les-doleances");

    if (page) {
      console.warn(
        "[v0] Demander les Doléances page found with slug 'demander-les-doleances'",
      );
      console.warn(
        "[v0] Demander les Doléances page ACF data:",
        page.acf ? "found" : "not found",
      );
      return page as DemanderDoleancesPageData;
    }

    console.warn(
      "[v0] No demander-les-doleances page found with slug 'demander-les-doleances'",
    );
    return null;
  } catch (error) {
    console.error(
      "[v0] Error fetching demander-les-doleances page data:",
      error,
    );
    return null;
  }
}

export async function getArchivePageTitles(): Promise<ArchivePageTitles | null> {
  try {
    console.warn(
      "[v0] Fetching archive page titles from custom theme endpoint",
    );

    const baseUrl = WP_API_URL.replace(/\/wp-json\/wp\/v2\/?$/, "");
    const customEndpoint = `${baseUrl}/wp-json/mytheme/v1/titres-pages-darchives`;


    const response = await fetch(customEndpoint, {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn(
        `[v0] ✗ WordPress endpoint returned status ${response.status}`,
      );
      return null;
    }

    const data = await validateJsonResponse(response);

    const archiveTitles = data?.acf || data;

    if (archiveTitles && typeof archiveTitles === "object") {
      return archiveTitles as ArchivePageTitles;
    }

    return null;
  } catch (error) {
    console.error("[v0] ✗ Error fetching archive page titles:", error);
    return null;
  }
}

// Correction de la fonction getSocialLinks pour retourner le tableau attendu
export async function getSocialLinks(): Promise<any[]> {
  
    const baseUrl = WP_API_URL.replace(/\/wp-json\/wp\/v2\/?$/, "");
    const customEndpoint = `${baseUrl}/wp-json/mytheme/v1/titres-pages-darchives`;


  const response = await fetch(customEndpoint, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch social links: ${response.status}`);
  }

  const data = await response.json();

  console.log(data)
  // On attend data.acf.reseaux_sociaux (tableau)
  const socialLinks = data?.acf?.reseaux_sociaux || [];
  return Array.isArray(socialLinks) ? socialLinks : [];
}

export async function getLegalNoticePageData(slug: string = "mentions-legales"): Promise<LegalNoticePageData | null> {
  try {
    const page = await getPageBySlug(slug);

    if (page) {
      return page as LegalNoticePageData;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export function transformWordPressUrls(html: string): string {
  if (!html) return html;

  // Get WordPress domain from API URL
  const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "";
  const wpDomain = wpApiUrl.replace("/wp-json/wp/v2", "").replace(/\/$/, "");

  if (!wpDomain) return html;

  // Replace WordPress domain URLs with relative paths
  // Match href="https://wordpress-domain.com/page-slug" or href="https://wordpress-domain.com/page-slug/"
  const domainRegex = new RegExp(
    `href="${wpDomain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(/[^"]*)"`,
    "gi",
  );

  return html.replace(domainRegex, 'href="$1"');
}

// Utility function to decode HTML entities
export function decodeHtmlEntities(text: string): string {
  if (!text) return text;

  // Create a temporary element to decode HTML entities
  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  }

  // Server-side fallback: decode common HTML entities manually
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "")
    .replace(/&#8216;/g, "")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&eacute;/g, "é")
    .replace(/&egrave;/g, "è")
    .replace(/&ecirc;/g, "ê")
    .replace(/&agrave;/g, "à")
    .replace(/&acirc;/g, "â")
    .replace(/&ocirc;/g, "ô")
    .replace(/&ucirc;/g, "û")
    .replace(/&ccedil;/g, "ç")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
}
