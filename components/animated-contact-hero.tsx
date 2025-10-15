"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function AnimatedContactHero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[400px]">
      {/* Main Logo with Animation */}
      <div
        className={`relative transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <Image
          src="/images/design-mode/logo.png"
          alt="Les États Généraux Communaux"
          width={600}
          height={200}
          className="w-full max-w-2xl h-auto animate-pulse-slow"
          priority
        />
      </div>

      {/* Animated Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Yellow Speech Bubble - Top Left */}
        <div
          className={`absolute left-[10%] top-[20%] transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-45"
          }`}
        >
          <div className="w-16 h-16 bg-[#FFD700] rounded-lg animate-bounce-slow" style={{ animationDelay: "0s" }} />
        </div>

        {/* Yellow Star - Top Right */}
        <div
          className={`absolute right-[15%] top-[15%] transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-180"
          }`}
        >
          <div className="relative w-20 h-20 animate-spin-slow">
            <div className="absolute inset-0 bg-[#FFD700] transform rotate-45" />
            <div className="absolute inset-0 bg-[#FFD700]" />
          </div>
        </div>

        {/* Red Rectangle - Left */}
        <div
          className={`absolute left-[5%] top-[50%] transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
          }`}
        >
          <div className="w-12 h-20 bg-[#E73628] animate-float" style={{ animationDelay: "0.5s" }} />
        </div>

        {/* Red Cloud - Right */}
        <div
          className={`absolute right-[10%] top-[45%] transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
          }`}
        >
          <div className="relative w-16 h-12">
            <div className="absolute top-0 left-2 w-8 h-8 bg-[#E73628] rounded-full" />
            <div className="absolute top-2 left-0 w-10 h-8 bg-[#E73628] rounded-full" />
            <div className="absolute top-2 right-0 w-8 h-8 bg-[#E73628] rounded-full" />
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#E73628] rounded-b-lg" />
          </div>
        </div>

        {/* Red House - Bottom Right */}
        <div
          className={`absolute right-[20%] bottom-[10%] transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <div className="relative w-16 h-16">
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#E73628]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-[#E73628]" />
          </div>
        </div>

        {/* Green Base Wave */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-8 bg-[#4AAD33] transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{
            clipPath:
              "polygon(0 50%, 10% 30%, 20% 50%, 30% 30%, 40% 50%, 50% 30%, 60% 50%, 70% 30%, 80% 50%, 90% 30%, 100% 50%, 100% 100%, 0 100%)",
          }}
        />
      </div>
    </div>
  )
}
