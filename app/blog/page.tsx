export const dynamic = "force-dynamic"
import { Suspense } from "react"
import { getPosts, getCategories, getArchivePageTitles } from "@/lib/wordpress"
import { ArticleCard } from "@/components/article-card"
import { BlogFilters } from "@/components/blog-filters"
import { Pagination } from "@/components/pagination"
import { Card, CardContent } from "@/components/ui/card"
import { Highlighter } from "@/components/ui/highlighter"
import Image from "next/image"

interface BlogPageProps {
  searchParams: {
    page?: string
    search?: string
    category?: string
    sort?: string
  }
}

async function BlogContent({ searchParams }: BlogPageProps) {
  const page = Number.parseInt(searchParams.page || "1")
  const search = searchParams.search || ""
  const category = searchParams.category || ""
  const sort = searchParams.sort || "date"

  // Convert sort parameter to WordPress API format
  const getSortParams = (sort: string) => {
    switch (sort) {
      case "date_asc":
        return { orderby: "date", order: "asc" as const }
      case "title":
        return { orderby: "title", order: "asc" as const }
      case "title_desc":
        return { orderby: "title", order: "desc" as const }
      default:
        return { orderby: "date", order: "desc" as const }
    }
  }

  const sortParams = getSortParams(sort)

  const [{ posts, totalPages }, categories] = await Promise.all([
    getPosts({
      page,
      per_page: 12,
      search: search || undefined,
      categories: category || undefined,
      ...sortParams,
    }),
    getCategories(),
  ])

  return (
    <div className="space-y-8">
      <BlogFilters categories={categories} totalPosts={posts.length} />

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-foreground mb-2">Aucun article trouvé</h3>
          <p className="text-muted-foreground">Essayez de modifier vos critères de recherche ou de navigation.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} />
        </>
      )}
    </div>
  )
}

export const metadata = {
  title: "Actualités",
  description:
    "Explorez nos analyses, témoignages et réflexions sur la conversion écologique et sociale, l'engagement collectif et les mouvements citoyens.",
}

async function BlogHeader() {
  const pageTitles = await getArchivePageTitles()

  const title = pageTitles?.page_blog?.titre || "Tous les articles"
  const subtitle =
    pageTitles?.page_blog?.["sous-titre"] ||
    "Explorez nos analyses, témoignages et réflexions sur l'engagement collectif et les mouvements sociaux."

  return (
    <div className="text-center mb-12 relative">
      {/* Decorative pictos in background */}
      <Image
        src="/images/design-mode/picto200.png"
        alt=""
        width={80}
        height={80}
        className="absolute -top-8 left-[10%] opacity-20 rotate-12 pointer-events-none"
      />
      <Image
        src="/images/design-mode/picto205.png"
        alt=""
        width={60}
        height={60}
        className="absolute top-0 right-[15%] opacity-15 -rotate-6 pointer-events-none"
      />
      <Image
        src="/images/design-mode/picto207.png"
        alt=""
        width={50}
        height={50}
        className="absolute -bottom-4 left-[20%] opacity-20 rotate-45 pointer-events-none"
      />
      <Image
        src="/images/design-mode/picto204.png"
        alt=""
        width={70}
        height={70}
        className="absolute bottom-0 right-[10%] opacity-15 -rotate-12 pointer-events-none"
      />

      <h1 className="text-4xl md:text-5xl text-foreground mb-4 font-black uppercase font-raleway">
        <Highlighter
          action="underline"
          color="#E73628"
          strokeWidth={4}
          animationDuration={600}
          iterations={1}
          isView={true}
        >
          {title}
        </Highlighter>
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
    </div>
  )
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <div className="min-h-screen py-12 pt-[150px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="text-center mb-12">
              <div className="h-12 bg-muted rounded animate-pulse mb-4" />
              <div className="h-6 bg-muted rounded max-w-2xl mx-auto animate-pulse" />
            </div>
          }
        >
          <BlogHeader />
        </Suspense>

        <Suspense
          fallback={
            <div className="space-y-8">
              {/* Filters Skeleton */}
              <div className="space-y-4">
                <div className="h-10 bg-muted rounded animate-pulse" />
                <div className="flex gap-4">
                  <div className="h-10 bg-muted rounded flex-1 animate-pulse" />
                  <div className="h-10 bg-muted rounded flex-1 animate-pulse" />
                </div>
              </div>

              {/* Articles Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted" />
                    <CardContent className="p-6 space-y-3">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-6 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          }
        >
          <BlogContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}
