export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
  assignedToId: z.string().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {

  const body = await request.json()
  const parsed = updateTaskSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })

  const updates: Record<string, unknown> = { ...parsed.data }

  if (parsed.data.dueDate) {
    updates.dueDate = new Date(parsed.data.dueDate)
  }

  if (parsed.data.status === 'COMPLETED') {
    updates.completedAt = new Date()
  }

  const task = await prisma.task.update({
    where: { id: params.id },
    data: updates as never,
  })

  return NextResponse.json(task)
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {

  await prisma.task.update({
    where: { id: params.id },
    data: { status: 'CANCELLED' },
  })

  return NextResponse.json({ success: true })
}
