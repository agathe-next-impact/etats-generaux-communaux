"use client"

import type React from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Highlighter } from "@/components/ui/highlighter"
import { useState } from "react"

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

interface VerticalTimelineProps {
  links: TimelineLink[]
  title?: string
  subtitle?: string
}

export function VerticalTimeline({ links, title, subtitle }: VerticalTimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [clickedIndex, setClickedIndex] = useState<number | null>(null)

  if (!links || links.length === 0) {
    return null
  }

  const calculatePosition = (index: number, total: number) => {
    const xPercent = 10 + (index / (total - 1)) * 60
    const normalizedX = (index / (total - 1)) * 2.5
    const yPercent = ((Math.exp(normalizedX) - 1) / (Math.exp(2.5) - 1)) * 75

    return { x: xPercent, y: 100 - yPercent }
  }

  const generateCurvePath = () => {
    const points: { x: number; y: number }[] = []
    const numPoints = 50

    for (let i = 0; i < numPoints; i++) {
      const normalizedX = (i / (numPoints - 1)) * 2.5
      const yPercent = ((Math.exp(normalizedX) - 1) / (Math.exp(2.5) - 1)) * 75
      const y = 100 - yPercent

      const svgX = 160
      const svgY = (y / 100) * 600

      points.push({ x: svgX, y: svgY })
    }

    let pathData = `M ${points[points.length - 1].x} ${points[points.length - 1].y}`

    for (let i = points.length - 2; i >= 0; i--) {
      const current = points[i]
      const next = i > 0 ? points[i - 1] : current

      const cpX = (current.x + next.x) / 2
      const cpY = (current.y + next.y) / 2

      pathData += ` Q ${current.x} ${current.y}, ${cpX} ${cpY}`
    }

    pathData += ` L ${points[0].x} ${points[0].y}`

    return pathData
  }

  const handleItemClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    setClickedIndex(clickedIndex === index ? null : index)
  }

  return (
    <section className="pt-8 lg:pt-12 pb-24 lg:pb-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            {title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl uppercase text-foreground mb-4">
                <Highlighter
                  action="underline"
                  color="#E73628"
                  strokeWidth={3}
                  animationDuration={600}
                  iterations={1}
                  isView={true}
                >
                  {title}
                </Highlighter>
              </h2>
            )}
            {subtitle && (
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">{subtitle}</p>
            )}
          </div>
        )}

        {/* Mobile version - Reversed the order of links */}
        <div className="md:hidden space-y-8">
          {links
            .slice()
            .reverse()
            .map((link, index) => {
              const isActive = clickedIndex === index

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div onClick={(e) => handleItemClick(index, e)} className="cursor-pointer">
                    {!isActive && (
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-4 bg-white border border-[#E73628] rounded-lg p-4 shadow-md"
                      >
                        {/* Rotating star icon */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 8,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                          className="w-16 h-16 flex-shrink-0"
                        >
                          <Image
                            src="/images/design-mode/picto207.png"
                            alt="Timeline marker"
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                        </motion.div>

                        {/* Date Label */}
                        <div className="flex-1">
                          <p className="text-base font-bold text-foreground uppercase">{link.libelle}</p>
                          <p className="text-xs text-muted-foreground mt-1">Appuyez pour en savoir plus</p>
                        </div>

                        {/* Arrow indicator */}
                        <svg
                          className="w-6 h-6 text-[#E73628] flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    )}

                    {isActive && (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                        className="bg-white border border-[#E73628] rounded-lg p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Icon */}
                        {link.icone?.url && (
                          <div className="mb-4 flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-[#F4E63C] flex items-center justify-center">
                              <Image
                                src={link.icone.url || "/placeholder.svg"}
                                alt={link.icone.alt || ""}
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                          </div>
                        )}

                        {/* Label */}
                        {link.libelle && (
                          <h3 className="text-lg font-bold text-foreground mb-3 text-center uppercase">
                            {link.libelle}
                          </h3>
                        )}

                        {/* Text */}
                        {link.texte && (
                          <p className="text-sm text-muted-foreground leading-relaxed text-center mb-4">{link.texte}</p>
                        )}

                        {/* Link button */}
                        {link.lien?.url && (
                          <Link
                            href={link.lien.url}
                            target={link.lien.target || "_self"}
                            className="block text-center text-sm font-bold text-white bg-[#E73628] hover:bg-[#E73628]/90 transition-colors py-3 px-6 rounded-lg"
                          >
                            En savoir plus →
                          </Link>
                        )}

                        {/* Close button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setClickedIndex(null)
                          }}
                          className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Fermer
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )
            })}
        </div>

        {/* Desktop version - unchanged */}
        <div className="hidden md:block relative w-full h-[800px] lg:h-[600px] px-8">
          {/* Abstract brush stroke shapes in background */}
          {/* Red brush stroke - top right */}
          <motion.div
            initial={{ opacity: 0, rotate: -15 }}
            whileInView={{ opacity: 0.15, rotate: -15 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute right-[10%] sm:right-[15%] top-[8%] sm:top-[10%] z-0 pointer-events-none opacity-30 sm:opacity-50 md:opacity-100 scale-50 sm:scale-75 md:scale-100"
          >
            <svg width="180" height="120" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="brushRed1" x="-50%" y="-50%" width="200%" height="200%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" seed="1" />
                  <feDisplacementMap in="SourceGraphic" scale="6" />
                </filter>
              </defs>
              <ellipse cx="90" cy="60" rx="80" ry="50" fill="#E73628" filter="url(#brushRed1)" />
            </svg>
          </motion.div>

          {/* Yellow brush stroke - left middle */}
          <motion.div
            initial={{ opacity: 0, rotate: 25 }}
            whileInView={{ opacity: 0.2, rotate: 25 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="absolute left-[5%] sm:left-[8%] top-[30%] sm:top-[35%] z-0 pointer-events-none opacity-30 sm:opacity-50 md:opacity-100 scale-50 sm:scale-75 md:scale-100"
          >
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="brushYellow1" x="-50%" y="-50%" width="200%" height="200%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="2" />
                  <feDisplacementMap in="SourceGraphic" scale="5" />
                </filter>
              </defs>
              <circle cx="75" cy="75" r="60" fill="#F4E63C" filter="url(#brushYellow1)" />
            </svg>
          </motion.div>

          {/* Green brush stroke - bottom center */}
          <motion.div
            initial={{ opacity: 0, rotate: -10 }}
            whileInView={{ opacity: 0.12, rotate: -10 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="absolute left-[35%] sm:left-[40%] bottom-[12%] sm:bottom-[15%] z-0 pointer-events-none opacity-30 sm:opacity-50 md:opacity-100 scale-50 sm:scale-75 md:scale-100"
          >
            <svg width="200" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="brushGreen1" x="-50%" y="-50%" width="200%" height="200%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="3" />
                  <feDisplacementMap in="SourceGraphic" scale="7" />
                </filter>
              </defs>
              <rect x="10" y="10" width="180" height="60" rx="30" fill="#6CB33F" filter="url(#brushGreen1)" />
            </svg>
          </motion.div>

          {/* Red brush stroke - bottom right */}
          <motion.div
            initial={{ opacity: 0, rotate: 45 }}
            whileInView={{ opacity: 0.18, rotate: 45 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute right-[15%] sm:right-[20%] bottom-[20%] sm:bottom-[25%] z-0 pointer-events-none opacity-30 sm:opacity-50 md:opacity-100 scale-50 sm:scale-75 md:scale-100"
          >
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="brushRed2" x="-50%" y="-50%" width="200%" height="200%">
                  <feTurbulence type="fractalNoise" baseFrequency="1.0" numOctaves="4" seed="4" />
                  <feDisplacementMap in="SourceGraphic" scale="5" />
                </filter>
              </defs>
              <circle cx="50" cy="50" r="40" fill="#E73628" filter="url(#brushRed2)" />
            </svg>
          </motion.div>

          {/* Yellow brush stroke - top left */}
          <motion.div
            initial={{ opacity: 0, rotate: -30 }}
            whileInView={{ opacity: 1, rotate: -30 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute left-[5%] sm:left-[15%] top-[8%] sm:top-[10%] z-0 pointer-events-none hidden md:block"
          >
            <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="brushYellow2" x="-50%" y="-50%" width="200%" height="200%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="5" />
                  <feDisplacementMap in="SourceGraphic" scale="6" />
                </filter>
              </defs>
              <ellipse cx="60" cy="70" rx="50" ry="60" fill="#F4E63C" filter="url(#brushYellow2)" />
            </svg>
          </motion.div>

          {/* Green brush stroke - right middle */}
          <motion.div
            initial={{ opacity: 0, rotate: 15 }}
            whileInView={{ opacity: 1, rotate: 15 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute left-[2%] sm:left-[8%] top-[45%] sm:top-[50%] z-0 pointer-events-none hidden sm:block scale-50 sm:scale-75 md:scale-100"
          >
            <svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="brushGreen2" x="-50%" y="-50%" width="200%" height="200%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" seed="6" />
                  <feDisplacementMap in="SourceGraphic" scale="6" />
                </filter>
              </defs>
              <circle cx="65" cy="65" r="55" fill="#6CB33F" filter="url(#brushGreen2)" />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="absolute right-[1%] sm:right-[2%] md:right-[3%] top-0 z-0 pointer-events-none"
            style={{ width: "150px", height: "100%" }}
          >
            <svg
              viewBox="0 0 200 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              preserveAspectRatio="xMaxYMin meet"
            >
              <defs>
                <filter id="brushCurve" x="-50%" y="-50%" width="200%" height="200%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="5" />
                  <feDisplacementMap in="SourceGraphic" scale="4" />
                </filter>
              </defs>

              <motion.path
                d={generateCurvePath()}
                stroke="#6CB33F"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
                filter="url(#brushCurve)"
                opacity="0.8"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              />
            </svg>
          </motion.div>

          {/* Decorative picto image in upper left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute left-[5%] sm:left-[15%] top-[8%] sm:top-[10%] z-0 pointer-events-none hidden md:block"
          >
            <Image
              src="/images/design-mode/picto202.png"
              alt="Decorative element"
              width={200}
              height={200}
              className="object-contain opacity-80"
            />
          </motion.div>

          {/* Decorative picto image in left side middle */}
          <motion.div
            initial={{ opacity: 0, rotate: 20 }}
            whileInView={{ opacity: 1, rotate: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute left-[2%] sm:left-[8%] top-[45%] sm:top-[50%] z-0 pointer-events-none hidden sm:block scale-50 sm:scale-75 md:scale-100"
          >
            <Image
              src="/images/design-mode/picto205.png"
              alt="Decorative element"
              width={120}
              height={120}
              className="object-contain opacity-65"
            />
          </motion.div>

          {/* Decorative picto image in left bottom (smaller) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute left-[25%] top-[40%] z-0 pointer-events-none hidden md:block"
          >
            <Image
              src="/images/design-mode/picto200.png"
              alt="Decorative element"
              width={100}
              height={100}
              className="object-contain opacity-50"
            />
          </motion.div>

          {/* Timeline Items */}
          {links.map((link, index) => {
            const position = calculatePosition(index, links.length)
            const isActive = hoveredIndex === index || clickedIndex === index

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="absolute"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  zIndex: isActive ? 100 : 20,
                }}
                animate={{
                  x: isActive ? (position.x < 20 ? "-25%" : position.x > 80 ? "-75%" : "-50%") : "-50%",
                  y: "-50%",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  onClick={(e) => handleItemClick(index, e)}
                  className="cursor-pointer p-4 sm:p-2 md:p-0 -m-4 sm:-m-2 md:m-0"
                >
                  {!isActive && (
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="relative"
                    >
                      {/* Rotating star icon */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 8,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="w-20 h-20 sm:w-16 sm:h-16 md:w-12 md:h-12"
                      >
                        <Image
                          src="/images/design-mode/picto207.png"
                          alt="Timeline marker"
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </motion.div>

                      {/* Date Label */}
                      <div className="absolute top-full mt-5 sm:mt-3 md:mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <p className="text-base sm:text-sm font-bold text-foreground uppercase bg-white px-5 sm:px-4 py-2.5 sm:py-2 rounded-full shadow-md border border-[#E73628]">
                          {link.libelle}
                        </p>
                      </div>

                      {/* Tap indicator for mobile */}
                      <div className="absolute -bottom-16 sm:-bottom-10 md:-bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap md:hidden">
                        <p className="text-xs sm:text-[10px] text-muted-foreground font-medium">Appuyez</p>
                      </div>
                    </motion.div>
                  )}

                  {isActive && (
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.85, opacity: 0, y: 10 }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 25,
                        mass: 0.8,
                      }}
                      className="w-64 sm:w-72 md:w-64 bg-white border border-[#E73628] rounded-lg p-5 sm:p-6 shadow-2xl max-w-[90vw]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Icon */}
                      {link.icone?.url && (
                        <div className="mb-4 flex justify-center">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#F4E63C] flex items-center justify-center">
                            <Image
                              src={link.icone.url || "/placeholder.svg"}
                              alt={link.icone.alt || ""}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          </div>
                        </div>
                      )}

                      {/* Label */}
                      {link.libelle && (
                        <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 text-center uppercase">
                          {link.libelle}
                        </h3>
                      )}

                      {/* Text */}
                      {link.texte && (
                        <p className="text-sm sm:text-sm text-muted-foreground leading-relaxed text-center">
                          {link.texte}
                        </p>
                      )}

                      {/* Link button for better mobile UX */}
                      {link.lien?.url && (
                        <Link
                          href={link.lien.url}
                          target={link.lien.target || "_self"}
                          className="mt-4 block text-center text-sm font-bold text-[#E73628] hover:text-[#E73628]/80 transition-colors py-2 px-4 border border-[#E73628] rounded-lg hover:bg-[#E73628]/5"
                        >
                          En savoir plus →
                        </Link>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
