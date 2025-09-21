import { NextRequest, NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'

export const runtime = 'nodejs'

// Create or update a user profile (simple create for now)
export async function POST(req: NextRequest) {
  try {
    const NO_DB = process.env.NO_DB === 'true'
    const body = await req.json()
    const {
      farmerName,
      farmSize,
      location,
      phoneNumber,
      bio,
      cropsGrown = [],
      soilType,
    } = body || {}

    if (!farmerName || !farmSize || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // If database is disabled, return a mock response to keep the app functional
    if (NO_DB) {
      // Simulate creation and return a deterministic mock ID
      return NextResponse.json({ ok: true, userId: 1 })
    }

    const conn = await getConnection()

    // Create user
    const [userResult]: any = await conn.execute(
      'INSERT INTO users (name, mobile, profile_completed) VALUES (?, ?, ?)',
      [farmerName, phoneNumber || null, true]
    )
    const userId = userResult.insertId as number

    // Create user profile
    await conn.execute(
      `INSERT INTO user_profiles (user_id, age, gender, location, farming_experience, land_size, crop_types)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        null,
        null,
        location,
        null,
        farmSize ? Number(farmSize) : null,
        Array.isArray(cropsGrown) ? JSON.stringify({ crops: cropsGrown, soilType, bio }) : null,
      ]
    )

    return NextResponse.json({ ok: true, userId })
  } catch (e: any) {
    console.error('Error creating user:', e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
