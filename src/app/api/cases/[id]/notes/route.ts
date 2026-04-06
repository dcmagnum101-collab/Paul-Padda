export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { MOCK_USER_ID } from '@/lib/mock-user'

const createNoteSchema = z.object({
  content: z.string().min(1),
})

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {

  const notes = await prisma.note.findMany({
    where: { caseId: params.id },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(notes)
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {

  const body = await request.json()
  const parsed = createNoteSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })

  const note = await prisma.note.create({
    data: {
      caseId: params.id,
      content: parsed.data.content,
      authorId: MOCK_USER_ID,
    },
    include: { author: { select: { name: true } } },
  })

  return NextResponse.json(note, { status: 201 })
}
