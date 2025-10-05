import { Suspense } from "react"
import { getPosts, getCategories } from "@/lib/wordpress"
import { ArticleCard } from "@/components/article-card"
import { BlogFilters } from "@/components/blog-filters"
import { Pagination } from "@/components/pagination"
import { Card, CardContent } from "@/components/ui/card"
import { UnderlinedH1 } from "@/components/ui/underlined-heading"

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

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <div className="min-h-screen py-12 pt-[150px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Replace h1 with UnderlinedH1 */}
          <UnderlinedH1 className="text-4xl md:text-5xl text-foreground mb-4">Tous les articles</UnderlinedH1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explorez nos analyses, témoignages et réflexions sur l'engagement collectif et les mouvements sociaux.
          </p>
        </div>

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
