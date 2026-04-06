export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { MOCK_USER_ID } from '@/lib/mock-user'

const createSchema = z.object({
  caseId: z.string().nullable().optional(),
  hours: z.number().min(0.01).max(24),
  description: z.string().optional(),
  billable: z.boolean().optional().default(true),
  date: z.string().optional(),
})

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)
  const caseId = searchParams.get('caseId')
  const userId = searchParams.get('userId')

  const entries = await prisma.timeEntry.findMany({
    where: {
      ...(caseId ? { caseId } : {}),
      ...(userId ? { userId } : { userId: MOCK_USER_ID }),
    },
    include: {
      case: { select: { caseNumber: true, title: true } },
      user: { select: { name: true } },
    },
    orderBy: { date: 'desc' },
    take: 100,
  })

  return NextResponse.json(entries)
}

export async function POST(request: Request) {

  const body = await request.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })

  const { caseId, hours, description, billable, date } = parsed.data

  const entry = await prisma.timeEntry.create({
    data: {
      caseId: caseId || null,
      userId: MOCK_USER_ID,
      hours,
      description: description ?? '',
      billable: billable ?? true,
      date: date ? new Date(date) : new Date(),
    },
    include: {
      case: { select: { caseNumber: true, title: true } },
    },
  })

  return NextResponse.json(entry, { status: 201 })
}
