'use server';

// Lead import via Firestore has been removed.
// TODO: Reimplement using Prisma Contact model.

type ImportResult = { imported: number; skipped: number; duplicates: number };

export async function importVulcan7CSV(_userId: string, _csvData: string): Promise<ImportResult> {
  return { imported: 0, skipped: 0, duplicates: 0 };
}

export async function importArchAgentCSV(_userId: string, _csvData: string): Promise<ImportResult> {
  return { imported: 0, skipped: 0, duplicates: 0 };
}

export async function importRedXCSV(_userId: string, _csvData: string): Promise<ImportResult> {
  return { imported: 0, skipped: 0, duplicates: 0 };
}
