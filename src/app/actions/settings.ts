'use server';

// Settings storage via Firestore has been removed.
// TODO: Migrate settings to the User model in Prisma or a dedicated Settings table.

export async function saveSettingsSection(
  _uid: string,
  _section: string,
  _data: Record<string, any>
) {
  return { success: true };
}

export async function loadAllSettings(_uid: string): Promise<Record<string, any>> {
  return {};
}
