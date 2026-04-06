// AUTH DISABLED — next-auth removed for UI testing
// Restore NextAuth config here when re-enabling auth

import { MOCK_USER } from './mock-user'

export async function auth() {
  return { user: MOCK_USER }
}

export async function signIn() {}
export async function signOut() {}
export const handlers = { GET: null, POST: null }
