"use client"

import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"
import { Target, Trophy, Play, Bell, ShoppingBag } from "lucide-react"
import Logo from "@/components/Logo"

export default function Sidebar() {
  const { t } = useTranslation()
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 text-gray-900 flex flex-col pt-6 px-4">
      <div className="flex items-center gap-2 text-2xl font-bold mb-6">
        <Logo size={96} />
        <span>{t("appName")}</span>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        <Link href="/dashboard" className="py-2 px-3 rounded hover:bg-gray-100 flex items-center gap-2">
          <Target className="w-5 h-5" /> {t("dashboard")}
        </Link>
        <Link href="/challenges" className="py-2 px-3 rounded hover:bg-gray-100 flex items-center gap-2">
          <Trophy className="w-5 h-5" /> {t("challenges")}
        </Link>
        <Link href="/games" className="py-2 px-3 rounded hover:bg-gray-100 flex items-center gap-2">
          <Play className="w-5 h-5" /> {t("games")}
        </Link>
        <Link href="/marketplace" className="py-2 px-3 rounded hover:bg-gray-100 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" /> {t("marketplace")}
        </Link>
        <Link href="/schemes" className="py-2 px-3 rounded hover:bg-gray-100 flex items-center gap-2">
          <Bell className="w-5 h-5" /> {t("schemes")}
        </Link>
      </nav>
      <div className="mt-8 text-xs text-gray-400 text-center">© 2025 BeejSetu</div>
    </aside>
  )
}
