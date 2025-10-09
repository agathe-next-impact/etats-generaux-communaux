"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Highlighter } from "@/components/ui/highlighter"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface TimelineLink {
  libelle?: string
  lien?: {
    url: string
    title: string
    target: string
  }
  texte?: string
  icone?: {
    url: string
    alt: string
    width: number
    height: number
  }
}

interface HorizontalTimelineProps {
  links: TimelineLink[]
  title?: string
  subtitle?: string
}

export function HorizontalTimeline({ links, title, subtitle }: HorizontalTimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [popupPosition, setPopupPosition] = useState<"left" | "right">("right")
  const timelineRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const determinePopupPosition = (element: HTMLElement): "left" | "right" => {
    const rect = element.getBoundingClientRect()
    const screenWidth = window.innerWidth
    const popupWidth = 320 // w-80 = 320px
    const spaceOnRight = screenWidth - rect.right
    const spaceOnLeft = rect.left

    if (spaceOnRight < popupWidth + 20 && spaceOnLeft > popupWidth + 20) {
      return "left"
    }
    return "right"
  }

  const handleMouseEnter = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    setHoveredIndex(index)
    const position = determinePopupPosition(event.currentTarget)
    setPopupPosition(position)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            setActiveIndex(index)
          }
        })
      },
      {
        root: null,
        threshold: 0.5,
      },
    )

    const items = timelineRef.current?.querySelectorAll("[data-timeline-item]")
    items?.forEach((item) => observer.observe(item))

    return () => {
      items?.forEach((item) => observer.unobserve(item))
    }
  }, [])

  if (!links || links.length === 0) {
    return null
  }

  const generateWavePath = () => {
    if (links.length === 0) return ""

    const width = 100 // percentage
    const segmentWidth = width / (links.length - 1 || 1)
    const amplitude = 8 // height of wave in percentage

    let path = `M 0,50 ` // Start at left center

    for (let i = 0; i < links.length; i++) {
      const x = i * segmentWidth
      const isAbove = i % 2 === 0
      const y = isAbove ? 50 - amplitude : 50 + amplitude

      if (i === 0) {
        path += `L ${x},${y} `
      } else {
        const prevX = (i - 1) * segmentWidth
        const prevIsAbove = (i - 1) % 2 === 0
        const prevY = prevIsAbove ? 50 - amplitude : 50 + amplitude

        const controlX1 = prevX + segmentWidth * 0.5
        const controlY1 = prevY
        const controlX2 = x - segmentWidth * 0.5
        const controlY2 = y

        path += `C ${controlX1},${controlY1} ${controlX2},${controlY2} ${x},${y} `
      }
    }

    return path
  }

  return (
    <section className="py-16 lg:py-20 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl uppercase text-foreground mb-4">
            <Highlighter
              action="underline"
              color="#E73628"
              strokeWidth={3}
              animationDuration={600}
              iterations={1}
              isView={true}
            >
              {title || "Notre histoire"}
            </Highlighter>
          </h2>
          <p className="text-muted-foreground text-lg">{subtitle || "Découvrez les étapes clés de notre parcours"}</p>
        </div>

        <div ref={timelineRef} className="relative">
          <div className="absolute inset-0 hidden md:block" style={{ height: "200px" }}>
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F4E63C" />
                  <stop offset="50%" stopColor="#4AAD33" />
                  <stop offset="100%" stopColor="#E73628" />
                </linearGradient>
              </defs>
              <path
                d={generateWavePath()}
                fill="none"
                stroke="url(#waveGradient)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <div
            ref={containerRef}
            className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-4 relative"
            style={{ minHeight: "200px", paddingTop: "100px", paddingBottom: "100px" }}
          >
            {links.map((link, index) => {
              const isAbove = index % 2 === 0

              return (
                <div
                  key={index}
                  data-timeline-item
                  data-index={index}
                  className="flex-1 relative flex items-center justify-center"
                  style={{ minHeight: "200px" }}
                  onMouseEnter={(e) => handleMouseEnter(index, e)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className={`flex flex-col items-center gap-3 relative ${isAbove ? "flex-col-reverse" : ""}`}>
                    <div className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer bg-white overflow-hidden">
                      {link.icone?.url ? (
                        <Image
                          src={link.icone.url || "/placeholder.svg"}
                          alt={link.icone.alt || link.libelle || "Timeline icon"}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">?</span>
                        </div>
                      )}
                    </div>

                    <div className="text-center relative z-20 bg-white px-2 py-1 rounded">
                      <span className="text-sm font-semibold text-foreground">{link.libelle}</span>
                    </div>

                    <AnimatePresence>
                      {hoveredIndex === index && link.texte && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, x: popupPosition === "right" ? -10 : 10 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9, x: popupPosition === "right" ? -10 : 10 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className={`absolute ${popupPosition === "right" ? "left-full ml-4" : "right-full mr-4"} top-1/2 -translate-y-1/2 z-[9999] w-80 max-w-[90vw] bg-white border-2 border-[#E73628] rounded-lg shadow-xl p-4`}
                          style={{ pointerEvents: "auto" }}
                        >
                          <div
                            className={`absolute ${popupPosition === "right" ? "-left-2" : "-right-2"} top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#E73628] ${popupPosition === "right" ? "border-r-0 border-b-0 -rotate-45" : "border-l-0 border-t-0 rotate-45"}`}
                          />
                          <div className="mb-3">
                            <span className="text-sm font-bold text-foreground">
                              <Highlighter
                                action="underline"
                                color="#E73628"
                                strokeWidth={2}
                                animationDuration={400}
                                iterations={1}
                                isView={true}
                              >
                                {link.libelle}
                              </Highlighter>
                            </span>
                          </div>

                          <p className="text-sm font-bold text-foreground leading-relaxed">{link.texte}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
