// Stub — Firebase errors removed.
export class FirestorePermissionError extends Error {
  context: { path?: string; operation?: string; requestResourceData?: any };
  constructor(context: { path?: string; operation?: string; requestResourceData?: any }) {
    super(`Firestore permission error on ${context.path}`);
    this.context = context;
  }
}
