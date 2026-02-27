"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, FileText, Video } from "lucide-react"
import type { WordPressResource } from "@/lib/wordpress"
import { decodeHtmlEntities } from "@/lib/wordpress"
import { Highlighter } from "@/components/ui/highlighter"

interface ResourcePageClientProps {
  resource: WordPressResource | null
}

export default function ResourcePageClient({ resource }: ResourcePageClientProps) {
  if (!resource) {
    notFound()
  }

  const videos = (resource.acf?.videos || [])
    .map((v: { video: string }) => {
      if (!v.video) return null
      const match = v.video.match(/src=["']([^"']+)["']/)
      return match ? match[1] : null
    })
    .filter(Boolean) as string[]
  const hasVideos = videos.length > 0
  const hasFiles = resource.acf?.fichiers && resource.acf.fichiers.length > 0
  const description = resource.acf?.descriptif ? decodeHtmlEntities(resource.acf.descriptif) : undefined
  const title = decodeHtmlEntities(resource.title.rendered)
  const resourceType = hasVideos ? "video" : hasFiles ? "document" : "resource"

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-8 w-8" />
      case "document":
        return <FileText className="h-8 w-8" />
      default:
        return <Download className="h-8 w-8" />
    }
  }

  const getResourceColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-[#E73628]/10 text-[#E73628] border-[#E73628]"
      case "document":
        return "bg-[#F4E63C]/10 text-[#44843F] border-[#F4E63C]"
      default:
        return "bg-[#4AAD33]/10 text-[#4AAD33] border-[#4AAD33]"
    }
  }

  const handleVideoAction = (url: string) => {
    window.open(url, "_blank")
  }

  const handleFileDownloads = () => {
    if (hasFiles && resource.acf?.fichiers) {
      resource.acf.fichiers.forEach((file, index) => {
        const fileUrl = file.document?.url
        if (fileUrl && fileUrl.trim()) {
          setTimeout(() => {
            try {
              const link = document.createElement("a")
              link.href = fileUrl
              link.download = file.titre_du_document || `fichier-${index + 1}`
              link.target = "_blank"
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            } catch (error) {
              console.error("Erreur lors du téléchargement:", error)
              window.open(fileUrl, "_blank")
            }
          }, index * 500)
        }
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource.title.rendered,
          text: description || resource.title.rendered,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Erreur lors du partage:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Lien copié dans le presse-papier!")
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
            <Button asChild size="sm" className="mb-0">
              <Link href="/ressources" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour aux ressources
              </Link>
            </Button>

          <div className="flex items-start gap-6 pt-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4 leading-tight uppercase font-[family-name:var(--font-raleway)]">
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
              <Badge variant="outline" className="mb-4 border-[#E73628] text-[#E73628]">
                {resourceType.toUpperCase()}
              </Badge>
              {description && <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>}
            </div>
          </div>
        </div>

        {resource.content?.rendered && resource.content.rendered.trim() && (
          <Card className="mb-8 border-2 border-[#E73628]">
            <CardContent className="p-8">
              <div
                className="prose prose-lg max-w-none article-content"
                dangerouslySetInnerHTML={{ __html: resource.content.rendered }}
              />
            </CardContent>
          </Card>
        )}

        {hasVideos && (
          <div className="mb-8">
            <h2 className="text-xl font-black mb-4 uppercase font-[family-name:var(--font-raleway)]">
              Vidéos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((url, index) => (
                <div key={index} className="aspect-video rounded-lg overflow-hidden border-2 border-[#E73628]">
                  <iframe
                    src={url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {hasFiles && (
          <div className="mb-8">
            <h2 className="text-xl font-black mb-4 uppercase font-[family-name:var(--font-raleway)]">
              Fichiers disponibles
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {resource.acf!.fichiers.map((file: any, index: number) => (
                <Card
                  key={index}
                  className="border-2 border-[#4AAD33] hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black truncate">
                        {decodeHtmlEntities(file.titre_du_document || `Fichier ${index + 1}`)}
                      </h3>
                      {file.descriptif_du_document && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {decodeHtmlEntities(file.descriptif_du_document)}
                        </p>
                      )}
                      {file.document && (
                        <div className="text-xs text-muted-foreground mt-2">
                          {file.document.filename} • {Math.round(file.document.filesize / 1024)} KB
                        </div>
                      )}
                    </div>
                    {file.document?.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-target hover:bg-[#4AAD33]/10 hover:border-[#4AAD33] transition-all duration-300 bg-transparent shrink-0"
                        onClick={() => {
                          const link = document.createElement("a")
                          link.href = file.document.url
                          link.download = file.titre_du_document || file.document.filename
                          link.target = "_blank"
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
