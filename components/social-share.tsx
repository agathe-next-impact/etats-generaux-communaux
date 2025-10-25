"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Mail, Link2, MessageCircle } from "lucide-react"
import { useState } from "react"

interface SocialShareProps {
  url: string
  title: string
  description?: string
}

export function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = description ? encodeURIComponent(description) : ""

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "noopener,noreferrer,width=600,height=600")
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-foreground mr-2">Partager :</span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("facebook")}
        className="hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors"
        aria-label="Partager sur Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("twitter")}
        className="hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors"
        aria-label="Partager sur X (Twitter)"
      >
        <Twitter className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("linkedin")}
        className="hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors"
        aria-label="Partager sur LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("whatsapp")}
        className="hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors"
        aria-label="Partager sur WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("email")}
        className="hover:bg-muted transition-colors"
        aria-label="Partager par email"
      >
        <Mail className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className={`transition-colors ${copied ? "bg-green-500 text-white border-green-500" : "hover:bg-muted"}`}
        aria-label="Copier le lien"
      >
        <Link2 className="h-4 w-4" />
        {copied && <span className="ml-2 text-xs">Copié!</span>}
      </Button>
    </div>
  )
}
