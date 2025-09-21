"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Target,
  TrendingUp,
  Users,
  Droplets,
  Leaf,
  Zap,
  Recycle,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Thermometer,
  Eye,
  Play,
  Bell,
  Award,
  Calendar,
  MapPin,
  RefreshCcw,
} from "lucide-react"
// import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TranslationWrapper } from "@/components/translation-wrapper"

// Default values (will be replaced by API data if available)
const defaultUserData = {
  name: "Farmer",
  farmName: "Your Farm",
  location: "",
  level: "Eco Apprentice",
  currentPoints: 750,
  pointsToNextLevel: 1000,
  ranking: 23,
  totalUsers: 1247,
  activeChallenges: 3,
  completedChallenges: 12,
  achievements: [
    { id: "water-warrior", name: "Water Warrior", icon: Droplets, earned: true },
    { id: "soil-steward", name: "Soil Steward", icon: Leaf, earned: true },
    { id: "challenge-champion", name: "Challenge Champion", icon: Trophy, earned: false },
    { id: "eco-expert", name: "Eco Expert", icon: Award, earned: false },
  ],
  impactMetrics: {
    waterSaved: 2450,
    co2Reduced: 180,
    soilImproved: 3.2,
    pollinatorsSupported: 8,
  },
}

type Weather = {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  uvIndex: number
  forecast: { day: string; high: number; low: number; condition: string }[]
}
const defaultWeather: Weather = {
  location: "Pune, Maharashtra",
  temperature: 28,
  condition: "Partly Cloudy",
  humidity: 65,
  windSpeed: 12,
  uvIndex: 6,
  forecast: [
    { day: "Today", high: 32, low: 22, condition: "sunny" },
    { day: "Tomorrow", high: 30, low: 20, condition: "cloudy" },
    { day: "Wed", high: 28, low: 18, condition: "rainy" },
  ],
}

const activeChallenges = [
  {
    id: 1,
    title: "Soil Health Improvement",
    description: "Add organic compost to 2 acres of farmland",
    progress: 60,
    points: 200,
    daysLeft: 5,
    category: "soil",
  },
  {
    id: 2,
    title: "Water Conservation",
    description: "Install drip irrigation system",
    progress: 30,
    points: 300,
    daysLeft: 12,
    category: "water",
  },
  {
    id: 3,
    title: "Energy Efficiency",
    description: "Use solar-powered irrigation for 1 week",
    progress: 85,
    points: 150,
    daysLeft: 2,
    category: "energy",
  },
]

const governmentSchemes = [
  {
    id: 1,
    title: "PM-KISAN Scheme",
    description: "Direct income support to farmers",
    deadline: "March 31, 2025",
    status: "eligible",
    amount: "₹6,000/year",
  },
  {
    id: 2,
    title: "Soil Health Card Scheme",
    description: "Free soil testing and recommendations",
    deadline: "April 15, 2025",
    status: "new",
    amount: "Free",
  },
]

