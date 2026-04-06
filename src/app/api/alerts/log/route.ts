export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200)

  const logs = await prisma.communicationLog.findMany({
    where: { type: 'HIGH_ALERT' },
    orderBy: { sentAt: 'desc' },
    take: limit,
  })

  return NextResponse.json(logs)
}
