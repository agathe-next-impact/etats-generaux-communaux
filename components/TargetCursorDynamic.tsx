"use client"
import dynamic from "next/dynamic"

const TargetCursor = dynamic(() => import("./target-cursor"), { ssr: false })

export default function TargetCursorDynamic() {
  return <TargetCursor />
}