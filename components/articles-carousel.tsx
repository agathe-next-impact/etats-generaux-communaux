"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { WordPressPost } from "@/lib/wordpress"
import { formatDate, stripHtml } from "@/lib/wordpress"

interface ArticlesCarouselProps {
  posts: WordPressPost[]
}

export function ArticlesCarousel({ posts }: ArticlesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length)
  }

  if (posts.length === 0) {
    return null
  }

  const currentPost = posts[currentIndex]

  return (
    <div className="relative">
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-[#E73628]">
        <Link href={`/blog/${currentPost.slug}`}>
          <div className="relative h-64 overflow-hidden">
            {currentPost._embedded?.["wp:featuredmedia"]?.[0] ? (
              <Image
                src={currentPost._embedded["wp:featuredmedia"][0].source_url || "/placeholder.svg"}
                alt={currentPost._embedded["wp:featuredmedia"][0].alt_text || currentPost.title.rendered}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Pas d'image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {currentPost._embedded?.["wp:term"]?.[0]?.length > 0 && (
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {currentPost._embedded["wp:term"][0].slice(0, 2).map((category) => (
                  <Badge key={category.id} className="bg-[#F4E63C] text-black hover:bg-[#F4E63C]/90 font-bold">
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <time dateTime={currentPost.date}>{formatDate(currentPost.date)}</time>
                {currentPost._embedded?.author?.[0] && (
                  <>
                    <span>•</span>
                    <span>{currentPost._embedded.author[0].name}</span>
                  </>
                )}
              </div>

              <h3 className="text-xl font-bold leading-tight group-hover:text-[#E73628] transition-colors line-clamp-2">
                {currentPost.title.rendered}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {stripHtml(currentPost.excerpt.rendered).substring(0, 150)}...
              </p>
            </div>
          </CardContent>
        </Link>
      </Card>

      {posts.length > 1 && (
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="h-10 w-10 border-[#E73628] text-[#E73628] hover:bg-[#E73628] hover:text-white bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-[#E73628]" : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Aller à l'article ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="h-10 w-10 border-[#E73628] text-[#E73628] hover:bg-[#E73628] hover:text-white bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
