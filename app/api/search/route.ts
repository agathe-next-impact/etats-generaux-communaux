import { NextResponse } from "next/server"
import { getPosts, getEvents, getResources, stripHtml } from "@/lib/wordpress"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [] })
  }

  try {
    // Search in parallel across all content types
    const [postsData, events, resources] = await Promise.all([
      getPosts({ search: query, per_page: 5 }),
      getEvents({ search: query }),
      getResources({ search: query }),
    ])

    const posts = postsData.posts

    // Format articles
    const articleResults = posts.slice(0, 5).map((post) => ({
      type: "article" as const,
      id: post.id,
      title: post.title.rendered,
      excerpt: stripHtml(post.excerpt.rendered).substring(0, 150) + "...",
      url: `/blog/${post.slug}`,
      date: post.date,
      category: post._embedded?.["wp:term"]?.[0]?.[0]?.name,
    }))

    // Format events
    const eventResults = events.slice(0, 5).map((event) => ({
      type: "event" as const,
      id: event.id,
      title: event.title.rendered,
      excerpt: event.acf?.description
        ? stripHtml(event.acf.description).substring(0, 150) + "..."
        : stripHtml(event.excerpt.rendered).substring(0, 150) + "...",
      url: `/evenements/${event.slug}`,
      date: event.acf?.date,
      location: event.acf?.lieu?.address,
    }))

    // Format resources
    const resourceResults = resources.slice(0, 5).map((resource) => ({
      type: "resource" as const,
      id: resource.id,
      title: resource.title.rendered,
      excerpt: resource.acf?.descriptif
        ? stripHtml(resource.acf.descriptif).substring(0, 150) + "..."
        : stripHtml(resource.content.rendered).substring(0, 150) + "...",
      url: `/ressources/${resource.id}`,
      fileType: resource.acf?.video ? "video" : resource.acf?.fichiers?.[0] ? "pdf" : "document",
    }))

    // Combine and limit total results
    const allResults = [...articleResults, ...eventResults, ...resourceResults].slice(0, 10)

    return NextResponse.json({ results: allResults })
  } catch (error) {
    console.error("[v0] Search API error:", error)
    return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 })
  }
}
