import type { MetadataRoute } from "next"
import { getPosts, getEvents, getResources, getLocalGroups } from "@/lib/wordpress"

const SITE_URL = process.env.SITE_DOMAIN || "https://lesetatsgenerauxcommunaux.fr"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/a-propos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/participer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/les-doleances`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/demander-les-doleances`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/les-egc`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/evenements`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/ressources`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/groupes-locaux`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/recherche`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  try {
    // Fetch all dynamic content from WordPress
    const [postsData, events, resources, localGroups] = await Promise.all([
      getPosts({ per_page: 100 }).catch(() => ({ posts: [], totalPages: 0 })),
      getEvents().catch(() => []),
      getResources().catch(() => []),
      getLocalGroups().catch(() => []),
    ])

    // Generate blog post URLs
    const blogPosts: MetadataRoute.Sitemap = postsData.posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

    // Generate event URLs
    const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
      url: `${SITE_URL}/evenements/${event.id}`,
      lastModified: new Date(event.date),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

    // Generate resource URLs
    const resourcePages: MetadataRoute.Sitemap = resources.map((resource) => ({
      url: `${SITE_URL}/ressources/${resource.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))

    // Generate local group URLs
    const localGroupPages: MetadataRoute.Sitemap = localGroups.map((group) => ({
      url: `${SITE_URL}/groupes-locaux/${group.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))

    // Combine all pages
    return [...staticPages, ...blogPosts, ...eventPages, ...resourcePages, ...localGroupPages]
  } catch (error) {
    console.error("[v0] Error generating sitemap:", error)
    // Return at least the static pages if dynamic content fails
    return staticPages
  }
}
