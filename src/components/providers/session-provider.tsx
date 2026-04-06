'use client'

// AUTH DISABLED — SessionProvider removed, renders children directly
export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
