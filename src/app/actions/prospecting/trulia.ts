'use server';

import { searchTrulia } from '@/services/trulia-service';
import { MONICA_MARKET_HASHES } from '@/config/trulia-constants';

export async function syncTruliaListingsAction(userId: string, payload: { zipCode: string; type: 'for_sale' | 'recently_sold' | 'for_rent' }) {
  const { zipCode, type } = payload;
  const hash = MONICA_MARKET_HASHES.las_vegas;
  const listingType: 'FOR_SALE' | 'SOLD' = type === 'recently_sold' ? 'SOLD' : 'FOR_SALE';

  const rawData = await searchTrulia(userId, { encodedHash: hash, listingType, filters: { zipCode } });
  if (!rawData?.data) return { imported: 0, duplicates: 0 };

  // TODO: Save normalized listings to Prisma Contact model
  return { imported: 0, duplicates: 0, success: true };
}
