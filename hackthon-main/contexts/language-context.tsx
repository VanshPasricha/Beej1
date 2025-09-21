"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Lang = "en" | "hi" | "ml" | "ta" | "kn" | "gom" | "tcy"
export type Region = string

export type LanguageContextValue = {
  lang: Lang
  setLang: (l: Lang) => void
  region: Region
  setRegion: (r: Region) => void
  t: (key: string, fallback?: string) => string
}

const DEFAULT_LANG: Lang = "en"
const STORAGE_KEY = "beejsetu-language"
const REGION_KEY = "beejsetu-region"

const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    appName: "BeejSetu",
    tagline: "Bridge to Sustainable Farming",
    language: "Language",
    english: "English",
    hindi: "Hindi",
    malayalam: "Malayalam",
    tamil: "Tamil",
    kannada: "Kannada",
    konkani: "Konkani",
    tulu: "Tulu",
  },
  hi: {
    appName: "बीजसेतु",
    tagline: "सतत् कृषि की सेतु",
    language: "भाषा",
    english: "अंग्रेज़ी",
    hindi: "हिन्दी",
    malayalam: "मलयालम",
    tamil: "तमिल",
    kannada: "कन्नड़",
    konkani: "कोंकणी",
    tulu: "तुलु",
  },
  ml: {
    appName: "ബീജ്സേതു",
    tagline: "സുസ്ഥിര കൃഷിയിലേക്ക് പാലം",
    language: "ഭാഷ",
    english: "ഇംഗ്ലീഷ്",
    hindi: "ഹിന്ദി",
    malayalam: "മലയാളം",
    tamil: "തമിഴ്",
    kannada: "കന്നഡ",
    konkani: "കൊങ്കണി",
    tulu: "തുളു",
  },
  ta: {
    appName: "பீஜ்சேது",
    tagline: "நிலைத்த விவசாயத்திற்கு பாலம்",
    language: "மொழி",
    english: "ஆங்கிலம்",
    hindi: "இந்தி",
    malayalam: "மலையாளம்",
    tamil: "தமிழ்",
    kannada: "கன்னடம்",
    konkani: "கொங்கணி",
    tulu: "துள்",
  },
  kn: {
    appName: "ಬೀಜಸೇತು",
    tagline: "ಸಮೃದ್ಧ ಕೃಷಿಗೆ ಸೇತು",
    language: "ಭಾಷೆ",
    english: "ಇಂಗ್ಲಿಷ್",
    hindi: "ಹಿಂದಿ",
    malayalam: "ಮಲಯಾಳಂ",
    tamil: "ತಮಿಳು",
    kannada: "ಕನ್ನಡ",
    konkani: "ಕೊಂಕಣಿ",
    tulu: "ತುಳು",
  },
  gom: {
    appName: "BeejSetu",
    tagline: "Sustainable Farmingachim Palloi",
    language: "Bhas",
    english: "Inglez",
    hindi: "Hindi",
    malayalam: "Malayalam",
    tamil: "Tamil",
    kannada: "Kannada",
    konkani: "Konkani",
    tulu: "Tulu",
  },
  tcy: {
    appName: "BeejSetu",
    tagline: "Sustainable Farming dā barpu",
    language: "Bāshe",
    english: "English",
    hindi: "Hindi",
    malayalam: "Malayalam",
    tamil: "Tamil",
    kannada: "Kannada",
    konkani: "Konkani",
    tulu: "Tulu",
  },
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG)
  const [region, setRegionState] = useState<Region>("Kerala")

  // Initialize from localStorage
  useEffect(() => {
    try {
      const saved = (localStorage.getItem(STORAGE_KEY) as Lang | null) || DEFAULT_LANG
      setLangState(saved)
      if (typeof document !== "undefined") document.documentElement.lang = saved
    } catch {}
    try {
      const savedRegion = (localStorage.getItem(REGION_KEY) as Region | null) || "Kerala"
      setRegionState(savedRegion)
    } catch {}
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {}
    if (typeof document !== "undefined") document.documentElement.lang = l
  }

  const setRegion = (r: Region) => {
    setRegionState(r)
    try {
      localStorage.setItem(REGION_KEY, r)
    } catch {}
  }

  const t = useMemo(() => {
    return (key: string, fallback?: string) => STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? fallback ?? key
  }, [lang])

  const value = useMemo<LanguageContextValue>(() => ({ lang, setLang, region, setRegion, t }), [lang, region, setLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
