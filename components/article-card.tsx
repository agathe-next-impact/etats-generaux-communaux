import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type WordPressPost, stripHtml, formatDate } from "@/lib/wordpress"

interface ArticleCardProps {
  post: WordPressPost
  featured?: boolean
}

export function ArticleCard({ post, featured = false }: ArticleCardProps) {
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]
  const categories = post._embedded?.["wp:term"]?.[0] || []
  const author = post._embedded?.author?.[0]

  const pictos = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%201-YFeeOd4CBQ2S2bGA4pPLgNc6hMYIPd.png", // picto 1
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%202-XT3JEJBM0RTr1nZ4p7W1zXmIKbvoE1.png", // picto 2
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%203-iph3iRcbh4GzoswUQo87W7giQs9vrW.png", // picto 3
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%204-ac6W7GEoGBcgE6fyqHJLr2EBOsnw7u.png", // picto 4
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%205-1otn1kQK9Cg25uM98EKKPTXzxXhRq2.png", // picto 5
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%207-ortOMnxOuv7texPH3RxLJTGkLhXhuQ.png", // picto 7
  ]
  const pictoUrl = pictos[post.id % pictos.length]

  return (
    <Card
      className={`group overflow-visible relative hover:shadow-lg transition-all duration-300 border-2 border-[#E73628] ${featured ? "md:col-span-2 md:row-span-2" : ""}`}
    >
      <Image
        src={pictoUrl || "/placeholder.svg"}
        alt=""
        width={featured ? 40 : 32}
        height={featured ? 40 : 32}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
      />

      <Link href={`/blog/${post.slug}`}>
        <div className={`relative ${featured ? "h-64 md:h-80" : "h-48"} overflow-hidden`}>
          {featuredImage ? (
            <Image
              src={featuredImage.source_url || "/placeholder.svg"}
              alt={featuredImage.alt_text || post.title.rendered}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Pas d'image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Categories overlay */}
          {categories.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {categories.slice(0, 2).map((category) => (
                <Badge key={category.id} className="bg-[#F4E63C] text-black hover:bg-[#F4E63C]/90 font-semibold">
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <CardContent className={`p-6 ${featured ? "md:p-8" : ""}`}>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {author && (
                <>
                  <span>•</span>
                  <span>{author.name}</span>
                </>
              )}
            </div>

            <h3
              className={`font-black leading-tight group-hover:text-[#E73628] transition-colors uppercase ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}
              style={{ fontFamily: "Raleway, sans-serif" }}
            >
              {post.title.rendered}
            </h3>

            <p className={`text-muted-foreground leading-relaxed ${featured ? "text-base md:text-lg" : "text-sm"}`}>
              {stripHtml(post.excerpt.rendered).substring(0, featured ? 200 : 120)}...
            </p>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
