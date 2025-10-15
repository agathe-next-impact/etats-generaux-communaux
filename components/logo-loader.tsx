"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

interface LogoLoaderProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function LogoLoader({ size = "md", showText = true }: LogoLoaderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sizeClasses = {
    sm: "w-32 h-auto",
    md: "w-48 h-auto",
    lg: "w-64 h-auto",
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative">
        {/* Main logo with pulse animation */}
        <div className="animate-pulse-slow">
          <Image
            src="/images/logo.png"
            alt="Les États Généraux Communaux"
            width={256}
            height={80}
            className={sizeClasses[size]}
            priority
          />
        </div>

        {/* Animated dots overlay */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="h-2 w-2 rounded-full bg-[#8BC34A] animate-bounce [animation-delay:0ms]" />
          <div className="h-2 w-2 rounded-full bg-[#FFD700] animate-bounce [animation-delay:150ms]" />
          <div className="h-2 w-2 rounded-full bg-[#DC143C] animate-bounce [animation-delay:300ms]" />
        </div>
      </div>

      {showText && <p className="text-sm text-muted-foreground animate-fade-in mt-4">Chargement en cours...</p>}
    </div>
  )
}
