// AUTH DISABLED — middleware passes all requests through for UI testing
import { NextRequest, NextResponse } from 'next/server'

export function middleware(_req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.ico).*)',
  ],
}
