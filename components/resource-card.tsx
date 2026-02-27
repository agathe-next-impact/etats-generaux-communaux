"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { WordPressResource } from "@/lib/wordpress"
import { decodeHtmlEntities } from "@/lib/wordpress"
import { Download, Play, FileText, ExternalLink, Eye, Video } from "lucide-react"
import Image from "next/image"

interface ResourceCardProps {
  resource: WordPressResource
}

const pictos = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%201-YFeeOd4CBQ2S2bGA4pPLgNc6hMYIPd.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%202-XT3JEJBM0RTr1nZ4p7W1zXmIKbvoE1.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%203-iph3iRcbh4GzoswUQo87W7giQs9vrW.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%204-ac6W7GEoGBcgE6fyqHJLr2EBOsnw7u.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%205-1otn1kQK9Cg25uM98EKKPTXzxXhRq2.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%207-ortOMnxOuv7texPH3RxLJTGkLhXhuQ.png",
]

export function ResourceCard({ resource }: ResourceCardProps) {
  const description = decodeHtmlEntities(resource.acf?.descriptif || "")
  const title = decodeHtmlEntities(resource.title.rendered)
  const hasVideos = resource.acf?.videos && resource.acf.videos.length > 0
  const hasFiles = resource.acf?.fichiers && resource.acf.fichiers.length > 0

  // Determine resource type based on available content
  const resourceType = hasVideos ? "video" : hasFiles ? "document" : "resource"

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
        return "bg-[#E73628]/10 text-[#E73628] border-[#E73628]"
      case "document":
        return "bg-[#4AAD33]/10 text-[#4AAD33] border-[#4AAD33]"
      default:
        return "bg-[#F4E63C]/10 text-black border-[#F4E63C]"
    }
  }

  const handleAction = () => {
    if (typeof window === "undefined") return

    if (hasVideos) {
      // Navigate to resource detail page for videos
      window.location.href = `/ressources/${resource.acf?.slug ?? resource.id}`
    } else if (hasFiles && resource.acf && resource.acf.fichiers) {
      resource.acf.fichiers.forEach((file: typeof resource.acf.fichiers[number], index: number) => {
        // Récupère l'URL publique du média WordPress (champ source_url ou url)
        let fileUrl = undefined;
        if (typeof file.document === "string") {
          fileUrl = file.document;
        } else if (file.document) {
          fileUrl = file.document.source_url || file.document.url || file.document.guid?.rendered;
        }
        if (fileUrl && fileUrl.trim()) {
          setTimeout(() => {
            try {
              // Create a temporary link element for proper download
              const link = document.createElement("a");
              link.href = fileUrl;
              link.download = decodeHtmlEntities(file.titre_du_document || `fichier-${index + 1}`);
              link.target = "_blank";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } catch (error) {
              console.error("Erreur lors du téléchargement:", error);
              // Fallback to window.open
              window.open(fileUrl, "_blank");
            }
          }, index * 500); // Stagger downloads by 500ms
        }
      });
    }
  }

  const getActionLabel = () => {
    if (hasVideos) return "Regarder"
    if (hasFiles) {
      const fileCount = resource.acf?.fichiers?.length ?? 0
      return fileCount === 1 ? "Télécharger" : `Télécharger (${fileCount})`
    }
    return "Voir plus"
  }

  const getActionIcon = () => {
    if (hasVideos) return <Play className="h-4 w-4 mr-2" />
    if (hasFiles) return <Download className="h-4 w-4 mr-2" />
    return <Eye className="h-4 w-4 mr-2" />
  }

  const pictoUrl = pictos[resource.id % pictos.length]

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full border border-[#E73628] relative overflow-visible">
      <Image
        src={pictoUrl || "/placeholder.svg"}
        alt=""
        width={48}
        height={48}
        className="absolute -top-6 -right-6 opacity-60 pointer-events-none z-10 group-hover:scale-110 group-hover:rotate-12 transition-transform"
      />

      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <Link href={`/ressources/${resource.acf?.slug ?? resource.id}`}>
              <h3
                className="font-black text-lg leading-tight transition-colors mb-2 uppercase hover:text-[#E73628]"
                style={{ fontFamily: "Raleway, sans-serif" }}
              >
                {decodeHtmlEntities(title)}
              </h3>
            </Link>
            <Badge variant="outline" className="text-xs">
              {resourceType.toUpperCase()}
            </Badge>
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
          {description.length > 150 ? `${description.substring(0, 150)}...` : description}
        </p>

        {hasFiles && resource.acf && resource.acf.fichiers.length > 1 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">{resource.acf.fichiers.length} fichiers disponibles</p>
            <div className="flex flex-wrap gap-1">
              {resource.acf.fichiers.slice(0, 3).map(
                (
                  file: NonNullable<typeof resource.acf>["fichiers"][number],
                  index: number
                ) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {decodeHtmlEntities(file.titre_du_document || `Fichier ${index + 1}`)}
                  </Badge>
                )
              )}
              {resource.acf.fichiers.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{resource.acf.fichiers.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          {hasVideos || hasFiles ? (
            <Button onClick={handleAction} size="sm" className="flex-1 cursor-target">
              {getActionIcon()}
              {getActionLabel()}
            </Button>
          ) : (
            <Link href={`/ressources/${resource.acf?.slug ?? resource.id}`} className="flex-1">
              <Button size="sm" className="w-full flex items-center justify-center">
                <Eye className="h-4 w-4 mr-2" />
                Voir plus
              </Button>
            </Link>
          )}

          <Link href={`/ressources/${resource.acf?.slug ?? resource.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="text-[#E73628] hover:bg-[#E73628] hover:text-white flex items-center justify-center"
            >
              <ExternalLink className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
