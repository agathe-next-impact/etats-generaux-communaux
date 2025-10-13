import { notFound } from "next/navigation"
import Link from "next/link"
import { getPost, getPosts, formatDate, stripHtml } from "@/lib/wordpress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArticleCard } from "@/components/article-card"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { Suspense } from "react"
import Highlighter from "@/components/ui/highlighter"

interface ArticlePageProps {
  params: {
    slug: string
  }
}

async function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const { posts } = await getPosts({ per_page: 2, orderby: "date", order: "desc" })
  const relatedPosts = posts.filter((post) => post.slug !== currentSlug).slice(0, 3)

  if (relatedPosts.length === 0) return null

  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-2xl font-black uppercase text-foreground mb-8"
          style={{ fontFamily: "Raleway, sans-serif" }}
        >
          <Highlighter
            action="underline"
            color="#E73628"
            strokeWidth={4}
            animationDuration={600}
            iterations={1}
            isView={true}
          >
            Articles similaires
          </Highlighter>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]
  const categories = post._embedded?.["wp:term"]?.[0] || []
  const author = post._embedded?.author?.[0]

  return (
    <article className="min-h-screen pt-32">
      {/* Article Header */}
      <header className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Back Button */}
            <Highlighter
              action="highlight"
              color="#B4D19F"
              strokeWidth={4}
              animationDuration={600}
              iterations={1}
              padding={6}
              isView={true}
            >
              <Button asChild variant="ghost" size="sm" className="mb-4">
                <Link href="/blog" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Retour aux articles
                </Link>
              </Button>
            </Highlighter>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <Badge
                    key={category.id}
                    style={{
                      backgroundColor: index % 3 === 0 ? "#E73628" : index % 3 === 1 ? "#F4E63C" : "#4AAD33",
                      color: index % 3 === 1 ? "#000" : "#fff",
                    }}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-foreground leading-tight text-balance"
              style={{ fontFamily: "Raleway, sans-serif" }}
            >
              <Highlighter
                action="underline"
                color="#E73628"
                strokeWidth={4}
                animationDuration={600}
                iterations={1}
                isView={true}
              >
                {post.title.rendered}
              </Highlighter>
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              {author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{author.name}</span>
                </div>
              )}
              {/*
              <Highlighter
                action="highlight"
                color="#94BF7E"
                strokeWidth={4}
                animationDuration={600}
                iterations={1}
                padding={8}
                isView={true}
              >
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </Highlighter>*/}
            </div>

            {/* Excerpt */}
            {post.excerpt.rendered && (
              <div
                className="text-lg text-muted-foreground leading-relaxed border-l-4 pl-6"
                style={{ borderColor: "#E73628" }}
              >
                <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="wordpress-content">
          <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </div>
      </div>

      {/* Related Articles */}
      <Suspense
        fallback={
          <section className="py-12 border-t border-border">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2
                className="text-2xl font-black uppercase text-foreground mb-8"
                style={{ fontFamily: "Raleway, sans-serif" }}
              >
                <Highlighter
                  action="underline"
                  color="#E73628"
                  strokeWidth={4}
                  animationDuration={600}
                  iterations={1}
                  isView={true}
                >
                  Articles similaires
                </Highlighter>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
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
          </section>
        }
      >
        <RelatedArticles currentSlug={params.slug} />
      </Suspense>
    </article>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: "Article non trouvé",
    }
  }

  const description = stripHtml(post.excerpt.rendered).substring(0, 160)
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]
  const author = post._embedded?.author?.[0]

  return {
    title: `${post.title.rendered} | Magazine Collectif`,
    description,
    authors: author ? [{ name: author.name }] : undefined,
    openGraph: {
      title: post.title.rendered,
      description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: author ? [author.name] : undefined,
      images: featuredImage
        ? [
            {
              url: featuredImage.source_url,
              width: featuredImage.media_details?.width,
              height: featuredImage.media_details?.height,
              alt: featuredImage.alt_text || post.title.rendered,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title.rendered,
      description,
      images: featuredImage ? [featuredImage.source_url] : undefined,
    },
  }
}
