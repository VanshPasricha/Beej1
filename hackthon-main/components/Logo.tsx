"use client"

import { useState, useMemo } from "react"
import Image from "next/image"

type LogoProps = {
  size?: number // px
  className?: string
  alt?: string
}

export default function Logo({ size = 36, className = "", alt = "BeejSetu" }: LogoProps) {
  const [srcIndex, setSrcIndex] = useState(0)
  // Try SVG first (if provided), then PNG, then placeholder
  const sources = useMemo(
    () => [
      "/beejsetu-logo.png.jpeg", // user's current file
      "/beejsetu-logo.svg",
      "/beejsetu-logo.png",
      "/placeholder-logo.png",
    ],
    []
  )
  const src = sources[Math.min(srcIndex, sources.length - 1)]

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      onError={() => setSrcIndex((i) => Math.min(i + 1, sources.length - 1))}
      priority
    />
  )
}
