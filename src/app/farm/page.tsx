"use client"

import dynamic from 'next/dynamic'

const FarmZonePage = dynamic(() => import('./farm-content'), { ssr: false })

export default function FarmPage() {
  return <FarmZonePage />
}
