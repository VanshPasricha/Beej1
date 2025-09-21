"use client"
import { useEffect, useRef, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

import { Home, RefreshCcw, Puzzle, Calculator, Sprout, Star, Users, Clock, Award } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useTranslation } from "@/hooks/use-translation"

type Game = {
  id: string
  title: string
  description: string
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
  difficulty: string
  duration: string
  points: number
  players: number
  rating: number
  completed: boolean
  bestScore: number
  objective: string
  skills: string[]
}

const miniGames: Game[] = [
  {
    id: "match-pairs",
    title: "Match the Following",
    description: "Flip cards to match sustainable farming terms with their meanings",
    icon: Puzzle,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-200",
    difficulty: "Easy",
    duration: "5-8 min",
    points: 60,
    players: 1320,
    rating: 4.7,
    completed: false,
    bestScore: 0,
    objective: "Learn sustainability concepts by matching pairs",
    skills: ["Memory", "Concept Mapping", "Sustainability Basics"],
  },
  {
    id: "sum-puzzle",
    title: "Sustainability Sum Puzzle",
    description: "Select actions to exactly reach the target sustainability score",
    icon: Calculator,
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    borderColor: "border-teal-200",
    difficulty: "Medium",
    duration: "6-10 min",
    points: 80,
    players: 745,
    rating: 4.6,
    completed: false,
    bestScore: 0,
    objective: "Optimize choices to hit the exact target score",
    skills: ["Planning", "Arithmetic", "Trade-offs"],
  },
  {
    id: "eco-farm-simulator",
    title: "Eco Farm Simulator",
    description: "Drive a tractor, manage plots, and practice sustainable farming",
    icon: Sprout,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-200",
    difficulty: "Medium",
    duration: "5-10 min",
    points: 120,
    players: 2450,
    rating: 4.8,
    completed: false,
    bestScore: 0,
    objective: "Perform tasks (plough, seed, irrigate, harvest) and earn coins",
    skills: ["Resource Management", "Sustainable Practices", "Planning"],
  },
]

