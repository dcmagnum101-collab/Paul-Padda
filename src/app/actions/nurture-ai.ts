'use server';

import { grokJSON } from '@/services/grok-service';
import { monicaSystemPrompt } from '@/config/monica-system-prompt';

export async function generateNurtureEmail(_userId: string, _contactId: string) {
  return grokJSON<{
    subject: string;
    body: string;
    compliance_notes: string;
    suggested_followup_days: number;
  }>(
    `${monicaSystemPrompt}\nGenerate a follow-up email. Return JSON: { subject, body, compliance_notes, suggested_followup_days }`,
    'Generate a professional follow-up email.',
    _userId
  );
}

export async function generateConversationCoaching(_userId: string, _contactId: string) {
  return grokJSON<{
    talking_points: string[];
    objections: string[];
    responses: string[];
    avoid: string[];
    goal: string;
  }>(
    `${monicaSystemPrompt}\nProvide call coaching. Return JSON with talking_points, objections, responses, avoid, goal.`,
    'Provide coaching for an outreach call.',
    _userId
  );
}
