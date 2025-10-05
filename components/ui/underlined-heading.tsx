import type React from "react"
import { cn } from "@/lib/utils"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

interface UnderlinedHeadingProps {
  children: React.ReactNode
  className?: string
  level?: 1 | 2
}

export function UnderlinedHeading({ children, className, level = 1 }: UnderlinedHeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <div className="relative inline-block">
      <Tag
        className={cn(
          "relative z-10 font-black uppercase",
          level === 1 && "text-3xl md:text-4xl lg:text-5xl",
          level === 2 && "text-2xl md:text-3xl lg:text-4xl",
          className,
        )}
      >
        {children}
      </Tag>
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-2 h-8 bg-no-repeat bg-center bg-contain opacity-80 -z-10"
        style={{
          backgroundImage: "url('/images/brush-underline.jpg')",
          backgroundSize: "100% 100%",
          width: "70%",
        }}
        aria-hidden="true"
      />
    </div>
  )
}

export function UnderlinedH1({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <UnderlinedHeading level={1} className={className}>
      {children}
    </UnderlinedHeading>
  )
}

export function UnderlinedH2({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <UnderlinedHeading level={2} className={className}>
      {children}
    </UnderlinedHeading>
  )
}
