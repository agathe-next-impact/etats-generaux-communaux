"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { WordPressResource } from "@/lib/wordpress"
import { Download, Play, FileText, ExternalLink, Eye, Video } from "lucide-react"

interface ResourceCardProps {
  resource: WordPressResource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const description = resource.acf?.descriptif || "Aucune description disponible"
  const hasVideo = resource.acf?.video
  const hasFiles = resource.acf?.fichiers && resource.acf.fichiers.length > 0
  const firstFile = hasFiles ? resource.acf.fichiers[0] : null

  // Determine resource type based on available content
  const resourceType = hasVideo ? "video" : hasFiles ? "document" : "resource"

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-6 w-6" />
      case "document":
        return <FileText className="h-6 w-6" />
      default:
        return <Download className="h-6 w-6" />
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

  const handleAction = () => {
    if (typeof window === "undefined") return

    if (hasVideo && resource.acf?.video) {
      // Open video in new tab
      window.open(resource.acf.video, "_blank")
    } else if (hasFiles && resource.acf.fichiers) {
      resource.acf.fichiers.forEach((file, index) => {
        const fileUrl =
          typeof file.document === "string" ? file.document : file.document?.url || file.document?.guid?.rendered
        if (fileUrl && fileUrl.trim()) {
          setTimeout(() => {
            try {
              // Create a temporary link element for proper download
              const link = document.createElement("a")
              link.href = fileUrl
              link.download = file.titre_du_document || `fichier-${index + 1}`
              link.target = "_blank"
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            } catch (error) {
              console.error("Erreur lors du téléchargement:", error)
              // Fallback to window.open
              window.open(fileUrl, "_blank")
            }
          }, index * 500) // Stagger downloads by 500ms
        }
      })
    }
  }

  const getActionLabel = () => {
    if (hasVideo) return "Regarder"
    if (hasFiles) {
      const fileCount = resource.acf.fichiers.length
      return fileCount === 1 ? "Télécharger" : `Télécharger (${fileCount})`
    }
    return "Voir plus"
  }

  const getActionIcon = () => {
    if (hasVideo) return <Play className="h-4 w-4 mr-2" />
    if (hasFiles) return <Download className="h-4 w-4 mr-2" />
    return <Eye className="h-4 w-4 mr-2" />
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`p-3 rounded-lg border ${getResourceColor(resourceType)} group-hover:scale-105 transition-transform`}
          >
            {getResourceIcon(resourceType)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors mb-2">
              {resource.title.rendered}
            </h3>
            <Badge variant="outline" className="text-xs">
              {resourceType.toUpperCase()}
            </Badge>
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
          {description.length > 150 ? `${description.substring(0, 150)}...` : description}
        </p>

        {hasFiles && resource.acf.fichiers.length > 1 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">{resource.acf.fichiers.length} fichiers disponibles</p>
            <div className="flex flex-wrap gap-1">
              {resource.acf.fichiers.slice(0, 3).map((file, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {file.titre_du_document || `Fichier ${index + 1}`}
                </Badge>
              ))}
              {resource.acf.fichiers.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{resource.acf.fichiers.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          {hasVideo || hasFiles ? (
            <Button onClick={handleAction} size="sm" className="flex-1">
              {getActionIcon()}
              {getActionLabel()}
            </Button>
          ) : (
            <Button asChild size="sm" className="flex-1">
              <Link href={`/ressources/${resource.slug}`}>
                <Eye className="h-4 w-4 mr-2" />
                Voir plus
              </Link>
            </Button>
          )}

          <Button asChild variant="outline" size="sm">
            <Link href={`/ressources/${resource.slug}`}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
