'use server';

import { grokJSON } from './grok-service';
import { monicaSystemPrompt } from '@/config/monica-system-prompt';
import { normalizePhone } from '@/lib/utils';

interface EnrichmentResult {
  firstName?: string;
  lastName?: string;
  name: string;
  email?: string;
  phone?: string;
  propertyAddress?: string;
  motivation?: string;
  location?: string;
  bio?: string;
}

export async function runProspectingJob(userId: string, url: string): Promise<string> {
  // TODO: Persist job to Prisma
  processEnrichmentJob(userId, 'stub-job-id', url);
  return 'stub-job-id';
}

async function processEnrichmentJob(userId: string, _jobId: string, url: string) {
  try {
    const system = `${monicaSystemPrompt}
    You are a web intelligence extractor for real estate leads.
    Extract structured contact and property info from a URL or text content.
    Return ONLY JSON.`;

    await grokJSON<EnrichmentResult>(
      system,
      `Extract lead data from this URL: ${url}. Focus on name, email, phone, and property address.`,
      userId
    );
    // TODO: Save extracted contact to Prisma Contact model
  } catch (error: any) {
    console.error('[Prospecting Worker] failure:', error);
  }
}
