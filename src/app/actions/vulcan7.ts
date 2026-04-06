'use server';

// Vulcan7 lead sync via Firestore has been removed.
// TODO: Reimplement using Prisma Contact model.

export async function syncVulcan7Leads(_userId: string, _csvData: string) {
  return { imported: 0, skipped: 0, duplicates: 0 };
}