const WORLD_W = 900
const WORLD_H = 520
const GRID_COLS = 5

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [gameState, setGameState] = useState<"menu" | "playing">("menu")
  const [session, setSession] = useState(0)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const difficultyLabel = (d: string) => {
    const key = d.toLowerCase()
    if (key === "easy") return t("difficulty_easy")
    if (key === "medium") return t("difficulty_medium")
    if (key === "hard") return t("difficulty_hard")
    return d
  }

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const startGame = (gameId: string) => {
    setSelectedGame(gameId)
    // Show rules first before entering playing mode
    setShowRules(true)
    setCompleted(false)
    setScore(0)
    setEarned(0)
  }

  const backToMenu = () => {
    setSelectedGame(null)
    setGameState("menu")
  }

  // Rules to show before starting each game
  const rules: Record<string, string[]> = {
    "match-pairs": [
      "Flip cards to reveal terms and their meanings.",
      "Match pairs to score. Fewer moves = higher score.",
      "Complete all matches to earn points.",
    ],
    "sum-puzzle": [
      "Select actions to reach the exact target score.",
      "You can toggle selections. Hit Submit to check.",
      "Exact match completes the game and awards points.",
    ],
    "eco-farm-simulator": [
      "Drive the tractor and perform tasks on plots.",
      "Use tools: plough → seed → irrigate → harvest.",
      "Unload harvest at the barn to earn coins and points.",
    ],
  }

  const [showRules, setShowRules] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [earned, setEarned] = useState(0)

  const beginAfterRules = () => {
    setShowRules(false)
    setGameState("playing")
  }

  const handleComplete = (scoreValue: number) => {
    const pts = miniGames.find((g) => g.id === selectedGame)?.points ?? 0
    setScore(Math.max(0, Math.round(scoreValue)))
    setEarned(pts)
    setCompleted(true)
  }

  if (selectedGame && showRules) {
    const game = miniGames.find((g) => g.id === selectedGame)!
    const Icon = game.icon
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-3xl mx-auto">
          <Card className="border-0 shadow-md rounded-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${game.bgColor}`}>
                  <Icon className={`w-5 h-5 ${game.color}`} />
                </div>
                <div>
                  <CardTitle className="text-2xl">{game.title}</CardTitle>
                  <p className="text-gray-600 text-sm">{game.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 text-sm text-gray-700 font-semibold">Game rules</div>
              <ol className="list-decimal ml-5 space-y-1 text-sm text-gray-700">
                {(rules[selectedGame] || []).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ol>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>
                    <Badge variant="outline" className="mr-2">{difficultyLabel(game.difficulty)}</Badge>
                    <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {game.duration}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-gray-700"><Award className="w-3.5 h-3.5 text-purple-600" /> {game.points} {t("pts_suffix")}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button onClick={beginAfterRules}>{t("start_game")}</Button>
                  <Button variant="outline" onClick={() => { setSelectedGame(null); setGameState("menu") }}>{t("back_to_games")}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (gameState === "playing" && selectedGame) {
    const game = miniGames.find((g) => g.id === selectedGame)
    if (!game) return null
    const Icon = game.icon
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={backToMenu}>
              <Home className="w-4 h-4 mr-1" />
              {t("back_to_games")}
            </Button>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${game.bgColor}`}>
                <Icon className={`w-5 h-5 ${game.color}`} />
              </div>
              <h1 className="text-2xl font-bold">{game.title}</h1>
            </div>
            <Button variant="outline" onClick={() => setSession((s) => s + 1)} aria-label={t("restart")} title={t("restart")}>
              <RefreshCcw className="w-4 h-4 mr-1" /> {t("restart")}
            </Button>
          </div>
          {/* Live score/points header */}
          <div className="flex items-center gap-3 text-sm">
            <Badge variant="outline">Score: {score}</Badge>
            <Badge variant="outline">{earned} {t("pts_suffix")}</Badge>
            {completed && <Badge className="bg-emerald-600 text-white">Completed</Badge>}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            {selectedGame === "match-pairs" && (
              <MatchPairsGame key={session} onComplete={(s) => handleComplete(s)} />
            )}
            {selectedGame === "sum-puzzle" && (
              <SumPuzzleGame key={session} onComplete={(s) => handleComplete(s)} />
            )}
            {selectedGame === "eco-farm-simulator" && (
              <EcoFarmSimulator key={session} onComplete={(s) => handleComplete(s)} />
            )}
          </div>
          {completed && (
            <Card className="mt-4 border-0 shadow-md rounded-lg">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    <div className="font-semibold">Result</div>
                    <div>Score: {score}</div>
                    <div>Points earned: {earned} {t("pts_suffix")}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => { setSession((s) => s + 1); setCompleted(false); setScore(0); setEarned(0) }}>{t("play_again")}</Button>
                    <Button variant="outline" onClick={backToMenu}>{t("back_to_games")}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t("games_title")}</h1>
        <p className="text-gray-600">{t("games_subtitle")}</p>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {miniGames.map((game) => {
              const Icon = game.icon
              const onActivate = () => startGame(game.id)
              return (
                <Card
                  key={game.id}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onActivate()
                    }
                  }}
                  onClick={onActivate}
                  className={`group h-full rounded-xl transition shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${game.borderColor} bg-white/90 backdrop-blur border`}
                >
                  <div className="flex h-full flex-col">
                    {/* Header */}
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${game.bgColor} ring-1 ring-black/5 shrink-0 transition-transform group-hover:scale-105`}>
                          <Icon className={`w-7 h-7 ${game.color}`} />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-lg leading-6 line-clamp-2">{game.title}</CardTitle>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{game.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    {/* Meta badges */}
                    <div className="px-5 flex items-center gap-2">
                      <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">{difficultyLabel(game.difficulty)}</Badge>
                      <div className="inline-flex items-center text-xs text-gray-600 gap-1"><Clock className="w-3.5 h-3.5" /> {game.duration}</div>
                      <div className="ml-auto inline-flex items-center text-xs text-gray-700 gap-1 font-medium"><Award className="w-3.5 h-3.5 text-purple-600" /> {game.points} {t("pts_suffix")}</div>
                    </div>
                    {/* Progress placeholder (user best/estimated) */}
                    <div className="px-5 pt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{t("estimated_completion")}</span>
                        <span>~{game.duration}</span>
                      </div>
                      <Progress value={35} className="h-2" />
                    </div>
                    {/* Footer stats + CTA */}
                    <CardContent className="mt-auto px-5 pb-5">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                        <div className="flex items-center gap-4">
                          <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {game.players.toLocaleString()}</span>
                          <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500" /> {game.rating}</span>
                        </div>
                        <span className="text-gray-700 font-medium">{game.points} {t("pts_suffix")}</span>
                      </div>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={onActivate} aria-label={`${t("play")} ${game.title}`}>
                        {t("play")}
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Match Pairs Game

function MatchPairsGame({ onComplete }: { onComplete?: (score: number) => void }) {
  type CardT = { id: number; text: string }
  const pairs: [string, string][] = [
    ["Drip Irrigation", "Water-saving irrigation"],
    ["Compost", "Organic fertilizer"],
    ["Pollination", "Reproduction via flowers"],
  ]
  const [deck, setDeck] = useState<CardT[]>(() =>
    [...pairs.flatMap(([a, b], i) => [{ id: i * 2, text: a }, { id: i * 2 + 1, text: b }])].sort(
      () => Math.random() - 0.5,
    ),
  )
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [attempts, setAttempts] = useState(0)

  const onFlip = (id: number) => {
    if (flipped.includes(id) || matched.includes(id)) return
    if (flipped.length === 1) {
      setAttempts((a) => a + 1)
      const firstId = flipped[0]
      const a = deck.find((c) => c.id === firstId)
      const b = deck.find((c) => c.id === id)
      if (a && b && Math.floor(a.id / 2) === Math.floor(b.id / 2)) {
        setMatched((m) => {
          const next = [...m, firstId, id]
          if (next.length === deck.length) {
            const score = Math.max(10, 100 - attempts * 10)
            onComplete?.(score)
          }
          return next
        })
      }
      setFlipped([])
    } else setFlipped([id])
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {deck.map((c) => (
        <Card
          key={c.id}
          className={`cursor-pointer border shadow p-6 flex justify-center items-center ${
            matched.includes(c.id) ? "bg-green-100" : "bg-white"
          }`}
          onClick={() => onFlip(c.id)}
        >
          <span>{flipped.includes(c.id) || matched.includes(c.id) ? c.text : "?"}</span>
        </Card>
      ))}
    </div>
  )
}

// Sum Puzzle Game

function SumPuzzleGame({ onComplete }: { onComplete?: (score: number) => void }) {
  const actions = [
    { id: 1, name: "Drip Irrigation", value: 5 },
    { id: 2, name: "Composting", value: 3 },
    { id: 3, name: "Mulching", value: 2 },
    { id: 4, name: "Solar Pump", value: 7 },
    { id: 5, name: "Rainwater Harvesting", value: 8 },
  ]
  const [target] = useState(10 + Math.floor(Math.random() * 10))
  const [selected, setSelected] = useState<number[]>([])
  const [message, setMessage] = useState<string | null>(null)

  const currentSum = selected.reduce((sum, id) => sum + (actions.find((a) => a.id === id)?.value ?? 0), 0)
  const toggle = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    setMessage(null)
  }
  const submit = () => {
    if (currentSum === target) {
      setMessage("success")
      const optimal = Math.min(3, selected.length)
      const score = Math.max(20, 100 - Math.max(0, selected.length - optimal) * 10)
      onComplete?.(score)
    } else setMessage("try")
  }
  const reset = () => {
    setSelected([])
    setMessage(null)
  }

  return (
    <div className="space-y-3">
      <div className="text-sm">Target: {target}</div>
      <div className="text-sm">Current Sum: {currentSum}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {actions.map((a) => (
          <Button key={a.id} variant={selected.includes(a.id) ? "secondary" : "outline"} onClick={() => toggle(a.id)}>
            {a.name} (+{a.value})
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button onClick={submit}>Submit</Button>
        <Button variant="outline" onClick={reset}>
          Reset
        </Button>
      </div>
      {message === "success" && <Badge className="bg-green-100 text-green-800">Great! Exact target reached.</Badge>}
      {message === "try" && <Badge className="bg-red-100 text-red-800">Not exact. Try again!</Badge>}
    </div>
  )
}

// Eco Farm Simulator

type Tool = "plough" | "seed" | "irrigate" | "harvest" | "unload"
type PlotState = "raw" | "tilled" | "seeded" | "growing" | "ready" | "harvested"
type CropType = "wheat" | "rice" | "vegetables"

interface Plot {
  x: number
  y: number
  w: number
  h: number
  state: PlotState
  growth: number // 0..100
  moisture: number // 0..100
  pests: number // 0..100
  harvestAnim?: number // 0..1 animation progress
  crop: CropType
}

function EcoFarmSimulator({ onComplete }: { onComplete?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const keysRef = useRef<Record<string, boolean>>({})

  const [tool, setTool] = useState<Tool>("plough")
  const [fuel, setFuel] = useState(70)
  const [water, setWater] = useState(60)
  const [coins, setCoins] = useState(0)
  const [cargo, setCargo] = useState(0)
  const [message, setMessage] = useState<string>(
    "Use arrow keys or WASD to drive. Select a tool, drive onto a plot, press Space."
  )
  const cargoCapacity = 100
  const barnRect = { x: 40, y: 360, w: 140, h: 110 }
  const [drip, setDrip] = useState(true)
  const [solar, setSolar] = useState(true)
  const [ladybugs, setLadybugs] = useState(false)
  const [season, setSeason] = useState<"summer" | "monsoon" | "winter">("summer")
  const [paused, setPaused] = useState(false)
  const [growthSpeed, setGrowthSpeed] = useState(1.0)

  const tractorRef = useRef({
    x: WORLD_W / 2,
    y: WORLD_H / 2,
    vx: 0,
    vy: 0,
    speed: 2.0,
  })
  const plotsRef = useRef<Plot[]>([])
  const obstaclesRef = useRef<Array<{ x: number; y: number; w: number; h: number }>>([])

  // Initialize plots & obstacles once
  useEffect(() => {
    const plots: Plot[] = []
    const cols = 5
    const rows = 3
    const margin = 16
    const plotW = 100
    const plotH = 80
    const startX = 140
    const startY = 110

    const crops: CropType[] = ["wheat", "rice", "vegetables"]

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        plots.push({
          x: startX + c * (plotW + margin),
          y: startY + r * (plotH + margin),
          w: plotW,
          h: plotH,
          state: "raw",
          growth: 0,
          moisture: 30 + Math.random() * 20,
          pests: 10 + Math.random() * 10,
          harvestAnim: 0,
          crop: crops[(r * cols + c) % crops.length],
        })
      }
    }
    plotsRef.current = plots
    obstaclesRef.current = [
      { x: 520, y: 260, w: 40, h: 30 },
      { x: 880, y: 420, w: 36, h: 36 },
      { x: 740, y: 140, w: 28, h: 28 },
    ]
  }, [])

  // Keyboard handling: move tractor & action key
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true
      if (e.key === " ") {
        e.preventDefault()
        performAction()
      }
    }
    const up = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false
    }
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [tool])

  // Season changes every 20 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setSeason((s) => (s === "summer" ? "monsoon" : s === "monsoon" ? "winter" : "summer"))
      setMessage("Season changed!")
    }, 20000)
    return () => clearInterval(id)
  }, [])

  // Main game loop: update & render
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return

    const step = () => {
      const t = tractorRef.current
      const k = keysRef.current

      // Movement keys
      const up = k["arrowup"] || k["w"]
      const down = k["arrowdown"] || k["s"]
      const left = k["arrowleft"] || k["a"]
      const right = k["arrowright"] || k["d"]

      let ax = 0
      let ay = 0
      const curSpeed = Math.max(1, t.speed - (drip ? 0 : 0.2))
      if (up) ay -= curSpeed
      if (down) ay += curSpeed
      if (left) ax -= curSpeed
      if (right) ax += curSpeed

      // tentative move with obstacle collision
      let nx = Math.max(10, Math.min(WORLD_W - 10, t.x + ax))
      let ny = Math.max(10, Math.min(WORLD_H - 10, t.y + ay))
      const collides = (x: number, y: number) => {
        return obstaclesRef.current.some((o) => x > o.x && x < o.x + o.w && y > o.y && y < o.y + o.h)
      }
      if (!collides(nx, t.y)) t.x = nx
      if (!collides(t.x, ny)) t.y = ny

      // Fuel consumption when moving
      if (up || down || left || right) {
        setFuel((f) => Math.max(0, f - 0.02 * (solar ? 0.6 : 1)))
      }

      // Update plots: moisture, growth, pests, harvest animation
      plotsRef.current.forEach((p) => {
        // Moisture evaporation & monsoon effect
        const evap = season === "monsoon" ? 0.02 : season === "summer" ? 0.08 : 0.05
        p.moisture = Math.max(0, p.moisture - evap)
        if (season === "monsoon") p.moisture = Math.min(100, p.moisture + 0.03)

        // Growth depending on moisture and pests
        if (p.state === "seeded" || p.state === "growing") {
          const moistureBand = p.moisture >= 60 ? 0.45 : p.moisture >= 30 ? 0.22 : 0.06
          const pestsPenalty = 1 - Math.min(p.pests, 80) / 120
          const increment = moistureBand * pestsPenalty * growthSpeed
          p.growth = Math.min(100, p.growth + increment)
          if (p.growth >= 25 && p.state === "seeded") p.state = "growing"
          if (p.growth >= 100) p.state = "ready"
        }

        // Pests dynamics; ladybugs helps
        const pestDrift = ladybugs ? -0.06 : 0.04
        p.pests = Math.min(100, Math.max(0, p.pests + pestDrift))

        // Harvest animation fade out
        if (p.harvestAnim && p.harvestAnim > 0) {
          p.harvestAnim = Math.max(0, p.harvestAnim - 0.05)
        }
      })

      // Low fuel or water warnings
      if (fuel <= 5) setMessage("Low fuel! Solar charging helps reduce fuel usage.")
      if (water <= 5) setMessage("Low water! Enable drip to save water.")
    }

    const render = () => {
      const ctx = canvasRef.current?.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, WORLD_W, WORLD_H)

      // Background grass stripes
      const grad = ctx.createLinearGradient(0, 0, 0, WORLD_H)
      grad.addColorStop(0, "#eefbe7")
      grad.addColorStop(1, "#e5f6dd")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, WORLD_W, WORLD_H)

      // Farm border
      ctx.strokeStyle = "#9CA3AF"
      ctx.lineWidth = 3
      ctx.strokeRect(10, 10, WORLD_W - 20, WORLD_H - 20)

      // Fence posts
      ctx.strokeStyle = "#bfa38a"
      for (let x = 16; x < WORLD_W - 16; x += 28) {
        ctx.beginPath()
        ctx.moveTo(x, 10)
        ctx.lineTo(x, 26)
        ctx.moveTo(x, WORLD_H - 10)
        ctx.lineTo(x, WORLD_H - 26)
        ctx.stroke()
      }

      // Legend text
      ctx.fillStyle = "#6b7280"
      ctx.font = "12px Inter, system-ui, sans-serif"
      ctx.fillText(
        "Legend: brown=raw, tan=tilled, green=growing, gold=ready | Blue=moisture, Red=pests",
        16,
        24,
      )

      // Barn (unload area)
      ctx.save()
      ctx.translate(barnRect.x, barnRect.y)
      ctx.fillStyle = "#b91c1c"
      ctx.fillRect(0, 20, barnRect.w, barnRect.h - 20)
      ctx.fillStyle = "#7f1d1d"
      ctx.beginPath()
      ctx.moveTo(-6, 20)
      ctx.lineTo(barnRect.w / 2, -10)
      ctx.lineTo(barnRect.w + 6, 20)
      ctx.fill()
      ctx.fillStyle = "#1f2937"
      ctx.fillRect(barnRect.w / 2 - 18, barnRect.h - 48, 36, 48)
      ctx.fillStyle = "#fde68a"
      ctx.fillRect(barnRect.w / 2 - 26, 28, 52, 14)
      ctx.fillStyle = "#7c2d12"
      ctx.fillText("BARN", barnRect.w / 2 - 18, 39)
      ctx.restore()

      // Obstacles (rocks)
      obstaclesRef.current.forEach((o) => {
        ctx.fillStyle = "#4b5563"
        ctx.fillRect(o.x, o.y, o.w, o.h)
        ctx.strokeStyle = "#1f2937"
        ctx.strokeRect(o.x, o.y, o.w, o.h)
      })

      // Draw plots
      const time = performance.now() / 1000
      plotsRef.current.forEach((p, i) => {
        let fill = "#8b5e34" // raw
        if (p.state === "tilled") fill = "#d2b48c"
        if (p.state === "seeded") fill = "#e2f7da"
        if (p.state === "growing") fill = "#b8ec99"
        if (p.state === "ready") fill = "#f6d860"
        if (p.state === "harvested") fill = "#b7b7a4"
        ctx.fillStyle = fill
        ctx.fillRect(p.x, p.y, p.w, p.h)
        ctx.strokeStyle = "#374151"
        ctx.lineWidth = 2
        ctx.strokeRect(p.x, p.y, p.w, p.h)

        // Label (row,column)
        const row = Math.floor(i / GRID_COLS) + 1
        const col = (i % GRID_COLS) + 1
        ctx.fillStyle = "#111827"
        ctx.font = "bold 11px Inter, system-ui, sans-serif"
        ctx.fillText(`R${row}C${col}`, p.x + 6, p.y + 14)

        // Moisture bar
        ctx.fillStyle = "#93c5fd"
        ctx.fillRect(p.x, p.y + p.h + 6, (p.w * p.moisture) / 100, 4)
        // Pests bar
        ctx.fillStyle = "#ef4444"
        ctx.fillRect(p.x, p.y - 6, (p.w * p.pests) / 100, 4)

        // Seed/crop visuals
        if (p.state === "seeded" || p.state === "growing" || p.state === "ready") {
          const cols = 6
          const rows = 3
          const cellW = p.w / (cols + 1)
          const cellH = p.h / (rows + 1)
          const maxStem = p.h * 0.6
          const stemH = (Math.min(p.growth, 100) / 100) * maxStem
          for (let ry = 1; ry <= rows; ry++) {
            for (let cx = 1; cx <= cols; cx++) {
              const sx = p.x + cx * cellW
              const sy = p.y + ry * cellH
              const sway = Math.sin(time * 2 + (cx + ry)) * (p.state === "ready" ? 1.5 : 0.8)
              ctx.save()
              ctx.translate(sx, sy)
              ctx.rotate((sway * Math.PI) / 180)
              const stemColor = p.crop === "wheat" ? "#7c5e10" : "#166534"
              ctx.strokeStyle = p.state === "ready" ? "#8f7a19" : stemColor
              ctx.lineWidth = 2
              ctx.beginPath()
              ctx.moveTo(0, 0)
              ctx.lineTo(0, -Math.max(6, stemH))
              ctx.stroke()
              if (p.crop === "wheat") {
                ctx.fillStyle = p.state === "ready" ? "#e3b341" : "#c9a227"
                ctx.fillRect(-2, -Math.max(6, stemH) - 5, 4, 5)
              } else if (p.crop === "rice") {
                ctx.fillStyle = p.state === "ready" ? "#8bd97a" : "#4ade80"
                ctx.beginPath()
                ctx.arc(0, -Math.max(6, stemH) - 4, 3, 0, Math.PI * 2)
                ctx.fill()
              } else {
                ctx.fillStyle = p.state === "ready" ? "#84cc16" : "#34d399"
                ctx.beginPath()
                ctx.arc(-2, -Math.max(6, stemH) - 4, 2, 0, Math.PI * 2)
                ctx.arc(2, -Math.max(6, stemH) - 4, 2, 0, Math.PI * 2)
                ctx.fill()
              }
              ctx.restore()
            }
          }
        }

        // Harvest animation overlay
        if (p.harvestAnim && p.harvestAnim > 0) {
          ctx.save()
          ctx.globalAlpha = Math.min(0.6, p.harvestAnim)
          ctx.strokeStyle = "rgba(55,65,81,0.6)"
          for (let i = -10; i < p.w + 10; i += 8) {
            ctx.beginPath()
            ctx.moveTo(p.x + i, p.y)
            ctx.lineTo(p.x + i + 20, p.y + p.h)
            ctx.stroke()
          }
          ctx.restore()
        }

        // Growth label
        if (p.state === "growing" || p.state === "ready") {
          ctx.fillStyle = "#065f46"
          ctx.fillText(`${Math.round(p.growth)}%`, p.x + p.w - 28, p.y + 14)
        }
      })

      // Solar glow effect
      if (solar) {
        const t = tractorRef.current
        const rg = ctx.createRadialGradient(t.x, t.y, 4, t.x, t.y, 60)
        rg.addColorStop(0, "rgba(253,224,71,0.35)")
        rg.addColorStop(1, "rgba(253,224,71,0)")
        ctx.fillStyle = rg
        ctx.beginPath()
        ctx.arc(t.x, t.y, 60, 0, Math.PI * 2)
        ctx.fill()

        // Sun icon top-left
        ctx.save()
        ctx.translate(40, 40)
        ctx.fillStyle = "#fde047"
        ctx.beginPath()
        ctx.arc(0, 0, 10, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "#f59e0b"
        for (let a = 0; a < 8; a++) {
          const ang = (a * Math.PI) / 4
          ctx.beginPath()
          ctx.moveTo(Math.cos(ang) * 14, Math.sin(ang) * 14)
          ctx.lineTo(Math.cos(ang) * 22, Math.sin(ang) * 22)
          ctx.stroke()
        }
        ctx.restore()
      }

      // Day/Night overlay
      const dayTime = (Date.now() % 60000) / 60000
      const nightFactor = Math.max(0, Math.sin(dayTime * Math.PI * 2 + Math.PI / 2))
      if (nightFactor > 0.2) {
        ctx.save()
        ctx.fillStyle = `rgba(17,24,39,${0.35 * nightFactor})`
        ctx.fillRect(10, 10, WORLD_W - 20, WORLD_H - 20)
        const tHead = tractorRef.current
        const g2 = ctx.createRadialGradient(tHead.x, tHead.y, 4, tHead.x, tHead.y, 90)
        g2.addColorStop(0, "rgba(255,255,224,0.45)")
        g2.addColorStop(1, "rgba(255,255,224,0)")
        ctx.fillStyle = g2
        ctx.beginPath()
        ctx.arc(tHead.x, tHead.y, 90, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Draw tractor + trailer
      const t = tractorRef.current
      ctx.save()
      ctx.translate(t.x, t.y)

      // Trailer bed
      ctx.fillStyle = "#a16207"
      ctx.fillRect(-58, -12, 28, 18)
      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 1
      ctx.strokeRect(-58, -12, 28, 18)

      // Trailer wheels
      ctx.fillStyle = "#1f2937"
      ctx.fillRect(-56, -10, 4, 20)
      ctx.fillRect(-34, -10, 4, 20)

      // Tractor body
      ctx.fillStyle = "#1e3a8a"
      ctx.fillRect(-18, -12, 36, 24)
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 1
      ctx.strokeRect(-18, -12, 36, 24)

      // Tractor hood
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect(0, -11, 18, 22)
      ctx.strokeStyle = "#111827"
      ctx.strokeRect(0, -11, 18, 22)

      // Cabin glass and roof
      ctx.fillStyle = "#93c5fd"
      ctx.fillRect(-8, -8, 12, 14)
      ctx.strokeStyle = "#2563eb"
      ctx.strokeRect(-8, -8, 12, 14)
      ctx.fillStyle = "#1f2937"
      ctx.fillRect(-18, -14, 36, 3)

      // Wheels
      ctx.fillStyle = "#111827"
      ctx.beginPath()
      ctx.arc(-20, 10, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(20, 10, 8, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()

      // HUD Overlay
      ctx.fillStyle = "#111827"
      ctx.font = "12px Inter, system-ui, sans-serif"
      ctx.fillText(
        `Fuel: ${fuel.toFixed(0)} | Water: ${water.toFixed(0)} | Coins: ${coins} | Cargo: ${cargo}/${cargoCapacity}`,
        16,
        WORLD_H - 16,
      )
    }

    const loop = () => {
      if (!paused) {
        step()
        render()
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [paused, tool, fuel, water, coins, cargo, drip, solar, ladybugs, season, growthSpeed])

  const performAction = () => {
    const t = tractorRef.current
    const plot = plotsRef.current.find((p) => t.x > p.x && t.x < p.x + p.w && t.y > p.y && t.y < p.y + p.h)
    if (!plot) {
      setMessage("Move tractor onto a plot to act.")
      return
    }

    if (tool === "plough") {
      if (plot.state === "raw" || plot.state === "harvested") {
        plot.state = "tilled"
        plot.growth = 0
        plot.moisture = Math.max(plot.moisture, 25)
        setFuel((f) => Math.max(0, f - 2))
        setMessage("Soil tilled. Ready for seeds.")
        playTone(220, 0.08, "square")
      } else {
        setMessage("This plot is not ready to plough.")
      }
    } else if (tool === "seed") {
      if (plot.state === "tilled") {
        plot.state = "seeded"
        plot.growth = 0
        setFuel((f) => Math.max(0, f - 1))
        setMessage("Seeds planted.")
        playTone(440, 0.1, "triangle")
      } else {
        setMessage("Plough first, then seed.")
      }
    } else if (tool === "irrigate") {
      if (water <= 0) {
        setMessage("No water left!")
        return
      }
      if (plot.state === "seeded" || plot.state === "growing") {
        const waterUse = drip ? 4 : 10
        setWater((w) => Math.max(0, w - waterUse))
        plot.moisture = Math.min(100, plot.moisture + (drip ? 25 : 45))
        setMessage(drip ? "Drip irrigation applied." : "Irrigated.")
        playTone(660, 0.08, "sine")
      } else {
        setMessage("Irrigate after seeding.")
      }
    } else if (tool === "harvest") {
      if (plot.state === "ready") {
        const pestPenalty = 1 - Math.min(plot.pests, 80) / 100
        const yieldKg = Math.max(5, Math.floor(30 * pestPenalty))
        plot.state = "harvested"
        plot.growth = 0
        plot.harvestAnim = 1
        setCargo((k) => Math.min(cargoCapacity, k + yieldKg))
        setMessage(`Harvested! +${yieldKg} kg loaded to trolley (capacity ${cargoCapacity}kg)`)
        playTone(520, 0.12, "square")
      } else {
        setMessage("Wait until crops are ready (fully grown).")
      }
    } else if (tool === "unload") {
      // unload at barn if nearby
      if (
        t.x > barnRect.x &&
        t.x < barnRect.x + barnRect.w &&
        t.y > barnRect.y &&
        t.y < barnRect.y + barnRect.h
      ) {
        if (cargo > 0) {
          const value = cargo
          setCargo(0)
          setCoins((c) => c + value)
          setMessage(`Unloaded at barn: +${value} coins`)
          playTone(300, 0.1, "triangle")
          // Optional: auto-complete when reaching a threshold
          if (coins + value >= 100) {
            onComplete?.(Math.min(100, coins + value))
          }
        } else {
          setMessage("Trolley is empty.")
        }
      } else {
        setMessage("Drive into the barn area to unload.")
      }
    }
  }

  // Simple WebAudio tone player
  const audioRef = useRef<AudioContext | null>(null)
  const ensureAudio = () => {
    if (!audioRef.current) {
      try {
        audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch {}
    }
    return audioRef.current
  }
  const playTone = (freq: number, dur = 0.1, type: OscillatorType = "sine") => {
    const ctx = ensureAudio()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.value = 0.04
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + dur)
  }

  return (
    <div className="space-y-3">
        <div className="flex gap-2 mb-2">
          <Button variant={tool === "plough" ? "secondary" : "outline"} onClick={() => setTool("plough")}>
            Plough
          </Button>
          <Button variant={tool === "seed" ? "secondary" : "outline"} onClick={() => setTool("seed")}>
            Seed
          </Button>
          <Button variant={tool === "irrigate" ? "secondary" : "outline"} onClick={() => setTool("irrigate")}>
            Irrigate
          </Button>
          <Button variant={tool === "harvest" ? "secondary" : "outline"} onClick={() => setTool("harvest")}>
            Harvest
          </Button>
          <Button variant={tool === "unload" ? "secondary" : "outline"} onClick={() => setTool("unload")}>
            Unload
          </Button>
        </div>
        <canvas ref={canvasRef} width={WORLD_W} height={WORLD_H} className="w-full rounded-lg border" />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onComplete?.(Math.min(100, coins))}>Finish & Submit</Button>
        </div>
        <div className="text-sm text-center text-gray-700">{message}</div>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <div className="flex items-center justify-between">
              <span>Fuel</span>
              <label className="inline-flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={solar}
                  onChange={() => setSolar(!solar)}
                  className="cursor-pointer"
                />
                <span>Solar</span>
              </label>
            </div>
            <Progress value={fuel} />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span>Water</span>
              <label className="inline-flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={drip}
                  onChange={() => setDrip(!drip)}
                  className="cursor-pointer"
                />
                <span>Drip</span>
              </label>
            </div>
            <Progress value={water} />
          </div>
          <div>
            <div>Ladybugs</div>
            <label className="inline-flex items-center space-x-1">
              <input
                type="checkbox"
                checked={ladybugs}
                onChange={() => setLadybugs(!ladybugs)}
                className="cursor-pointer"
              />
              <span>Ladybugs</span>
            </label>
          </div>
        </div>
    </div>
  )
}