export default function DashboardPage() {
  const router = useRouter()
  // const [selectedMetric, setSelectedMetric] = useState("water")
  const { lang } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<typeof defaultUserData>(defaultUserData)
  const [weather, setWeather] = useState<Weather>(defaultWeather)
  const [refreshingWeather, setRefreshingWeather] = useState(false)
  
  // Helper to fetch weather for a location
  const fetchWeather = async (loc: string) => {
    try {
      setRefreshingWeather(true)
      const q = encodeURIComponent(loc || 'Pune, Maharashtra')
      const wres = await fetch(`/api/weather?q=${q}`, { cache: 'no-store' })
      if (wres.ok) {
        const wjson = await wres.json()
        if (wjson?.ok && wjson?.weather) setWeather(wjson.weather)
      }
    } catch {}
    finally {
      setRefreshingWeather(false)
    }
  }

  // Load user from API if we have an id
  useEffect(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem('beejsetu-userId') : null
    const storedName = typeof window !== 'undefined' ? localStorage.getItem('beejsetu-userName') : null
    const storedLocation = typeof window !== 'undefined' ? localStorage.getItem('beejsetu-location') : null
    if (storedName) {
      setUserData((u) => ({ ...u, name: storedName }))
    }
    if (!id) {
      const t = setTimeout(() => setLoading(false), 300)
      return () => clearTimeout(t)
    }
    ;(async () => {
      try {
        const res = await fetch(`/api/users/${id}`)
        if (res.ok) {
          const data = await res.json()
          const name = data?.user?.name || storedName || defaultUserData.name
          const dbLocation = data?.profile?.location || ''
          // Prefer the server-sourced profile location; fall back to any locally cached value
          const finalLocation = dbLocation || storedLocation || ''
          setUserData((u) => ({ ...u, name, location: finalLocation }))
          // Keep localStorage in sync so refresh button/auto-refresh pick the same value
          try { if (finalLocation) localStorage.setItem('beejsetu-location', finalLocation) } catch {}
          await fetchWeather(finalLocation)
        }
      } catch (e) {
        console.warn('Failed to fetch user:', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Auto-refresh weather every 5 minutes
  useEffect(() => {
    const id = setInterval(() => {
      fetchWeather(userData.location)
    }, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [userData.location])
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(t)
  }, [])

  const tr = {
    en: {
      welcomeBack: "Welcome back",
      totalPoints: "Total Points",
      currentLevel: "Current Level",
      pointsToNextLevel: "points to next level",
      ranking: "Ranking",
      activeChallenges: "Active Challenges",
      completedThisMonth: "completed this month",
      impactScore: "Impact Score",
      trendThisWeek: "+0.3 this week",
      weather: "Weather",
      humidity: "Humidity",
      uv: "UV",
      goodVisibility: "Good visibility",
      forecast3Day: "3-Day Forecast",
      schemesUpdates: "Schemes & Updates",
      new: "New",
      eligible: "Eligible",
      viewAll: "View All",
      viewAllSchemes: "View All Schemes",
      daysLeft: "days left",
      complete: "complete",
      pts: "pts",
      yourImpact: "Your Environmental Impact",
      gallonsSaved: "Gallons Water Saved",
      co2Reduced: "lbs CO₂ Reduced",
      acresSoilImproved: "Acres Soil Improved",
      pollinatorSpecies: "Pollinator Species",
      startNewChallenge: "Start New Challenge",
      playMiniGames: "Play Mini Games",
      checkSchemes: "Check Schemes",
    },
    hi: {
      welcomeBack: "वापसी पर स्वागत है",
      totalPoints: "कुल अंक",
      currentLevel: "वर्तमान स्तर",
      pointsToNextLevel: "अगले स्तर तक अंक",
      ranking: "रैंकिंग",
      activeChallenges: "सक्रिय चुनौतियाँ",
      completedThisMonth: "इस माह पूरी हुई",
      impactScore: "प्रभाव स्कोर",
      trendThisWeek: "+0.3 इस सप्ताह",
      weather: "मौसम",
      humidity: "आर्द्रता",
      uv: "यूवी",
      goodVisibility: "अच्छी दृश्यता",
      forecast3Day: "3-दिवसीय पूर्वानुमान",
      schemesUpdates: "योजनाएँ और अपडेट",
      new: "नया",
      eligible: "पात्र",
      viewAll: "सभी देखें",
      viewAllSchemes: "सभी योजनाएँ देखें",
      daysLeft: "दिन शेष",
      complete: "पूर्ण",
      pts: "अंक",
      yourImpact: "आपका पर्यावरणीय प्रभाव",
      gallonsSaved: "बचाया गया पानी (गैलन)",
      co2Reduced: "घटी CO₂ (पाउंड)",
      acresSoilImproved: "सुधरे एकड़ मिट्टी",
      pollinatorSpecies: "परागकण प्रजातियाँ",
      startNewChallenge: "नई चुनौती शुरू करें",
      playMiniGames: "मिनी गेम्स खेलें",
      checkSchemes: "योजनाएँ देखें",
    },
    ml: {
      welcomeBack: "തിരികെയെത്തിയത് സ്വാഗതം",
      totalPoints: "ആകെ പോയിന്റ്സ്",
      currentLevel: "നിലവിലെ ലെവൽ",
      pointsToNextLevel: "അടുത്ത ലെവലിലേക്ക് പോയിന്റ്",
      ranking: "റാങ്കിംഗ്",
      activeChallenges: "സജീവ ചലഞ്ചുകൾ",
      completedThisMonth: "ഈ മാസം പൂർത്തിയായി",
      impactScore: "ഇംപാക്ട് സ്കോർ",
      trendThisWeek: "+0.3 ഈ ആഴ്ച",
      weather: "കാലാവസ്ഥ",
      humidity: "ഈർപ്പം",
      uv: "യുവി",
      goodVisibility: "നല്ല കാഴ്ച",
      forecast3Day: "3-ദിവസ ഫോർക്കാസ്റ്റ്",
      schemesUpdates: "പദ്ധതികളും അപ്ഡേറ്റുകളും",
      new: "പുതിയത്",
      eligible: "യോഗ്യത",
      viewAll: "എല്ലാം കാണുക",
      viewAllSchemes: "എല്ലാ പദ്ധതികളും കാണുക",
      daysLeft: "ദിവസങ്ങൾ ബാക്കി",
      complete: "പൂർത്തിയായി",
      pts: "പോയിന്റ്സ്",
      yourImpact: "നിങ്ങളുടെ പരിസ്ഥിതി സ്വാധീനം",
      gallonsSaved: "സംരക്ഷിച്ച വെള്ളം (ഗാലൺ)",
      co2Reduced: "കുറഞ്ഞ CO₂ (പൗണ്ട്)",
      acresSoilImproved: "മെച്ചപ്പെട്ട ഏക്കർ മണ്ണ്",
      pollinatorSpecies: "പരാഗകൻ ഇനങ്ങൾ",
      startNewChallenge: "പുതിയ ചലഞ്ച് ആരംഭിക്കുക",
      playMiniGames: "മിനി ഗെയിമുകൾ കളിക്കുക",
      checkSchemes: "പദ്ധതികൾ പരിശോധിക്കുക",
    },
  } as const
  const tt = (k: keyof typeof tr.en) => {
    const safeLang: keyof typeof tr = (['en','hi','ml'] as const).includes(lang as any) ? (lang as keyof typeof tr) : 'en'
    return tr[safeLang][k]
  }

  // Formatter for dynamic strings
  const outOfFarmersText = (n: string) => {
    switch (lang) {
      case "hi":
        return `${n} किसानों में से`
      case "ml":
        return `${n} കർഷകരിൽ നിന്ന്`
      default:
        return `Out of ${n} farmers`
    }
  }

  const getWeatherIcon = (condition: string) => {
    const c = (condition || "").toLowerCase()
    if (c.includes("rain")) return <CloudRain className="w-6 h-6 text-blue-500" />
    if (c.includes("cloud")) return <Cloud className="w-6 h-6 text-gray-500" />
    if (c.includes("sun") || c.includes("clear")) return <Sun className="w-6 h-6 text-yellow-500" />
    return <Sun className="w-6 h-6 text-yellow-500" />
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "water":
        return <Droplets className="w-4 h-4 text-blue-600" />
      case "soil":
        return <Leaf className="w-4 h-4 text-green-600" />
      case "energy":
        return <Zap className="w-4 h-4 text-yellow-600" />
      case "waste":
        return <Recycle className="w-4 h-4 text-purple-600" />
      default:
        return <Target className="w-4 h-4 text-gray-600" />
    }
  }

  // Navigation handlers for the three buttons
  const handleStartChallenge = () => {
    router.push("/challenges")
  }

  const handlePlayGames = () => {
    router.push("/games")
  }

  const handleCheckSchemes = () => {
    router.push("/schemes")
  }

  return (
    <DashboardLayout>
      <TranslationWrapper>
        <div className="space-y-6">
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-orange-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">{tt("welcomeBack")}, {userData.name}!</h1>
                <p className="text-orange-100 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {userData.farmName}{userData.location ? ` • ${userData.location}` : ""}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{userData.currentPoints}</div>
                <div className="text-sm text-orange-100">{tt("totalPoints")}</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="border-t border-gray-100 pt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
                {[0,1,2,3].map((i) => (
                  <Card key={i} className="border-0 shadow-md rounded-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="skeleton h-4 w-28 mb-2" />
                          <div className="skeleton h-6 w-20" />
                        </div>
                        <div className="skeleton h-12 w-12 rounded-full" />
                      </div>
                      <div className="skeleton h-2 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{tt("currentLevel")}</p>
                      <p className="text-xl font-bold text-gray-900">{userData.level}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={(userData.currentPoints / userData.pointsToNextLevel) * 100} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      {userData.pointsToNextLevel - userData.currentPoints} {tt("pointsToNextLevel")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{tt("ranking")}</p>
                      <p className="text-xl font-bold text-gray-900">#{userData.ranking}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">{outOfFarmersText(userData.totalUsers.toLocaleString())}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{tt("activeChallenges")}</p>
                      <p className="text-xl font-bold text-gray-900">{userData.activeChallenges}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">{userData.completedChallenges} {tt("completedThisMonth")}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{tt("impactScore")}</p>
                      <p className="text-xl font-bold text-gray-900">8.7/10</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-3 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {tt("trendThisWeek")}
                  </p>
                </CardContent>
              </Card>
            </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 border-t border-gray-100 pt-6">
            {/* Active Challenges */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-md rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{tt("activeChallenges")}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="button-press"
                      onClick={() => router.push("/challenges")}
                    >
                      {tt("viewAll")}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    [0,1].map((i) => (
                      <div key={i} className="p-4 border border-gray-100 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="skeleton w-4 h-4 rounded-full" />
                            <div className="skeleton h-4 w-40" />
                          </div>
                          <div className="skeleton h-5 w-16" />
                        </div>
                        <div className="skeleton h-3 w-3/4 mb-2" />
                        <div className="skeleton h-2 w-full" />
                      </div>
                    ))
                  ) : (
                  activeChallenges.map((challenge) => (
                    <div key={challenge.id} className="p-4 border border-gray-100 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(challenge.category)}
                          <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {challenge.daysLeft} {tt("daysLeft")}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <Progress value={challenge.progress} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">{challenge.progress}% {tt("complete")}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-orange-600">+{challenge.points} {tt("pts")}</p>
                        </div>
                      </div>
                    </div>
                  ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Weather Widget */}
            <div className="space-y-6">
              <Card className="border-0 shadow-md rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="w-5 h-5 text-orange-500" />
                      <span>{tt("weather")}</span>
                    </div>
                    <Button variant="outline" size="sm" className="button-press" onClick={() => fetchWeather(userData.location)} disabled={refreshingWeather}>
                      <RefreshCcw className={`w-4 h-4 mr-2 ${refreshingWeather ? 'animate-spin' : ''}`} />
                      {refreshingWeather ? 'Refreshing' : 'Refresh'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div>
                      <div className="text-center mb-4">
                        <div className="skeleton h-4 w-24 mx-auto mb-1" />
                        <div className="skeleton h-3 w-32 mx-auto" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {[0,1,2,3].map((i)=>(
                          <div key={i} className="flex items-center space-x-2">
                            <div className="skeleton w-4 h-4 rounded" />
                            <div className="skeleton h-3 w-24" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center mb-2">
                          {getWeatherIcon(weather.condition)}
                          <span className="text-3xl font-bold ml-2">{weather.temperature}°C</span>
                        </div>
                        <p className="text-sm text-gray-600">{weather.condition}</p>
                        <p className="text-xs text-gray-500">{weather.location}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Droplets className="w-4 h-4 text-blue-500" />
                          <span>{weather.humidity}% {tt("humidity")}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Wind className="w-4 h-4 text-gray-500" />
                          <span>{weather.windSpeed} km/h</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Sun className="w-4 h-4 text-yellow-500" />
                          <span>{tt("uv")} {weather.uvIndex}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-purple-500" />
                          <span>{tt("goodVisibility")}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-semibold mb-2">{tt("forecast3Day")}</h4>
                        <div className="space-y-2">
                          {weather.forecast.map((day, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{day.day}</span>
                              <div className="flex items-center space-x-2">
                                {getWeatherIcon(day.condition)}
                                <span>
                                  {day.high}°/{day.low}°
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Government Schemes */}
              <Card className="border-0 shadow-md rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-5 h-5 text-green-500" />
                      <span>{tt("schemesUpdates")}</span>
                    </div>
                    <Badge className="text-xs bg-red-600 text-white">
                      2 {tt("new")}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loading ? (
                    [0,1].map((i)=>(
                      <div key={i} className="p-3 border border-gray-100 rounded-lg">
                        <div className="flex items-start justify-between mb-1">
                          <div className="skeleton h-4 w-40" />
                          <div className="skeleton h-4 w-16" />
                        </div>
                        <div className="skeleton h-3 w-48 mb-2" />
                        <div className="flex items-center justify-between text-xs">
                          <div className="skeleton h-3 w-24" />
                          <div className="skeleton h-3 w-16" />
                        </div>
                      </div>
                    ))
                  ) : (
                  governmentSchemes.map((scheme) => (
                    <div key={scheme.id} className="p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-sm text-gray-900">{scheme.title}</h4>
                        <Badge
                          className={`text-xs ${scheme.status === "new" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
                        >
                          {scheme.status === "new" ? tt("new") : tt("eligible")}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{scheme.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {scheme.deadline}
                        </span>
                        <span className="font-semibold text-green-600">{scheme.amount}</span>
                      </div>
                    </div>
                  ))
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => router.push("/schemes")}
                  >
                    {tt("viewAllSchemes")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Impact Metrics */}
          <Card className="border-0 shadow-md border-t border-gray-100 mt-6">
            <CardHeader>
              <CardTitle>{tt("yourImpact")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Droplets className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {userData.impactMetrics.waterSaved.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">{tt("gallonsSaved")}</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Leaf className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{userData.impactMetrics.co2Reduced}</div>
                  <div className="text-sm text-gray-600">{tt("co2Reduced")}</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{userData.impactMetrics.soilImproved}</div>
                  <div className="text-sm text-gray-600">{tt("acresSoilImproved")}</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {userData.impactMetrics.pollinatorsSupported}
                  </div>
                  <div className="text-sm text-gray-600">{tt("pollinatorSpecies")}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
            <Button
              onClick={handleStartChallenge}
              className="h-16 bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <Play className="w-5 h-5" />
              <span>{tt("startNewChallenge")}</span>
            </Button>
            <Button
              onClick={handlePlayGames}
              variant="outline"
              className="h-16 border-green-300 text-green-700 hover:bg-green-50 flex items-center justify-center space-x-2 bg-transparent transition-all duration-200 hover:scale-105 hover:shadow-md"
            >
              <Target className="w-5 h-5" />
              <span>{tt("playMiniGames")}</span>
            </Button>
            <Button
              onClick={handleCheckSchemes}
              variant="outline"
              className="h-16 border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center justify-center space-x-2 bg-transparent transition-all duration-200 hover:scale-105 hover:shadow-md"
            >
              <Bell className="w-5 h-5" />
              <span>{tt("checkSchemes")}</span>
            </Button>
          </div>
        </div>
      </TranslationWrapper>
    </DashboardLayout>
  )
}
