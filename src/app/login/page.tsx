'use client'

// AUTH DISABLED — login page bypassed, redirect to dashboard
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard')
  }, [router])
  return null
}
