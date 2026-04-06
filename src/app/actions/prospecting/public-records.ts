'use server';

// Public records sync via Firestore has been removed.
// TODO: Save to Prisma Contact model.

export async function syncPublicRecordsAction(_userId: string, _payload: { zipCode: string; type: 'preforeclosure' | 'probate' }) {
  return { imported: 0, success: true };
}
