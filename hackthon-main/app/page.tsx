"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Logo from "@/components/Logo"
import { Globe, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { RegionSelector } from "@/components/region-selector"

// Languages handled globally via LanguageSwitcher

export default function HomePage() {
  const { t } = useTranslation()
  const [showLanguageSelection, setShowLanguageSelection] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem("beejsetu-language")
    if (savedLanguage) {
      setShowLanguageSelection(false)
    }
  }, [])

  const handleContinue = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setShowLanguageSelection(false)
      setIsAnimating(false)
    }, 300)
  }

  const handleChangeLanguage = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setShowLanguageSelection(true)
      setIsAnimating(false)
    }, 200)
  }

  if (showLanguageSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-orange-100 flex items-center justify-center p-0">
        <Card
          className={`w-full max-w-md shadow-xl border-0 transition-all duration-500 ease-out transform ${
            isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <CardContent className="p-8 text-center">
            <div className="mb-8">
              <div className="w-[55px] h-[55px] rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 overflow-hidden">
                <Logo size={55} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("appName")}</h1>
              <p className="text-gray-600">{t("tagline")}</p>
            </div>

            <div className="mb-6">
              <Globe className="w-8 h-8 text-orange-500 mx-auto mb-3 transition-transform duration-300 hover:rotate-12" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{t("chooseLanguage")}</h2>
              <p className="text-sm text-gray-600">{t("selectLanguagePrompt")}</p>
            </div>

            <div className="space-y-3 text-left">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("language") || "Language"}</label>
                <LanguageSwitcher inline />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <RegionSelector inline />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-center">
              <Button onClick={handleContinue} className="bg-orange-500 hover:bg-orange-600 text-white">
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-orange-100 flex items-center justify-center p-0">
      <Card
        className={`w-full max-w-md shadow-xl border-0 transition-all duration-500 ease-out transform ${
          isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <CardContent className="p-8 text-center">
          <div className="w-[55px] h-[55px] rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110 overflow-hidden">
            <Logo size={55} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("appName")}</h1>
          <p className="text-gray-600 mb-8">{t("tagline")}</p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Link href={{ pathname: "/auth", query: { mode: "signin" } }}>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg">
                  Sign In
                </Button>
              </Link>
              <Link href={{ pathname: "/auth", query: { mode: "signup" } }}>
                <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50 bg-transparent transition-all duration-200 hover:scale-105 hover:shadow-md">
                  Sign Up
                </Button>
              </Link>
            </div>
            <Button
              variant="outline"
              className="w-full border-green-300 text-green-700 hover:bg-green-50 bg-transparent transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={handleChangeLanguage}
            >
              {t("changeLanguage")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
