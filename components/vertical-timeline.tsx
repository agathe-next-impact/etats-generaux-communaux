"use client"

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

  if (!links || links.length === 0) {
    return null
  }

  const calculatePosition = (index: number, total: number) => {
    const xPercent = 10 + (index / (total - 1)) * 60 // Reduced horizontal spread from 80% to 60% (10% to 70% instead of 10% to 90%)
    const normalizedX = (index / (total - 1)) * 2.5
    const yPercent = ((Math.exp(normalizedX) - 1) / (Math.exp(2.5) - 1)) * 75 // Increased vertical height from 50% to 75% for a taller curve

    return { x: xPercent, y: 100 - yPercent }
  }

  const generateCurvePath = () => {
    const points: { x: number; y: number }[] = []
    const numPoints = 50 // Number of points to create smooth curve

    for (let i = 0; i < numPoints; i++) {
      const normalizedX = (i / (numPoints - 1)) * 2.5
      const yPercent = ((Math.exp(normalizedX) - 1) / (Math.exp(2.5) - 1)) * 75
      const y = 100 - yPercent

      // Map to SVG coordinates (viewBox is 200x600)
      // Add offset to position curve to the right of timeline
      const svgX = 160 // Fixed x position on the right
      const svgY = (y / 100) * 600

      points.push({ x: svgX, y: svgY })
    }

    // Create SVG path from points (starting from bottom)
    let pathData = `M ${points[points.length - 1].x} ${points[points.length - 1].y}`

    // Use quadratic bezier curves for smooth path
    for (let i = points.length - 2; i >= 0; i--) {
      const current = points[i]
      const next = i > 0 ? points[i - 1] : current

      // Control point for smooth curve
      const cpX = (current.x + next.x) / 2
      const cpY = (current.y + next.y) / 2

      pathData += ` Q ${current.x} ${current.y}, ${cpX} ${cpY}`
    }

    // End at the first point
    pathData += ` L ${points[0].x} ${points[0].y}`

    return pathData
  }

  return (
    <section className="pt-8 lg:pt-12 pb-24 lg:pb-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-3xl md:text-4xl uppercase text-foreground mb-4">
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
            {subtitle && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}

        <div className="relative w-full h-[700px] md:h-[600px] px-8">
          {/* Abstract brush stroke shapes in background */}
          {/* Red brush stroke - top right */}
          <motion.div
            initial={{ opacity: 0, rotate: -15 }}
            whileInView={{ opacity: 0.15, rotate: -15 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute right-[15%] top-[10%] z-0 pointer-events-none"
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
            className="absolute left-[8%] top-[35%] z-0 pointer-events-none"
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
            className="absolute left-[40%] bottom-[15%] z-0 pointer-events-none"
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
            className="absolute right-[20%] bottom-[25%] z-0 pointer-events-none"
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
            whileInView={{ opacity: 0.15, rotate: -30 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute left-[15%] top-[8%] z-0 pointer-events-none"
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
            whileInView={{ opacity: 0.1, rotate: 15 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute right-[10%] top-[45%] z-0 pointer-events-none"
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
            className="absolute right-[3%] top-0 z-0 pointer-events-none"
            style={{ width: "200px", height: "100%" }}
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
            className="absolute left-[5%] top-[15%] z-0 pointer-events-none"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%202-Allt0KXskMwCx01xWaeq3g0nHDbdGC.png"
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
            className="absolute left-[2%] top-[50%] z-0 pointer-events-none"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%205-1otn1kQK9Cg25uM98EKKPTXzxXhRq2.png"
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
            className="absolute left-[25%] top-[40%] z-0 pointer-events-none"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%201-YFeeOd4CBQ2S2bGA4pPLgNc6hMYIPd.png"
              alt="Decorative element"
              width={100}
              height={100}
              className="object-contain opacity-50"
            />
          </motion.div>

          {/* Timeline Items */}
          {links.map((link, index) => {
            const position = calculatePosition(index, links.length)
            const isHovered = hoveredIndex === index

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
                  zIndex: isHovered ? 100 : 20,
                }}
                animate={{
                  x: isHovered ? (position.x < 20 ? "-25%" : position.x > 80 ? "-75%" : "-50%") : "-50%",
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
                <Link href={link.lien?.url || "#"} target={link.lien?.target || "_self"} className="block">
                  {/* Default State: Just the date */}
                  {!isHovered && (
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
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
                        className="w-12 h-12"
                      >
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%207-TzbPgilWj5Rsz4vNUFlM4w2vR6J4LL.png"
                          alt="Timeline marker"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </motion.div>

                      {/* Date Label */}
                      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <p className="text-sm font-bold text-foreground uppercase bg-white px-3 py-1 rounded-full shadow-md border-2 border-[#E73628]">
                          {link.libelle}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Hover State: Full card with description */}
                  {isHovered && (
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
                      className="w-64 bg-white border-4 border-[#E73628] rounded-lg p-6 shadow-2xl"
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
                        <h3 className="text-lg font-bold text-foreground mb-3 text-center uppercase">{link.libelle}</h3>
                      )}

                      {/* Text */}
                      {link.texte && (
                        <p className="text-sm text-muted-foreground leading-relaxed text-center">{link.texte}</p>
                      )}
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
