'use client';
import { useMemo } from 'react';
// Stub — Firebase utils removed.
export function useMemoFirebase<T>(factory: () => T | null, deps: readonly any[]): T | null {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps as any);
}
