"use client"

import { useEffect, useRef } from "react"
import type React from "react"
import { useInView } from "motion/react"
import { annotate } from "rough-notation"
import type { RoughAnnotation } from "rough-notation/lib/model"

type AnnotationAction = "highlight" | "underline" | "box" | "circle" | "strike-through" | "crossed-off" | "bracket"

interface HighlighterProps {
  children: React.ReactNode
  action?: AnnotationAction
  color?: string
  strokeWidth?: number
  animationDuration?: number
  iterations?: number
  padding?: number
  multiline?: boolean
  isView?: boolean
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const annotationRef = useRef<RoughAnnotation | null>(null)
  const hasAnimatedRef = useRef(false)

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  })

  const shouldShow = !isView || isInView

  useEffect(() => {
    if (!shouldShow || hasAnimatedRef.current) return

    const element = elementRef.current
    if (!element) return

    const annotationConfig = {
      type: action,
      color,
      strokeWidth,
      animationDuration,
      iterations,
      padding,
      multiline,
    }

    const annotation = annotate(element, annotationConfig)

    annotationRef.current = annotation
    annotationRef.current.show()

    setTimeout(() => {
      const svg = element.querySelector("svg")
      if (svg) {
        svg.style.zIndex = "-1"
        svg.style.pointerEvents = "none"
      }
    }, 0)

    hasAnimatedRef.current = true
  }, [shouldShow])

  useEffect(() => {
    return () => {
      if (annotationRef.current) {
        annotationRef.current.remove()
      }
    }
  }, [])

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent z-0 cursor-target">
      <span className="relative z-10">{children}</span>
    </span>
  )
}

export default Highlighter
