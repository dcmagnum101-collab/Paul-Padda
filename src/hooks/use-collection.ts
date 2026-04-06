// Stub — Firestore hooks removed. Data fetching uses server actions + Prisma.
export function useCollection(_target: any) {
  return { data: [] as any[], loading: false, error: null };
}
