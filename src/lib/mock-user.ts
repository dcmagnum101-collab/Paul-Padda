// MOCK USER — auth temporarily disabled for UI testing
// Replace with real session lookup when re-enabling auth

export const MOCK_USER = {
  id: 'mock-user-id',
  name: 'Paul Padda',
  email: 'paul@paulpaddalaw.com',
  image: null as string | null,
  role: 'ADMIN',
}

export const MOCK_USER_ID = MOCK_USER.id
