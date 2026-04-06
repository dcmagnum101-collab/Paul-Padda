'use server';

import { searchRealtor } from '@/services/realtor-service';

export async function syncRealtorListingsAction(userId: string, payload: { zipCode: string; status: 'active' | 'sold' }) {
  const { zipCode } = payload;

  const rawData = await searchRealtor(userId, { city: 'Las Vegas', state_code: 'NV', limit: 40 });
  if (!rawData?.properties) return { imported: 0, duplicates: 0 };

  // TODO: Save normalized listings to Prisma Contact model
  return { imported: 0, duplicates: 0, success: true };
}
