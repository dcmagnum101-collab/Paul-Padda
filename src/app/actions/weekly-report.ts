'use server';

import type { WeeklyReport } from '@/lib/weekly-report-types';

// Weekly report via Firestore has been removed.
// TODO: Reimplement using Prisma Case/Task data.

export async function generateWeeklyReport(_userId: string, weekStart: string): Promise<WeeklyReport> {
  return {
    headline: 'Weekly report not yet configured.',
    stats: { calls: 0, emails: 0, new_leads: 0, appointments: 0, warm_moves: 0, dead_leads: 0 },
    what_worked: [],
    what_to_improve: [],
    next_week_focus: 'Configure Prisma-backed reporting.',
    lead_type_breakdown: {},
  };
}

export async function sendReportToUser(_userId: string, _report: WeeklyReport) {
  return { success: true };
}
