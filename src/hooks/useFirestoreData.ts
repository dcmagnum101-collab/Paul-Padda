'use client';
// Stub — Firestore data hooks removed. Data fetching uses server actions + Prisma.
import { useMemo } from 'react';

export function useContacts(_filters?: any) {
  return { data: null as any[] | null, isLoading: false, error: null, loadMore: () => {}, hasMore: false };
}

export function useTasks(_status?: string) {
  return { data: null as any[] | null, isLoading: false, error: null };
}

export function useCallLogs(_contactId: string) {
  return { data: null as any[] | null, isLoading: false, error: null };
}

export function useAppointments() {
  return { data: null as any[] | null, isLoading: false, error: null };
}

export function useConversationHistory(_contactId: string) {
  return { data: [] as any[], isLoading: false, error: null };
}
