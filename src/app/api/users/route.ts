export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {

  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
    },
    orderBy: [{ role: 'asc' }, { name: 'asc' }],
  })

  return NextResponse.json(users)
}
