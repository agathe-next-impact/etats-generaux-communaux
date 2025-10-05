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
          {/* Timeline line */}
          <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-[#F4E63C] via-[#4AAD33] to-[#E73628] hidden md:block" />

          {/* Timeline items */}
          <div className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-4">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.lien?.url || "#"}
                target={link.lien?.target || "_self"}
                data-timeline-item
                data-index={index}
                className="group flex flex-col items-center relative max-w-xs mx-auto md:mx-0"
              >
                {/* Icon circle */}
                <div
                  className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                    index % 3 === 0 ? "bg-[#F4E63C]" : index % 3 === 1 ? "bg-[#4AAD33]" : "bg-[#E73628]"
                  } group-hover:scale-110 group-hover:shadow-xl`}
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

                {/* Label */}
                <div className="mt-6 text-center">
                  <div
                    className={`inline-block px-6 py-3 rounded-lg transition-all duration-300 ${
                      index % 3 === 0 ? "bg-[#F4E63C]/10" : index % 3 === 1 ? "bg-[#4AAD33]/10" : "bg-[#E73628]/10"
                    } group-hover:shadow-lg`}
                  >
                    <span className="text-sm md:text-base font-bold uppercase text-foreground">
                      <Highlighter
                        action="highlight"
                        color={index % 3 === 0 ? "#F4E63C" : index % 3 === 1 ? "#B4D19F" : "#E73628"}
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

                {link.texte && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground leading-relaxed">{link.texte}</p>
                  </div>
                )}

                {/* Connector dot on timeline */}
                <div className="hidden md:block absolute top-16 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-4 border-foreground transition-all duration-300 group-hover:scale-150 group-hover:border-[#E73628]" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
