'use server';

import { grokJSON } from '@/services/grok-service';
import { searchTrulia, normalizeTruliaListing } from '@/services/trulia-service';
import { MONICA_MARKET_HASHES } from '@/config/trulia-constants';

export interface CMAComp {
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  soldPrice: number;
  soldDate: string;
  daysOnMarket: number;
  pricePerSqFt: number;
}

export interface CMAReport {
  subject: any;
  comparables: CMAComp[];
  analysis: {
    recommendedPrice: number;
    priceRange: { low: number; target: number; high: number };
    narrative: string;
    marketInsight: string;
  };
  generatedAt: string;
}

export async function generateCMAReport(userId: string, contactId: string): Promise<CMAReport> {
  // Contact data is no longer in Firestore — return a stub report
  // TODO: Fetch contact from Prisma Contact model
  const subject = { propertyAddress: 'Unknown', beds: 3, baths: 2, sqft: 1500, zip: '89101' };

  const hash = MONICA_MARKET_HASHES.las_vegas;
  const truliaRes = await searchTrulia(userId, {
    encodedHash: hash,
    listingType: 'SOLD',
    filters: { zipCode: subject.zip },
  });

  const rawComps = (truliaRes?.data || []).slice(0, 5);
  const comparables: CMAComp[] = rawComps.map((c: any) => ({
    address: c.location?.formattedAddress || 'Comp Address',
    beds: c.bedrooms || 0,
    baths: c.bathrooms || 0,
    sqft: c.floorSpace?.floorSpaceValue || 0,
    soldPrice: c.soldPrice?.amount || c.price?.amount || 0,
    soldDate: c.soldDate || new Date().toISOString(),
    daysOnMarket: c.daysOnMarket || 30,
    pricePerSqFt: (c.soldPrice?.amount || 0) / (c.floorSpace?.floorSpaceValue || 1),
  }));

  const system = `You are a pricing analyst. Perform a CMA. Return ONLY valid JSON: { "recommendedPrice": number, "priceRange": { "low": number, "target": number, "high": number }, "narrative": string, "marketInsight": string }`;
  const analysis = await grokJSON<CMAReport['analysis']>(system, `COMPS: ${JSON.stringify(comparables)}`, userId);

  return { subject, comparables, analysis, generatedAt: new Date().toISOString() };
}
