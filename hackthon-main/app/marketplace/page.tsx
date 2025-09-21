"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Leaf, Droplets, Zap, Recycle, Clock } from "lucide-react"
import { loadProgress, type ProgressState } from "@/lib/progress"
import { useRouter } from "next/navigation"

export default function MarketplaceComingSoonPage() {
  const router = useRouter()
  const [progressState, setProgressState] = useState<ProgressState | null>(null)
  useEffect(() => {
    try { setProgressState(loadProgress()) } catch {}
  }, [])

  const points = progressState?.totalPoints ?? 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
              <p className="text-gray-600">Redeem your sustainability points for eco-friendly farming supplies</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Your Points</div>
            <Badge className="bg-purple-600 text-white text-base py-1 px-3">{points}</Badge>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <Card className="border-0 shadow-md bg-gradient-to-r from-green-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              We are building a farmer-first marketplace where you can redeem your earned points for items that support
              sustainable agriculture. Track your missions, grow your streaks, and you will soon be able to claim rewards.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="p-3 rounded border border-gray-100 bg-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-600" /> Drip kits & water-saving tools
              </div>
              <div className="p-3 rounded border border-gray-100 bg-white flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-600" /> Organic compost & soil enhancers
              </div>
              <div className="p-3 rounded border border-gray-100 bg-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-600" /> Solar pumps & efficient motors
              </div>
              <div className="p-3 rounded border border-gray-100 bg-white flex items-center gap-2">
                <Recycle className="w-4 h-4 text-purple-600" /> Waste segregation & composters
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
              <Button variant="outline" onClick={() => router.push("/games")}>Earn More Points</Button>
            </div>
          </CardContent>
        </Card>

        {/* How it will work */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>How it will work</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal ml-5 space-y-2 text-gray-700">
              <li>Complete Weekly Missions and mini-games to earn points.</li>
              <li>Reach milestones to unlock special vouchers.</li>
              <li>Redeem points for eco-friendly products from trusted partners.</li>
              <li>Track orders and delivery status inside your dashboard.</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}