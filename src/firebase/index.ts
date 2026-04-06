'use client';

/**
 * Firebase compatibility shim — replaced with next-auth + Prisma.
 * All data hooks return empty results; useUser wraps next-auth session.
 */

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import type { ReactNode } from 'react';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function useUser() {
  const { data: session, status } = useSession();
  const user = session?.user
    ? {
        uid: (session.user as any).id ?? session.user.email ?? '',
        email: session.user.email ?? null,
        displayName: session.user.name ?? null,
        photoURL: session.user.image ?? null,
        isAnonymous: false,
      }
    : null;
  return { user, isUserLoading: status === 'loading', userError: null };
}

export function useAuth() { return null as any; }
export function useFirebaseApp() { return null as any; }
export function useFirestore() { return null as any; }
export function useFirebase() {
  return {
    user: null,
    isUserLoading: false,
    userError: null,
    areServicesAvailable: false,
    firebaseApp: null,
    firestore: null,
    auth: null,
  };
}

// ─── Memo helper ──────────────────────────────────────────────────────────────

export function useMemoFirebase<T>(factory: () => T | null, deps: readonly any[]): T | null {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps as any);
}

// ─── Data hooks (no-op — Firestore data model removed) ────────────────────────

export function useCollection(_query: any): { data: any[] | null; isLoading: boolean; error: null } {
  return { data: null, isLoading: false, error: null };
}

export function useDoc(_ref: any): { data: any; isLoading: boolean; error: null } {
  return { data: null, isLoading: false, error: null };
}

export function usePaginatedCollection(_query: any, _pageSize?: number) {
  return { data: null as any[] | null, isLoading: false, error: null, loadMore: () => {}, hasMore: false };
}

// ─── Mutation stubs (no-op) ───────────────────────────────────────────────────

export function updateDocumentNonBlocking(_ref: any, _data: any) {}
export function addDocumentNonBlocking(_ref: any, _data: any) {}
export function setDocumentNonBlocking(_ref: any, _data: any) {}
export function deleteDocumentNonBlocking(_ref: any) {}

// ─── Init stub ────────────────────────────────────────────────────────────────

export function initializeFirebase() {
  return { firebaseApp: null as any, auth: null as any, firestore: null as any, functions: null as any };
}

// ─── Provider stubs ───────────────────────────────────────────────────────────

export function FirebaseProvider({ children }: { children: ReactNode }) {
  return children as any;
}

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  return children as any;
}

// ─── Login stubs ──────────────────────────────────────────────────────────────

export async function initiateAnonymousSignIn() { return null; }
export async function initiateEmailSignUp(_email: string, _password: string) { return null; }
export async function initiateEmailSignIn(_email: string, _password: string) { return null; }
