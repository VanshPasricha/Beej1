"use client"

import type React from "react"

import { useEffect } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { Chatbot } from "@/components/chatbot"
import { TranslationWrapper } from "@/components/translation-wrapper"
import { LanguageSwitcher } from "@/components/language-switcher"
import Sidebar from "@/components/Sidebar"
import Logo from "@/components/Logo"

// Sidebar handles navigation rendering; no local navigation list here

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { t } = useTranslation()

  // Smooth reveal on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => el.classList.add("visible"))
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-orange-100">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Desktop topbar */}
        <div className="hidden lg:block bg-white/70 backdrop-blur border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <TranslationWrapper>
              <div className="flex items-center space-x-2">
                {/* Topbar logo with fallback */}
                <Logo size={96} />
                <span className="font-bold text-gray-900">{t("appName")}</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">{t("tagline")}</span>
              </div>
            </TranslationWrapper>
            <LanguageSwitcher inline />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 max-w-7xl mx-auto reveal animate-fade-in-up">{children}</main>
      </div>

      <Chatbot />
    </div>
  )
}