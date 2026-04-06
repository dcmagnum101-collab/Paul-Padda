'use server';

import { queryLVRListings, normalizeLVRProperty, getMarketVitals } from '@/services/lvr-mls-service';

export async function syncLVRListings(payload: {
  type: 'active' | 'expired' | 'pending' | 'sold';
  zipCodes: string[];
  userId: string;
}) {
  const { type, zipCodes } = payload;

  let statusCodes: string[] = [];
  let source = 'mls-sync';
  let extraFilter = '';

  switch (type) {
    case 'active':
      statusCodes = ['Active'];
      source = 'mls-active';
      break;
    case 'expired': {
      statusCodes = ['Expired', 'Withdrawn'];
      source = 'expired-mls';
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      extraFilter = `ExpirationDate ge ${thirtyDaysAgo.toISOString().split('T')[0]}`;
      break;
    }
    case 'pending':
      statusCodes = ['Pending', 'Under Contract'];
      source = 'mls-pending';
      break;
    case 'sold':
      statusCodes = ['Closed'];
      source = 'mls-sold';
      break;
  }

  const rawListings = await queryLVRListings({ status: statusCodes, zipCodes, filter: extraFilter });
  // TODO: Save to Prisma Contact model instead of Firestore
  return { success: true, imported: 0, duplicates: 0, total: rawListings.length };
}

export async function getExpiringLeadsAction(_userId: string, zipCodes: string[]) {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const filter = `ExpirationDate le ${nextWeek.toISOString().split('T')[0]} and ExpirationDate ge ${new Date().toISOString().split('T')[0]}`;
  const raw = await queryLVRListings({ status: ['Active'], zipCodes, filter });
  return Promise.all(raw.map(async (r: any) => normalizeLVRProperty(r, 'pre-expiry-alert')));
}

export async function fetchNeighborhoodStats(userId: string, zipCodes: string[]) {
  return Promise.all(zipCodes.map(zip => getMarketVitals(userId, zip)));
}

export async function refreshListingDetailAction(_userId: string, mlsNumber: string) {
  const raw = await queryLVRListings({ status: ['Active', 'Expired', 'Closed', 'Pending'], zipCodes: [], filter: `ListingId eq '${mlsNumber}'` });
  if (!raw.length) throw new Error('Listing not found in LVR feed.');
  return normalizeLVRProperty(raw[0], 'mls-refresh');
}
