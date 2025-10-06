"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Users } from "lucide-react"
import { Highlighter } from "@/components/ui/highlighter"

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
}

export function HorizontalTimeline({ links }: HorizontalTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)

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

  return (
    <section className="py-16 lg:py-20 bg-white border-b border-border overflow-hidden">
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
              Notre histoire
            </Highlighter>
          </h2>
          <p className="text-muted-foreground text-lg">Découvrez les étapes clés de notre parcours</p>
        </div>

        <div ref={timelineRef} className="relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#F4E63C] via-[#4AAD33] to-[#E73628] hidden md:block" />

          <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-4">
            {links.map((link, index) => {
              const isEven = index % 2 === 0
              const colorIndex = index % 3
              const bgColor = colorIndex === 0 ? "#F4E63C" : colorIndex === 1 ? "#4AAD33" : "#E73628"
              const highlightColor = colorIndex === 0 ? "#F4E63C" : colorIndex === 1 ? "#B4D19F" : "#E73628"

              return (
                <Link
                  key={index}
                  href={link.lien?.url || "#"}
                  target={link.lien?.target || "_self"}
                  data-timeline-item
                  data-index={index}
                  className="group flex-1 relative"
                >
                  <div className="flex flex-col items-center gap-4 md:hidden">
                    {/* Date label */}
                    <div className="text-center">
                      <div
                        className="block w-48 px-6 py-3 rounded-lg transition-all duration-300 group-hover:shadow-lg"
                        style={{ backgroundColor: `${bgColor}1A` }}
                      >
                        <span className="text-sm font-bold uppercase text-foreground">
                          <Highlighter
                            action="highlight"
                            color={highlightColor}
                            strokeWidth={3}
                            animationDuration={600}
                            iterations={1}
                            padding={8}
                            isView={true}
                          >
                            {link.libelle}
                          </Highlighter>
                        </span>
                      </div>
                    </div>

                    {/* Icon circle */}
                    <div
                      className="relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl flex-shrink-0"
                      style={{ backgroundColor: bgColor }}
                    >
                      {link.icone?.url ? (
                        <Image
                          src={link.icone.url || "/placeholder.svg"}
                          alt={link.icone.alt || ""}
                          width={56}
                          height={56}
                          className="transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <Users className="w-14 h-14 text-white transition-transform duration-300 group-hover:scale-110" />
                      )}
                    </div>

                    {/* Description text */}
                    {link.texte && (
                      <div className="text-center max-w-[200px]">
                        <p className="text-sm text-muted-foreground leading-relaxed">{link.texte}</p>
                      </div>
                    )}
                  </div>

                  <div className="hidden md:flex flex-col items-center h-full">
                    {/* Top section - date and icon for even indices, text for odd indices */}
                    <div className={`flex flex-col items-center ${isEven ? "h-[220px] justify-end mb-4" : "mb-4"}`}>
                      {isEven ? (
                        <>
                          {/* Date label */}
                          <div className="text-center mb-4">
                            <div
                              className="block w-48 px-6 py-3 rounded-lg transition-all duration-300 group-hover:shadow-lg"
                              style={{ backgroundColor: `${bgColor}1A` }}
                            >
                              <span className="text-sm md:text-base font-bold uppercase text-foreground">
                                <Highlighter
                                  action="highlight"
                                  color={highlightColor}
                                  strokeWidth={3}
                                  animationDuration={600}
                                  iterations={1}
                                  padding={8}
                                  isView={true}
                                >
                                  {link.libelle}
                                </Highlighter>
                              </span>
                            </div>
                          </div>
                          {/* Icon circle */}
                          <div
                            className="relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl flex-shrink-0"
                            style={{ backgroundColor: bgColor }}
                          >
                            {link.icone?.url ? (
                              <Image
                                src={link.icone.url || "/placeholder.svg"}
                                alt={link.icone.alt || ""}
                                width={56}
                                height={56}
                                className="transition-transform duration-300 group-hover:scale-110"
                              />
                            ) : (
                              <Users className="w-14 h-14 text-white transition-transform duration-300 group-hover:scale-110" />
                            )}
                          </div>
                        </>
                      ) : (
                        link.texte && (
                          <div className="text-center max-w-[200px] h-[160px] flex items-start justify-center">
                            <p className="text-sm text-muted-foreground leading-relaxed">{link.texte}</p>
                          </div>
                        )
                      )}
                    </div>

                    {/* Center dot on timeline */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-4 border-foreground transition-all duration-300 group-hover:scale-150 group-hover:border-[#E73628] z-20" />

                    {/* Bottom section - text for even indices, date and icon for odd indices */}
                    <div className={`flex flex-col items-center ${isEven ? "mt-4" : "h-[220px] justify-start mt-4"}`}>
                      {isEven ? (
                        link.texte && (
                          <div className="text-center max-w-[200px] h-[160px] flex items-start justify-center">
                            <p className="text-sm text-muted-foreground leading-relaxed">{link.texte}</p>
                          </div>
                        )
                      ) : (
                        <>
                          {/* Icon circle */}
                          <div
                            className="relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl flex-shrink-0 mb-4"
                            style={{ backgroundColor: bgColor }}
                          >
                            {link.icone?.url ? (
                              <Image
                                src={link.icone.url || "/placeholder.svg"}
                                alt={link.icone.alt || ""}
                                width={56}
                                height={56}
                                className="transition-transform duration-300 group-hover:scale-110"
                              />
                            ) : (
                              <Users className="w-14 h-14 text-white transition-transform duration-300 group-hover:scale-110" />
                            )}
                          </div>
                          {/* Date label */}
                          <div className="text-center">
                            <div
                              className="block w-48 px-6 py-3 rounded-lg transition-all duration-300 group-hover:shadow-lg"
                              style={{ backgroundColor: `${bgColor}1A` }}
                            >
                              <span className="text-sm md:text-base font-bold uppercase text-foreground">
                                <Highlighter
                                  action="highlight"
                                  color={highlightColor}
                                  strokeWidth={3}
                                  animationDuration={600}
                                  iterations={1}
                                  padding={8}
                                  isView={true}
                                >
                                  {link.libelle}
                                </Highlighter>
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
