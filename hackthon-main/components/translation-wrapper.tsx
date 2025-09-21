"use client"

import { useTranslation } from "@/hooks/use-translation"
import type { ReactNode } from "react"

interface TranslationWrapperProps {
  children: ReactNode
  className?: string
}

export function TranslationWrapper({ children, className = "" }: TranslationWrapperProps) {
  const { isTransitioning } = useTranslation()

  return (
    <div
      className={`transition-opacity duration-300 ease-in-out ${
        isTransitioning ? "opacity-0" : "opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  )
}
