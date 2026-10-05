import type { DocumentReference, Firestore } from "firebase-admin/firestore";

/** Hermetic optimistic-transaction fixture; never initializes Firebase or a network. */
export function fakeProgressDb(initial: Record<string, unknown> = {}) {
  const records = new Map(Object.entries(structuredClone(initial)));
  const writes: string[] = [];
  let version = 0;
  let retries = 0;
  const ref = (path: string) => ({ path }) as DocumentReference;
  const row = (path: string, source = records) => ({
    data: () => structuredClone(source.get(path)),
  });
  const db = {
    doc: ref,
    getAll: async (...refs: DocumentReference[]) => refs.map((reference) => row(reference.path)),
    runTransaction: async (
      action: (tx: {
        get: (reference: DocumentReference) => Promise<ReturnType<typeof row>>;
        set: (reference: DocumentReference, value: unknown) => void;
      }) => Promise<unknown>,
    ) => {
      for (;;) {
        const before = version;
        const snapshot = structuredClone(records);
        const pending: [string, unknown][] = [];
        const result = await action({
          get: async (reference) => row(reference.path, snapshot),
          set: (reference, value) => pending.push([reference.path, structuredClone(value)]),
        });
        if (before !== version) {
          ++retries;
          continue;
        }
        for (const [path, value] of pending) {
          records.set(path, value);
          writes.push(path);
        }
        if (pending.length) ++version;
        return result;
      }
    },
    collection: () => ({ where: () => ({ get: async () => ({ docs: [] }) }) }),
    recursiveDelete: async (reference: DocumentReference) => {
      for (const path of records.keys())
        if (path === reference.path || path.startsWith(`${reference.path}/`)) records.delete(path);
    },
  } as unknown as Firestore;
  return { db, records, writes, retries: () => retries };
}
