"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Droplets,
  Leaf,
  Zap,
  Recycle,
  Target,
  Clock,
  Trophy,
  Star,
  CheckCircle,
  Play,
  Calendar,
  Award,
  TrendingUp,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/contexts/language-context"

const challengeCategories = [
  { id: "water", name: "Water Conservation", icon: Droplets, color: "text-blue-600", bgColor: "bg-blue-100" },
  { id: "soil", name: "Soil Health", icon: Leaf, color: "text-green-600", bgColor: "bg-green-100" },
  { id: "biodiversity", name: "Biodiversity", icon: Target, color: "text-purple-600", bgColor: "bg-purple-100" },
  { id: "energy", name: "Energy Efficiency", icon: Zap, color: "text-yellow-600", bgColor: "bg-yellow-100" },
  { id: "waste", name: "Waste Reduction", icon: Recycle, color: "text-orange-600", bgColor: "bg-orange-100" },
  { id: "crop", name: "Crop Management", icon: Star, color: "text-pink-600", bgColor: "bg-pink-100" },
]

const availableChallenges = [
  {
    id: 1,
    title: "Drip Irrigation Setup",
    description: "Install drip irrigation system to reduce water usage by 30%",
    category: "water",
    difficulty: "Medium",
    duration: "14 days",
    points: 300,
    participants: 156,
    requirements: ["2+ acres farmland", "Basic irrigation knowledge"],
    rewards: ["Water Warrior Badge", "300 points", "Irrigation guide PDF"],
    status: "available",
  },
  {
    id: 2,
    title: "Organic Compost Creation",
    description: "Create and apply organic compost to improve soil health",
    category: "soil",
    difficulty: "Easy",
    duration: "21 days",
    points: 200,
    participants: 234,
    requirements: ["Organic waste materials", "Composting space"],
    rewards: ["Soil Steward Badge", "200 points", "Composting toolkit"],
    status: "available",
  },
  {
    id: 3,
    title: "Pollinator Garden",
    description: "Plant native flowers to support local pollinator species",
    category: "biodiversity",
    difficulty: "Easy",
    duration: "30 days",
    points: 250,
    participants: 89,
    requirements: ["0.5+ acres available", "Native flower seeds"],
    rewards: ["Biodiversity Defender Badge", "250 points", "Seed starter kit"],
    status: "available",
  },
  {
    id: 4,
    title: "Solar Water Pumping",
    description: "Use solar-powered pumps for irrigation for one month",
    category: "energy",
    difficulty: "Hard",
    duration: "30 days",
    points: 400,
    participants: 67,
    requirements: ["Solar pump access", "Sunny location"],
    rewards: ["Energy Farmer Badge", "400 points", "Solar maintenance guide"],
    status: "available",
  },
  {
    id: 5,
    title: "Zero Waste Farming",
    description: "Implement zero-waste practices across your entire farm",
    category: "waste",
    difficulty: "Hard",
    duration: "45 days",
    points: 500,
    participants: 34,
    requirements: ["Waste audit completion", "Recycling setup"],
    rewards: ["Waste Warrior Badge", "500 points", "Sustainability certificate"],
    status: "available",
  },
  {
    id: 6,
    title: "Crop Rotation Planning",
    description: "Implement 4-season crop rotation plan",
    category: "crop",
    difficulty: "Medium",
    duration: "120 days",
    points: 350,
    participants: 123,
    requirements: ["Multiple crop varieties", "Planning tools"],
    rewards: ["Crop Master Badge", "350 points", "Rotation planning software"],
    status: "available",
  },
]

const activeChallenges = [
  {
    id: 7,
    title: "Soil Health Improvement",
    description: "Add organic compost to 2 acres of farmland",
    category: "soil",
    progress: 60,
    points: 200,
    daysLeft: 5,
    startDate: "2025-01-10",
    status: "active",
  },
  {
    id: 8,
    title: "Water Conservation",
    description: "Install drip irrigation system",
    category: "water",
    progress: 30,
    points: 300,
    daysLeft: 12,
    startDate: "2025-01-05",
    status: "active",
  },
]

const completedChallenges = [
  {
    id: 9,
    title: "Organic Pest Control",
    description: "Use natural pest control methods for one month",
    category: "biodiversity",
    points: 150,
    completedDate: "2025-01-01",
    status: "completed",
  },
  {
    id: 10,
    title: "Rainwater Harvesting",
    description: "Set up rainwater collection system",
    category: "water",
    points: 250,
    completedDate: "2024-12-20",
    status: "completed",
  },
]

