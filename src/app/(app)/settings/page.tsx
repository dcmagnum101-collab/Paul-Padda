import { prisma } from '@/lib/prisma'
import { Topbar } from '@/components/layout/topbar'
import { SettingsClient } from './settings-client'
import { MOCK_USER_ID } from '@/lib/mock-user'

export const metadata = { title: 'Settings | Padda Legal Intelligence' }

async function getSettingsData(userId: string) {
  const [currentUser, allUsers] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        notifyMorning: true,
        notifyNightly: true,
        notifyAlerts: true,
        notifySMS: true,
        image: true,
      },
    }),
    prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
      orderBy: { name: 'asc' },
    }),
  ])
  return { currentUser, allUsers }
}

export default async function SettingsPage() {
  const data = await getSettingsData(MOCK_USER_ID)

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Settings" subtitle="Account, notifications, and team management" />
      <SettingsClient
        currentUser={JSON.parse(JSON.stringify(data.currentUser))}
        allUsers={JSON.parse(JSON.stringify(data.allUsers))}
        userRole="ADMIN" // AUTH DISABLED: default role for UI testing
      />
    </div>
  )
}
