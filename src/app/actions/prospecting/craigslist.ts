'use server';

import { grokJSON } from '@/services/grok-service';

export async function syncCraigslistFSBOAction(userId: string, payload: { city: string }) {
  const { city } = payload;
  const baseUrl = `https://${city}.craigslist.org/search/fsbo?format=json`;

  const res = await fetch(baseUrl);
  if (!res.ok) throw new Error('Craigslist fetch failed');
  const data = await res.json();

  const items = data[1] || [];
  let imported = 0;
  let analyzed = 0;

  for (const item of items.slice(0, 15)) {
    analyzed++;
    const system = 'You are a real estate lead analyzer. Extract the property address and motivation from this Craigslist title and snippet. Return JSON.';
    const extraction = await grokJSON<{ address: string; bedrooms: number; motivation: string }>(
      system,
      `Title: ${item.Title}\nSnippet: ${item.Body || 'N/A'}`,
      userId
    );
    if (!extraction.address) continue;
    // TODO: Save to Prisma Contact model
    imported++;
  }

  return { imported, analyzed, success: true };
}
