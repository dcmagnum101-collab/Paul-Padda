export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MOCK_USER_ID } from '@/lib/mock-user'

async function resolveFlag(params: { id: string }) {

  await prisma.auditFlag.update({
    where: { id: params.id },
    data: {
      isResolved: true,
      resolvedAt: new Date(),
      resolvedBy: MOCK_USER_ID,
    },
  })

  return NextResponse.json({ success: true })
}

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  return resolveFlag(params)
}

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  return resolveFlag(params)
}
