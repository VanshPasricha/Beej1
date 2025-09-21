import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function geocode(name: string) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 6000)
  try {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
    url.searchParams.set('name', name)
    url.searchParams.set('count', '1')
    url.searchParams.set('language', 'en')
    url.searchParams.set('format', 'json')
    const res = await fetch(url.toString(), { cache: 'no-store', signal: controller.signal })
    if (!res.ok) throw new Error('Geocoding failed')
    const data = await res.json()
    const first = data?.results?.[0]
    if (!first) throw new Error('Location not found')
    return { lat: first.latitude as number, lon: first.longitude as number, name: `${first.name}, ${first.admin1 || first.country}` }
  } finally {
    clearTimeout(timeout)
  }
}

async function getWeather(lat: number, lon: number) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 6000)
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', String(lat))
    url.searchParams.set('longitude', String(lon))
    url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index,cloud_cover,weather_code')
    url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,time')
    url.searchParams.set('timezone', 'auto')
    const res = await fetch(url.toString(), { cache: 'no-store', signal: controller.signal })
    if (!res.ok) throw new Error('Weather fetch failed')
    const data = await res.json()
    return data
  } finally {
    clearTimeout(timeout)
  }
}

function conditionFromWmo(code: number): { label: string; key: 'sunny'|'cloudy'|'rainy' } {
  // Simplified mapping
  if ([0,1].includes(code)) return { label: 'Sunny', key: 'sunny' }
  if ([2,3,45,48].includes(code)) return { label: 'Cloudy', key: 'cloudy' }
  return { label: 'Rainy', key: 'rainy' }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || 'Pune, Maharashtra'

  // Default fallback payload
  const fallback = {
    location: q,
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 60,
    windSpeed: 10,
    uvIndex: 6,
    forecast: [
      { day: 'Today', high: 32, low: 22, condition: 'sunny' as const },
      { day: 'Tomorrow', high: 30, low: 21, condition: 'cloudy' as const },
      { day: 'Wed', high: 29, low: 20, condition: 'rainy' as const },
    ],
  }

  try {
    const { lat, lon, name } = await geocode(q)
    const data = await getWeather(lat, lon)

    const wmo = Number(data?.current?.weather_code ?? 1)
    const cond = conditionFromWmo(wmo)

    const forecast = (data?.daily?.time || []).slice(0, 3).map((day: string, idx: number) => {
      const high = Math.round((data.daily.temperature_2m_max?.[idx] ?? 0))
      const low = Math.round((data.daily.temperature_2m_min?.[idx] ?? 0))
      const code = Number(data.daily.weather_code?.[idx] ?? 1)
      const c = conditionFromWmo(code)
      return { day: idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : new Date(day).toLocaleDateString('en-US', { weekday: 'short' }), high, low, condition: c.key }
    })

    const payload = {
      location: name,
      temperature: Math.round(Number(data?.current?.temperature_2m ?? 0)),
      condition: cond.label,
      humidity: Number(data?.current?.relative_humidity_2m ?? 0),
      windSpeed: Math.round(Number(data?.current?.wind_speed_10m ?? 0)),
      uvIndex: Number(data?.current?.uv_index ?? 0),
      forecast,
    }

    return NextResponse.json({ ok: true, weather: payload })
  } catch (e: any) {
    // Graceful fallback to avoid 500s
    return NextResponse.json({ ok: true, weather: fallback, fallbackUsed: true, error: e?.message }, { status: 200 })
  }
}
