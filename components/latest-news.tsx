import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { WordPressPost } from "@/lib/wordpress"
import { formatDate, stripHtml, decodeHtmlEntities } from "@/lib/wordpress"

interface LatestNewsProps {
  posts: WordPressPost[]
}

export function LatestNews({ posts }: LatestNewsProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              <span className="bg-[#E73628] text-white px-4 py-2">DERNIÈRES</span>
              <span> actualités</span>
            </h2>
            <p className="text-muted-foreground text-lg">Les articles les plus récents de notre magazine</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/blog">
              Tous les articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
            const categories = post._embedded?.["wp:term"]?.[0] || []
            const excerpt = stripHtml(post.excerpt.rendered)

            return (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl border-2 hover:border-[#E73628]">
                  {featuredImage && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={featuredImage || "/placeholder.svg"}
                        alt={decodeHtmlEntities(post.title.rendered)}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <time className="text-sm text-muted-foreground font-medium">{formatDate(post.date)}</time>
                      {categories.length > 0 && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm font-bold text-[#4AAD33] uppercase">{categories[0].name}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-extrabold text-foreground mb-3 line-clamp-2 group-hover:text-[#E73628] transition-colors uppercase">
                      {decodeHtmlEntities(post.title.rendered)}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed font-medium">{excerpt}</p>
                    <div className="mt-4 flex items-center text-[#E73628] font-bold text-sm group-hover:gap-2 transition-all">
                      <span>Lire l'article</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
