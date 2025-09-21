"use client"

import { useState } from "react"
import { type Language, translations } from "@/lib/i18n"
import { useLanguage } from "@/contexts/language-context"

export function useTranslation() {
  const { lang, setLang } = useLanguage()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[lang] || translations.en

    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) break
    }

    // Fallback to English if translation not found
    if (value === undefined) {
      value = translations.en
      for (const k of keys) {
        value = value?.[k]
        if (value === undefined) break
      }
    }

    return value || key
  }

  const changeLanguage = (newLanguage: Language) => {
    setIsTransitioning(true)

    // Small delay to allow fade out animation
    setTimeout(() => {
      // Delegate the actual state change to the centralized LanguageContext
      setLang(newLanguage as any)

      // Reset transition state after content updates
      setTimeout(() => {
        setIsTransitioning(false)
      }, 150)
    }, 150)
  }

  return { t, language: lang as Language, changeLanguage, isTransitioning }
}
