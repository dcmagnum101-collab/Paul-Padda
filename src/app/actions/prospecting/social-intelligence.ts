'use server';

import { grokJSON } from '@/services/grok-service';

export async function analyzeSocialLeadAction(userId: string, payload: { platform: string; content: string; url?: string }) {
  const { platform, content } = payload;

  const extraction = await grokJSON<{
    name: string;
    motivation: string;
    urgency: 'hot' | 'warm' | 'cold';
    suggestedOpener: string;
    location?: string;
  }>(
    'You are a real estate social intelligence analyzer. Extract lead details from this post content. Return JSON.',
    `Platform: ${platform}\nContent: "${content}"`,
    userId
  );

  // TODO: Save to Prisma Contact model
  return { contactId: 'stub', success: true };
}

export async function scrapeYouTubeMonitorAction(_userId: string, _channelUrl: string) {
  return { potentialLeads: [], success: true };
}
