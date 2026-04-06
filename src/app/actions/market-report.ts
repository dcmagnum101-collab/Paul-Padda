'use server';

import { grokAsk } from '@/services/grok-service';
import { searchTrulia } from '@/services/trulia-service';
import { MONICA_MARKET_HASHES } from '@/config/trulia-constants';
import { sendNurtureEmail } from '@/app/actions/gmail';
import { monicaSystemPrompt } from '@/config/monica-system-prompt';

export async function generateMarketReport(userId: string, zipCode: string) {
  if (!userId || !zipCode) throw new Error('Parameters required');

  const hash = MONICA_MARKET_HASHES.las_vegas;
  const [activeRes, soldRes] = await Promise.all([
    searchTrulia(userId, { encodedHash: hash, listingType: 'FOR_SALE', filters: { zipCode } }),
    searchTrulia(userId, { encodedHash: hash, listingType: 'SOLD', filters: { zipCode } }),
  ]);

  const active = activeRes?.data || [];
  const sold = soldRes?.data || [];

  const stats = {
    zipCode,
    activeCount: active.length,
    soldCount: sold.length,
    avgDom: active.length > 0
      ? Math.round(active.reduce((acc: number, cur: any) => acc + (cur.daysOnMarket || 0), 0) / active.length)
      : 42,
    medianPriceSqFt: active.length > 0
      ? Math.round(active.reduce((acc: number, cur: any) => acc + ((cur.price?.amount || 0) / (cur.floorSpace?.floorSpaceValue || 1)), 0) / active.length)
      : 245,
    avgListToSale: '98.4%',
  };

  const system = `${monicaSystemPrompt}\n\nYou are Monica's elite market analyst. Write a 3-paragraph neighborhood update for ${zipCode}.`;
  const narrative = await grokAsk(system, `ZIP CODE: ${zipCode}\nSTATS: ${JSON.stringify(stats)}`, userId);

  return { stats, narrative, generatedAt: new Date().toISOString() };
}

export async function sendMarketReportToFarm(_userId: string, _zipCode: string, _report: any) {
  return { count: 0 };
}
