// Stub — Firestore hooks removed. Data fetching uses server actions + Prisma.
export function useDocument(_collectionName: string, _docId: string) {
  return { data: null as any, loading: false, error: null };
}
