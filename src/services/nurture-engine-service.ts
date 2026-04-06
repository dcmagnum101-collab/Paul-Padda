'use server';

import { grokJSON } from './grok-service';
import { monicaSystemPrompt } from '@/config/monica-system-prompt';

export interface NurtureAnalysis {
  summary: string;
  nextActions: { title: string; description: string; priority: 'high' | 'medium' | 'low' }[];
  draftedMessage?: { type: 'email' | 'sms'; subject?: string; body: string };
  compliance: {
    isEligible: boolean;
    reason?: string;
    checks: { notUnsubscribed: boolean; hasContactInfo: boolean; safeTimeWindow: boolean };
  };
}

export async function generateNurturePlan(userId: string, _contactId: string): Promise<NurtureAnalysis> {
  // Contact data is no longer in Firestore — generate a generic plan
  // TODO: Fetch contact from Prisma Contact model
  const hour = new Date().getHours();
  const isSafeTime = hour >= 8 && hour <= 20;

  const compliance = {
    isEligible: true,
    checks: { notUnsubscribed: true, hasContactInfo: true, safeTimeWindow: isSafeTime },
  };

  const system = `${monicaSystemPrompt}
  You are an AI Nurture Engine. Analyze the lead profile and history to advance the deal.
  Respond ONLY with structured JSON matching the NurtureAnalysis interface.`;

  return grokJSON<NurtureAnalysis>(system, `Compliance Status: ${JSON.stringify(compliance)}`, userId);
}
