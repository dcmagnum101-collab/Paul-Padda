'use server';

import { DEFAULT_GOALS, type Goals } from '@/lib/goals-constants';

// Goals storage via Firestore has been removed.
// TODO: Persist goals in Prisma User settings.

export async function saveGoals(_userId: string, _goals: Goals) {}

export async function getGoals(_userId: string): Promise<Goals> {
  return DEFAULT_GOALS;
}

export async function generateDailyRecap(_userId: string) {
  return { stats: { calls: 0, emails: 0, contacts: 0, appts: 0 }, goalsMet: true };
}
