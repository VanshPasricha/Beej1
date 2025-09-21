import { NextResponse } from 'next/server'
import * as db from '@/lib/database'

export const runtime = 'nodejs'

export async function GET() {
  try {
    await db.initializeDatabase()
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 })
  }
}