export default function ChallengesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null)
  // Local, editable copies for Active/Completed to support progress updates
  const [activeList, setActiveList] = useState(activeChallenges)
  const [completedList, setCompletedList] = useState(completedChallenges)
  // Local copy of available challenges so we can move items when joining
  const [availableList, setAvailableList] = useState(availableChallenges)
  // Progress modal state
  const [progressModal, setProgressModal] = useState<{ id: number | null; value: number } | null>(null)
  const { lang } = useLanguage()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(t)
  }, [])

  const tr = {
    en: {
      title: "Sustainability Challenges",
      subtitle: "Complete challenges to earn points and badges",
      yourTotalPoints: "Your total points",
      allCategories: "All Categories",
      available: "Available",
      active: "Active",
      completed: "Completed",
      daysLeft: "days left",
      progress: "Progress",
      complete: "complete",
      started: "Started",
      viewDetails: "View Details",
      updateProgress: "Update Progress",
      challengeDetails: "Challenge Details",
      requirements: "Requirements",
      rewards: "Rewards",
      joinChallenge: "Join Challenge",
      cancel: "Cancel",
      pts: "pts",
      points: "points",
      completedOn: "Completed on",
      statusCompleted: "Completed",
    },
    hi: {
      title: "सततता चुनौतियाँ",
      subtitle: "अंक और बैज कमाने के लिए चुनौतियाँ पूरी करें",
      yourTotalPoints: "आपके कुल अंक",
      allCategories: "सभी श्रेणियाँ",
      available: "उपलब्ध",
      active: "सक्रिय",
      completed: "पूर्ण",
      daysLeft: "दिन शेष",
      progress: "प्रगति",
      complete: "पूर्ण",
      started: "शुरू हुआ",
      viewDetails: "विवरण देखें",
      updateProgress: "प्रगति अपडेट करें",
      challengeDetails: "चुनौती विवरण",
      requirements: "आवश्यकताएँ",
      rewards: "पुरस्कार",
      joinChallenge: "चुनौती में शामिल हों",
      cancel: "रद्द करें",
      pts: "अंक",
      points: "अंक",
      completedOn: "पूर्ण हुआ",
      statusCompleted: "पूर्ण",
    },
    ml: {
      title: "സുസ്ഥിരത ചലഞ്ചുകൾ",
      subtitle: "പോയിന്റുകളും ബാഡ്ജുകളും നേടാൻ ചലഞ്ചുകൾ പൂർത്തിയാക്കുക",
      yourTotalPoints: "നിങ്ങളുടെ ആകെ പോയിന്റുകൾ",
      allCategories: "എല്ലാ വിഭാഗങ്ങളും",
      available: "ലഭ്യം",
      active: "സജീവം",
      completed: "പൂർത്തിയായി",
      daysLeft: "ദിവസങ്ങൾ ബാക്കി",
      progress: "പുരോഗതി",
      complete: "പൂർത്തിയായി",
      started: "തുടങ്ങി",
      viewDetails: "വിശദാംശങ്ങൾ കാണുക",
      updateProgress: "പുരോഗതി അപ്ഡേറ്റ് ചെയ്യുക",
      challengeDetails: "ചലഞ്ച് വിശദാംശങ്ങൾ",
      requirements: "ആവശ്യകതകൾ",
      rewards: "ബഹുമതികൾ",
      joinChallenge: "ചലഞ്ചിൽ ചേരുക",
      cancel: "റദ്ദാക്കുക",
      pts: "പോയിന്റ്സ്",
      points: "പോയിന്റ്സ്",
      completedOn: "പൂർത്തിയായ തീയതി",
      statusCompleted: "പൂർത്തിയായി",
    },
  } as const
  const tt = (k: keyof typeof tr.en) => {
    const safeLang: keyof typeof tr = (['en','hi','ml'] as const).includes(lang as any) ? (lang as keyof typeof tr) : 'en'
    return tr[safeLang][k]
  }

  // Dynamic text helpers kept out of translation map
  const farmersParticipatingText = (n: number) => {
    switch (lang) {
      case "hi":
        return `${n} किसान भाग ले रहे हैं`
      case "ml":
        return `${n} കർഷകർ പങ്കെടുക്കുന്നു`
      default:
        return `${n} farmers participating`
    }
  }

  const participantsNowText = (n: number) => {
    switch (lang) {
      case "hi":
        return `${n} किसान वर्तमान में भाग ले रहे हैं`
      case "ml":
        return `${n} കർഷകർ ഇപ്പോൾ പങ്കെടുക്കുന്നു`
      default:
        return `${n} farmers are currently participating in this challenge`
    }
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = challengeCategories.find((cat) => cat.id === categoryId)
    if (!category) return <Target className="w-4 h-4" />
    const IconComponent = category.icon
    return <IconComponent className={`w-4 h-4 ${category.color}`} />
  }

  const getCategoryBg = (categoryId: string) => {
    const category = challengeCategories.find((cat) => cat.id === categoryId)
    return category?.bgColor || "bg-gray-100"
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredChallenges =
    selectedCategory === "all"
      ? availableList
      : availableList.filter((challenge) => challenge.category === selectedCategory)

  // Open progress modal for a given challenge
  const openProgressModal = (id: number, current: number) => {
    setProgressModal({ id, value: current })
  }

  // Save progress change; if completed, award points and move to completed list
  const saveProgress = async () => {
    if (!progressModal?.id) return
    setActiveList((prev) => {
      const next = prev.map((c) => (c.id === progressModal.id ? { ...c, progress: progressModal.value } : c))
      return next
    })

    // If the challenge just completed (>=100), award points and move it
    const ch = activeList.find((c) => c.id === progressModal.id)
    const newlyCompleted = ch && ch.progress < 100 && progressModal.value >= 100
    if (ch && newlyCompleted) {
      // Award points to current user
      try {
        const userId = typeof window !== 'undefined' ? localStorage.getItem('beejsetu-userId') : null
        if (userId) {
          await fetch(`/api/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ delta: ch.points }),
          })
        }
      } catch {}

      // Move to completed locally
      setActiveList((prev) => prev.filter((x) => x.id !== ch.id))
      setCompletedList((prev) => [
        ...prev,
        {
          id: ch.id,
          title: ch.title,
          description: ch.description,
          category: ch.category,
          points: ch.points,
          completedDate: new Date().toISOString().slice(0, 10),
          status: 'completed',
        } as any,
      ])
    }

    setProgressModal(null)
  }

  const handleJoinChallenge = (challengeId: number) => {
    // Find in available list
    const ch = availableList.find((c) => c.id === challengeId)
    if (!ch) return

    // Move to active with initial progress
    const days = parseInt((ch.duration || "").replace(/[^0-9]/g, "")) || 14
    const newActive = {
      id: ch.id,
      title: ch.title,
      description: ch.description,
      category: ch.category,
      progress: 0,
      points: ch.points,
      daysLeft: days,
      startDate: new Date().toISOString().slice(0, 10),
      status: "active",
    } as any
    setActiveList((prev) => [...prev, newActive])
    setAvailableList((prev) => prev.filter((x) => x.id !== ch.id))
    setSelectedChallenge(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{tt("title")}</h1>
            <p className="text-gray-600 mt-1">{tt("subtitle")}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">750 {tt("pts")}</div>
            <div className="text-sm text-gray-500">{tt("yourTotalPoints")}</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className={(selectedCategory === "all" ? "bg-orange-500 hover:bg-orange-600 " : "") + "button-press"}
          >
            {tt("allCategories")}
          </Button>
          {challengeCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 button-press ${
                  selectedCategory === category.id ? "bg-orange-500 hover:bg-orange-600" : ""
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{category.name}</span>
              </Button>
            )
          })}
        </div>

        <Tabs defaultValue="available" className="w-full border-t border-gray-100 pt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">{tt("available")} ({availableList.length})</TabsTrigger>
            <TabsTrigger value="active">{tt("active")} ({activeList.length})</TabsTrigger>
            <TabsTrigger value="completed">{tt("completed")} ({completedList.length})</TabsTrigger>
          </TabsList>

          {/* Available Challenges */}
          <TabsContent value="available" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
              {(loading ? Array.from({ length: 6 }).map((_, i) => ({ id: `s${i}` })) : filteredChallenges).map((challenge: any) => (
                <Card key={challenge.id} className="border-0 shadow-md hover:shadow-lg transition-shadow rounded-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      {loading ? (
                        <div className="w-full flex items-center justify-between">
                          <div className="skeleton w-12 h-12 rounded-full" />
                          <div className="skeleton h-5 w-16" />
                        </div>
                      ) : (
                        <>
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryBg(challenge.category)}`}
                          >
                            {getCategoryIcon(challenge.category)}
                          </div>
                          <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                        </>
                      )}
                    </div>
                    <CardTitle className="text-lg">{loading ? <span className="skeleton h-4 w-40 inline-block" /> : challenge.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                      <div className="space-y-2">
                        <div className="skeleton h-3 w-5/6" />
                        <div className="skeleton h-3 w-2/3" />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{loading ? <span className="skeleton h-3 w-16 inline-block" /> : challenge.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-orange-600 font-semibold">
                        <Trophy className="w-4 h-4" />
                        <span>{loading ? <span className="skeleton h-3 w-16 inline-block" /> : `${challenge.points} ${tt("points")}`}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">{loading ? <span className="skeleton h-3 w-40 inline-block" /> : farmersParticipatingText(challenge.participants)}</div>

                    {loading ? (
                      <div className="skeleton h-10 w-full" />
                    ) : (
                      <Button
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white button-press rounded-lg"
                        onClick={() => setSelectedChallenge(challenge.id)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {tt("viewDetails")}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Active Challenges */}
          <TabsContent value="active" className="space-y-4">
            {(loading ? Array.from({ length: 2 }).map((_, i) => ({ id: `as${i}` })) : activeList).map((challenge: any) => (
              <Card key={challenge.id} className="border-0 shadow-md rounded-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {loading ? (
                        <>
                          <div className="skeleton w-12 h-12 rounded-full" />
                          <div>
                            <div className="skeleton h-4 w-44 mb-1" />
                            <div className="skeleton h-3 w-56" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryBg(challenge.category)}`}
                          >
                            {getCategoryIcon(challenge.category)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                            <p className="text-sm text-gray-600">{challenge.description}</p>
                          </div>
                        </>
                      )}
                    </div>
                    {loading ? <div className="skeleton h-5 w-16" /> : <Badge variant="secondary" className="text-xs">{challenge.daysLeft} {tt("daysLeft")}</Badge>}
                  </div>

                  <div className="space-y-3">
                    {loading ? (
                      <>
                        <div className="skeleton h-3 w-full" />
                        <div className="flex items-center justify-between text-sm">
                          <div className="skeleton h-3 w-24" />
                          <div className="skeleton h-3 w-16" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{tt("progress")}</span>
                          <span className="font-semibold">{challenge.progress}% {tt("complete")}</span>
                        </div>
                        <Progress value={challenge.progress} className="h-3" />
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{tt("started")} {challenge.startDate}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-orange-600 font-semibold">
                            <Trophy className="w-4 h-4" />
                            <span>{challenge.points} {tt("pts")}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white button-press">
                      {tt("updateProgress")}
                    </Button>
                    <Button variant="outline" size="sm" className="button-press">
                      {tt("viewDetails")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Completed Challenges */}
          <TabsContent value="completed" className="space-y-4">
            {completedList.map((challenge) => (
              <Card key={challenge.id} className="border-0 shadow-md bg-green-50 rounded-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{tt("completedOn")} {challenge.completedDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-green-600 font-semibold">
                        <Trophy className="w-4 h-4" />
                        <span>+{challenge.points} {tt("pts")}</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 mt-1">{tt("statusCompleted")}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Challenge Detail Modal would go here */}
        {selectedChallenge && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{tt("challengeDetails")}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedChallenge(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const challenge = availableList.find((c) => c.id === selectedChallenge)
                  if (!challenge) return null

                  return (
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center ${getCategoryBg(challenge.category)}`}
                        >
                          {getCategoryIcon(challenge.category)}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-900">{challenge.title}</h2>
                          <p className="text-gray-600 mt-1">{challenge.description}</p>
                          <div className="flex items-center space-x-4 mt-3">
                            <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{challenge.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-orange-600 font-semibold">
                              <Trophy className="w-4 h-4" />
                              <span>{challenge.points} {tt("points")}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{tt("requirements")}</h3>
                        <ul className="space-y-1">
                          {challenge.requirements.map((req, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{tt("rewards")}</h3>
                        <ul className="space-y-1">
                          {challenge.rewards.map((reward, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                              <Award className="w-4 h-4 text-orange-500" />
                              <span>{reward}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4" />
                          <span>{participantsNowText(challenge.participants)}</span>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={() => handleJoinChallenge(challenge.id)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {tt("joinChallenge")}
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedChallenge(null)}>
                          {tt("cancel")}
                        </Button>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
