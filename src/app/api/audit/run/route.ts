import { NextResponse } from 'next/server'
import { runFullAudit } from '@/lib/audit/engine'
import { MOCK_USER_ID } from '@/lib/mock-user'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST() {

  try {
    const { run, flagCount } = await runFullAudit(MOCK_USER_ID, 'MANUAL')
    return NextResponse.json({
      success: true,
      runId: run.id,
      casesScanned: run.casesScanned,
      flagsFound: flagCount,
      riskScore: run.riskScore,
    })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
