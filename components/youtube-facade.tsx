"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

interface YouTubeFacadeProps {
  videoId: string
  title: string
  /** Paramètres d'URL d'origine (start, list…) à conserver */
  search?: string
}

/**
 * Façade YouTube : affiche la vignette (servie par l'optimiseur d'images du site, donc sans
 * contact avec Google) et ne charge le lecteur (~1 Mo de JS) qu'au clic.
 */
export function YouTubeFacade({ videoId, title, search = "" }: YouTubeFacadeProps) {
  const [isActive, setIsActive] = useState(false)

  if (isActive) {
    const params = new URLSearchParams(search)
    params.set("autoplay", "1")
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setIsActive(true)}
      className="group absolute inset-0 w-full h-full cursor-pointer"
      aria-label={`Lire la vidéo : ${title}`}
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E73628] text-white shadow-lg group-hover:scale-110 group-focus-visible:scale-110 transition-transform">
          <Play className="h-7 w-7 translate-x-0.5 fill-current" aria-hidden="true" />
        </span>
      </span>
    </button>
  )
}
