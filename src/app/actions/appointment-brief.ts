'use server';

import { grokJSON } from '@/services/grok-service';

export interface AppointmentBrief {
  property_summary: string;
  seller_motivation: string;
  pricing_approach: string;
  likely_objections: string[];
  objection_responses: string[];
  conversation_starters: string[];
  things_to_avoid: string[];
  close_strategy: string;
  nevada_specific_notes: string;
}

export async function generateAppointmentBrief(userId: string, _contactId: string): Promise<AppointmentBrief> {
  // Contact data is no longer in Firestore — generate a generic brief
  // TODO: Fetch contact from Prisma Contact model
  const system = `You are an elite listing agent coach. Generate a pre-appointment intelligence brief.
  Return ONLY valid JSON: { "property_summary": string, "seller_motivation": string, "pricing_approach": string, "likely_objections": string[], "objection_responses": string[], "conversation_starters": string[], "things_to_avoid": string[], "close_strategy": string, "nevada_specific_notes": string }`;

  return grokJSON<AppointmentBrief>(system, 'Generate a professional appointment brief for a listing consultation.', userId);
}
