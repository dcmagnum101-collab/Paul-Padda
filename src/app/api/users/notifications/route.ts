export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { MOCK_USER_ID } from '@/lib/mock-user'

const schema = z.object({
  notifyMorning: z.boolean().optional(),
  notifyNightly: z.boolean().optional(),
  notifyAlerts: z.boolean().optional(),
  notifySMS: z.boolean().optional(),
})

export async function PATCH(request: Request) {

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  await prisma.user.update({
    where: { id: MOCK_USER_ID },
    data: parsed.data,
  })

  return NextResponse.json({ success: true })
}
