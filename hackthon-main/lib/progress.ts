"use client"

export type Mission = {
  id: string
  title: string
  category: "water" | "soil" | "energy" | "waste"
  points: number
  completed: boolean
}

export type ProgressState = {
  weekStartISO: string // Monday ISO date
  missions: Mission[]
  streakCount: number
  lastCompletionISO?: string
  totalPoints: number
}

const STORAGE_KEY = "beejsetu-progress-v1"

function startOfWeek(date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay() || 7 // 1..7, Monday=1
  if (day !== 1) d.setHours(-24 * (day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}

function fmtISO(d: Date) {
  return d.toISOString().slice(0, 10)
}

function defaultMissions(): Mission[] {
  return [
    { id: "m-water-dawn", title: "Irrigate at dawn 2 times", category: "water", points: 50, completed: false },
    { id: "m-compost", title: "Apply compost to 1 plot", category: "soil", points: 60, completed: false },
    { id: "m-cover-crop", title: "Plan a cover crop for next season", category: "soil", points: 40, completed: false },
    { id: "m-solar", title: "Use solar pump for a day", category: "energy", points: 50, completed: false },
    { id: "m-waste", title: "Segregate plastic/agri waste", category: "waste", points: 30, completed: false },
  ]
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw) as ProgressState
      // Reset missions weekly
      const currentWeekISO = fmtISO(startOfWeek())
      if (data.weekStartISO !== currentWeekISO) {
        return { weekStartISO: currentWeekISO, missions: defaultMissions(), streakCount: data.streakCount || 0, totalPoints: data.totalPoints || 0 }
      }
      return data
    }
  } catch {}
  return { weekStartISO: fmtISO(startOfWeek()), missions: defaultMissions(), streakCount: 0, totalPoints: 0 }
}

export function saveProgress(p: ProgressState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)) } catch {}
}

export function toggleMission(id: string): ProgressState {
  const s = loadProgress()
  const m = s.missions.find(x => x.id === id)
  if (!m) return s
  m.completed = !m.completed
  if (m.completed) {
    s.totalPoints += m.points
    // streak logic
    const todayISO = fmtISO(new Date())
    if (!s.lastCompletionISO) {
      s.streakCount = Math.max(s.streakCount, 1)
    } else {
      const prev = new Date(s.lastCompletionISO)
      const diffDays = Math.floor((Date.now() - prev.getTime()) / 86400000)
      if (diffDays === 1) s.streakCount += 1
      else if (diffDays > 1) s.streakCount = 1
    }
    s.lastCompletionISO = todayISO
  }
  saveProgress(s)
  return s
}

export function sustainabilityScore(p: ProgressState): number {
  // Simple scoring: normalize weekly points to 0..100 and add streak bonus (max +20)
  const weeklyMax = 230 // sum of defaultMissions
  const base = Math.min(100, Math.round((p.missions.filter(m=>m.completed).reduce((a,b)=>a+b.points,0) / weeklyMax) * 100))
  const bonus = Math.min(20, p.streakCount)
  return Math.min(100, base + bonus)
}

export function leaderboardSample(currentName = "You", currentScore = 0) {
  const others = [
    { name: "Farmer A", score: 76 },
    { name: "Farmer B", score: 68 },
    { name: "Farmer C", score: 62 },
  ]
  const you = { name: currentName, score: currentScore }
  const list = [you, ...others].sort((a,b)=>b.score-a.score).slice(0, 20)
  return list
}