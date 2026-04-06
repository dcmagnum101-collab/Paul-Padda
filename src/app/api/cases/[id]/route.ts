export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { MOCK_USER_ID } from '@/lib/mock-user'

const updateCaseSchema = z.object({
  title: z.string().optional(),
  status: z.string().optional(),
  stage: z.string().optional(),
  priority: z.string().optional(),
  estimatedValue: z.number().optional().nullable(),
  settlementOffer: z.number().optional().nullable(),
  settlementFinal: z.number().optional().nullable(),
  description: z.string().optional(),
  assignedToId: z.string().optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {

  const c = await prisma.case.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      assignedTo: { select: { id: true, name: true, email: true, role: true } },
      contacts: { include: { contact: true } },
      tasks: { include: { assignedTo: { select: { name: true } } }, orderBy: { dueDate: 'asc' } },
      documents: { orderBy: { createdAt: 'desc' } },
      notes: { include: { author: { select: { name: true } } }, orderBy: { createdAt: 'desc' } },
      auditFlags: { orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }] },
      stageHistory: { orderBy: { movedAt: 'desc' } },
    },
  })

  if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(c)
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {

  const body = await request.json()
  const parsed = updateCaseSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })

  const existing = await prisma.case.findUnique({ where: { id: params.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Track stage changes
  const updates: Record<string, unknown> = { ...parsed.data }
  if (parsed.data.stage && parsed.data.stage !== existing.stage) {
    updates.stageEnteredAt = new Date()
    await prisma.stageHistory.create({
      data: {
        caseId: params.id,
        fromStage: existing.stage as never,
        toStage: parsed.data.stage as never,
        movedBy: MOCK_USER_ID,
      },
    })
  }

  const updated = await prisma.case.update({
    where: { id: params.id },
    data: updates as never,
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {

  // Archive instead of delete
  await prisma.case.update({
    where: { id: params.id },
    data: { status: 'ARCHIVED' },
  })

  return NextResponse.json({ success: true })
}
