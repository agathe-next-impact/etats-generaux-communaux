"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, Play, FileText, ExternalLink, Video } from "lucide-react"
import type { WordPressResource } from "@/lib/wordpress"

interface ResourcePageClientProps {
  resource: WordPressResource | null
}

export default function ResourcePageClient({ resource }: ResourcePageClientProps) {
  if (!resource) {
    notFound()
  }

  const hasVideo = resource.acf?.video
  const hasFiles = resource.acf?.fichiers && resource.acf.fichiers.length > 0
  const description = resource.acf?.descriptif
  const resourceType = hasVideo ? "video" : hasFiles ? "document" : "resource"

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
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "document":
        return "bg-red-500/10 text-red-600 border-red-200"
      default:
        return "bg-green-500/10 text-green-600 border-green-200"
    }
  }

  const handleVideoAction = () => {
    if (hasVideo && resource.acf?.video) {
      window.open(resource.acf.video, "_blank")
    }
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

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link href="/ressources" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour aux ressources
            </Link>
          </Button>

          <div className="flex items-start gap-6 mb-6">
            <div className={`p-4 rounded-lg border ${getResourceColor(resourceType)}`}>
              {getResourceIcon(resourceType)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
                {resource.title.rendered}
              </h1>
              <Badge variant="outline" className="mb-4">
                {resourceType.toUpperCase()}
              </Badge>
              {description && <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>}
            </div>
          </div>

          <div className="flex gap-4">
            {hasVideo && (
              <Button onClick={handleVideoAction} size="lg">
                <Play className="h-4 w-4 mr-2" />
                Regarder la vidéo
              </Button>
            )}
            {hasFiles && (
              <Button onClick={handleFileDownloads} size="lg">
                <Download className="h-4 w-4 mr-2" />
                Télécharger {resource.acf.fichiers.length > 1 ? `(${resource.acf.fichiers.length})` : ""}
              </Button>
            )}
            <Button variant="outline" size="lg">
              <ExternalLink className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>

        {resource.content?.rendered && resource.content.rendered.trim() && (
          <Card className="mb-8">
            <CardContent className="p-8">
              <div
                className="prose prose-lg max-w-none article-content"
                dangerouslySetInnerHTML={{ __html: resource.content.rendered }}
              />
            </CardContent>
          </Card>
        )}

        {hasFiles && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Fichiers disponibles</h2>
              <div className="space-y-4">
                {resource.acf.fichiers.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{file.titre_du_document || `Fichier ${index + 1}`}</h3>
                      {file.descriptif_du_document && (
                        <p className="text-sm text-muted-foreground mt-1">{file.descriptif_du_document}</p>
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
