"use client"

import { useEffect, useRef, useState } from "react"
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
  const [hasAnimated, setHasAnimated] = useState(false)
  const [elementSize, setElementSize] = useState({ width: 0, height: 0 })

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  })

  const shouldShow = !isView || isInView

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setElementSize({ width, height })
      }
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!shouldShow) return

    const element = elementRef.current
    if (!element) return

    // Remove old annotation if it exists
    if (annotationRef.current) {
      annotationRef.current.remove()
    }

    const annotationConfig = {
      type: action,
      color,
      strokeWidth,
      animationDuration: hasAnimated ? 0 : animationDuration,
      iterations: hasAnimated ? 1 : iterations,
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

    if (!hasAnimated) {
      setTimeout(() => {
        setHasAnimated(true)
      }, animationDuration)
    }
  }, [
    shouldShow,
    elementSize,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
    hasAnimated,
  ])

  useEffect(() => {
    return () => {
      if (annotationRef.current) {
        annotationRef.current.remove()
      }
    }
  }, [])

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent z-0">
      <span className="relative z-10">{children}</span>
    </span>
  )
}

export default Highlighter
