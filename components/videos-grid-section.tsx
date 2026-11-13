import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Highlighter } from "@/components/ui/highlighter"
import { VideoEmbed } from "@/components/video-embed"
import type { HomePageACF } from "@/lib/wordpress"

interface VideosGridSectionProps {
  acfData?: HomePageACF["section_videos"]
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
