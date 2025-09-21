"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"

const REGIONS = [
  "Kerala",
  "Kasaragod",
  "Kannur",
  "Wayanad",
  "Kozhikode",
  "Malappuram",
  "Palakkad",
  "Thrissur",
  "Ernakulam",
  "Idukki",
  "Kottayam",
  "Alappuzha",
  "Pathanamthitta",
  "Kollam",
  "Thiruvananthapuram",
]

export function RegionSelector({ inline = false }: { inline?: boolean }) {
  const { region, setRegion } = useLanguage()

  return (
    <div className={inline ? "inline-flex items-center gap-2" : "flex items-center gap-2"}>
      <div className="min-w-[180px]">
        <Select value={region} onValueChange={(val) => setRegion(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {REGIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
