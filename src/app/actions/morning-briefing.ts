'use server';

// Morning briefing via Firestore has been removed.
// TODO: Reimplement using Prisma Case/Task data.

export async function generateMorningBriefing(_userId: string, date: string) {
  return {
    date,
    briefing_text: 'Morning briefing is not yet configured for this system.',
    stats: { due_followups: 0, hot_expired: 0, tasks_due: 0 },
    generated_at: new Date().toISOString(),
    expires_at: new Date().toISOString(),
  };
}
