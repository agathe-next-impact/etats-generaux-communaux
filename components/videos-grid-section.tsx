import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Highlighter } from "@/components/ui/highlighter"
import { sanitizeHtml } from "@/lib/sanitize"
import type { HomePageACF } from "@/lib/wordpress"

interface VideosGridSectionProps {
  acfData?: HomePageACF["section_videos"]
}

/**
 * Convertit une URL YouTube / Vimeo en URL d'embed.
 * Utilisé en secours si le champ ACF renvoie une URL brute au lieu du HTML oEmbed.
 */
function toEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url.trim())
    const host = parsed.hostname.replace(/^www\./, "")

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (parsed.pathname.startsWith("/embed/")) return url
      const shorts = parsed.pathname.match(/^\/shorts\/([^/?]+)/)
      if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`
      const id = parsed.searchParams.get("v")
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean).pop()
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null
    }
    if (host === "player.vimeo.com") return url
    return null
  } catch {
    return null
  }
}

function VideoEmbed({ video, title }: { video: string; title?: string }) {
  if (video.includes("<iframe")) {
    return (
      <div
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:absolute [&_iframe]:inset-0"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(video) }}
      />
    )
  }

  const embedUrl = toEmbedUrl(video)
  if (!embedUrl) return null

  return (
    <iframe
      src={embedUrl}
      title={title || "Vidéo"}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 w-full h-full"
    />
  )
}

export function VideosGridSection({ acfData }: VideosGridSectionProps) {
  if (!acfData) return null

  const videos = (acfData.videos || []).filter((item) => item?.video && item.video.trim() !== "")
  if (videos.length === 0) return null

  const ctaLabel = acfData.cta?.libelle || acfData.cta?.lien?.title
  const ctaUrl = acfData.cta?.lien?.url

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(acfData.titre || acfData["sous-titre"]) && (
          <div className="text-center mb-12">
            {acfData.titre && (
              <h2 className="text-3xl md:text-4xl uppercase text-foreground mb-4">
                <Highlighter
                  action="underline"
                  color="#E73628"
                  strokeWidth={3}
                  animationDuration={600}
                  iterations={1}
                  isView={true}
                >
                  {acfData.titre}
                </Highlighter>
              </h2>
            )}
            {acfData["sous-titre"] && (
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{acfData["sous-titre"]}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {videos.map((item, index) => {
            const isPortrait = item.format === "portrait"
            return (
              <figure key={index} className={isPortrait ? "max-w-xs mx-auto w-full" : ""}>
                <div
                  className={`relative w-full ${isPortrait ? "aspect-[9/16]" : "aspect-video"} rounded-2xl shadow-lg overflow-hidden border border-border bg-muted`}
                >
                  <VideoEmbed video={item.video!} title={item.titre} />
                </div>
                {item.titre && (
                  <figcaption className="mt-3 text-center text-foreground font-medium">{item.titre}</figcaption>
                )}
              </figure>
            )
          })}
        </div>

        {ctaLabel && ctaUrl && (
          <div className="mt-10 text-center">
            <Link href={ctaUrl} target={acfData.cta?.lien?.target || "_self"} className="inline-block">
              <Button size="lg" className="text-lg">
                {ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
