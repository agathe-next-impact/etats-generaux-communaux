import { sanitizeHtml } from "@/lib/sanitize"
import { YouTubeFacade } from "@/components/youtube-facade"

/** Décode les entités HTML courantes présentes dans le HTML oEmbed de WordPress. */
function decodeEntities(text: string): string {
  // &amp; d'abord : WordPress double-encode parfois (« &amp;apos; »). React ré-échappe à l'affichage.
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
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
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (parsed.pathname.startsWith("/embed/")) return `https://www.youtube-nocookie.com${parsed.pathname}${parsed.search}`
      const shorts = parsed.pathname.match(/^\/shorts\/([^/?]+)/)
      if (shorts) return `https://www.youtube-nocookie.com/embed/${shorts[1]}`
      const id = parsed.searchParams.get("v")
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
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

/** Extrait l'ID YouTube d'une URL d'embed (youtube.com ou youtube-nocookie.com). */
function getYouTubeEmbed(embedUrl: string | null): { id: string; search: string } | null {
  if (!embedUrl) return null
  const match = embedUrl.match(/^https:\/\/www\.youtube-nocookie\.com\/embed\/([A-Za-z0-9_-]{6,20})(\?.*)?$/)
  return match ? { id: match[1], search: match[2] || "" } : null
}

export function VideoEmbed({ video, title }: { video: string; title?: string }) {
  // Le champ ACF peut contenir le HTML oEmbed : on en extrait la source de l'iframe
  const iframeSrc = video.includes("<iframe") ? video.match(/src="([^"]+)"/)?.[1] : undefined
  const youtube = getYouTubeEmbed(toEmbedUrl(iframeSrc ? decodeEntities(iframeSrc) : video))
  if (youtube) {
    const iframeTitle = video.match(/title="([^"]*)"/)?.[1]
    const label = title || (iframeTitle ? decodeEntities(iframeTitle) : "Vidéo")
    return <YouTubeFacade videoId={youtube.id} search={youtube.search.replace(/^\?/, "")} title={label} />
  }

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
