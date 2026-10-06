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
    collection: (collectionPath: string) => ({
      where: () => ({ get: async () => ({ docs: [] }) }),
      orderBy: (field: string, direction: string) => ({
        limit: (limit: number) => ({
          get: async () => ({
            docs: [...records.entries()]
              .filter(
                ([path]) =>
                  path.startsWith(`${collectionPath}/`) &&
                  !path.slice(collectionPath.length + 1).includes("/"),
              )
              .sort(([ap, av], [bp, bv]) => {
                const a = (av as Record<string, number | null>)[field];
                const b = (bv as Record<string, number | null>)[field];
                const delta = (a ?? -1) - (b ?? -1);
                return direction === "desc"
                  ? -(delta || ap.localeCompare(bp))
                  : delta || ap.localeCompare(bp);
              })
              .slice(0, limit)
              .map(([path]) => ({ ...row(path), id: path.split("/").at(-1)! })),
          }),
        }),
      }),
    }),
    recursiveDelete: async (reference: DocumentReference) => {
      for (const path of records.keys())
        if (path === reference.path || path.startsWith(`${reference.path}/`)) records.delete(path);
    },
  } as unknown as Firestore;
  return { db, records, writes, retries: () => retries };
}
