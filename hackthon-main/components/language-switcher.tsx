"use client"

import { useLanguage, type Lang } from "@/contexts/language-context"
import { Globe } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LanguageSwitcher({ inline = false }: { inline?: boolean }) {
  const { lang, setLang, t } = useLanguage()

  return (
    <div className={inline ? "inline-flex items-center gap-2" : "flex items-center gap-2"}>
      <Globe className="w-4 h-4 text-gray-600" />
      <span className="text-sm text-gray-700">{t("language", "Language")}</span>
      <div className="min-w-[160px]">
        <Select value={lang} onValueChange={(val) => setLang(val as Lang)}>
          <SelectTrigger aria-label={t("language", "Language")}>
            <SelectValue placeholder={t("language", "Language")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">{t("english", "English")}</SelectItem>
            <SelectItem value="hi">{t("hindi", "Hindi")}</SelectItem>
            <SelectItem value="ml">{t("malayalam", "Malayalam")}</SelectItem>
            <SelectItem value="ta">{t("tamil", "Tamil")}</SelectItem>
            <SelectItem value="kn">{t("kannada", "Kannada")}</SelectItem>
            <SelectItem value="gom">{t("konkani", "Konkani")}</SelectItem>
            <SelectItem value="tcy">{t("tulu", "Tulu")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
