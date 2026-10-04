import type { DocumentReference, Firestore } from "firebase-admin/firestore";
import { foldRoundIntoRollingAccuracy, type RoundResult } from "./progress-window";
import { observeOperation } from "./diagnostics";
export type RoundState = {
  accuracy: number | null;
  totalAttempts: number;
  lastPracticedAt: number | null;
  recentRounds?: RoundResult[];
};
export function advanceRound<T extends RoundState>(
  previous: T,
  correct: number,
  total: number,
  now: number,
): T & { recentRounds: RoundResult[] } {
  const attempts = previous.totalAttempts ?? 0;
  if (!Number.isSafeInteger(attempts) || attempts < 0 || !Number.isSafeInteger(attempts + total))
    throw new Error("Invalid stored attempt counter");
  return {
    ...previous,
    ...foldRoundIntoRollingAccuracy(previous.recentRounds ?? [], correct, total),
    totalAttempts: attempts + total,
    lastPracticedAt: Math.max(previous.lastPracticedAt ?? 0, now),
  };
}
export async function recordTopicRound(
  db: Firestore,
  ref: DocumentReference,
  topicId: string,
  correct: number,
  total: number,
) {
  return observeOperation("grammar.progress", () =>
    db.runTransaction(async (tx) => {
      const doc = await tx.get(ref);
      const previous = doc.data()?.[topicId] ?? {
        topicId,
        totalAttempts: 0,
        lastPracticedAt: null,
        accuracy: null,
      };
      const next = { ...advanceRound(previous, correct, total, Date.now()), topicId };
      tx.set(ref, { [topicId]: next }, { merge: true });
      return next;
    }),
  );
}
export async function recordSavedRound<T extends RoundState>(
  db: Firestore,
  ref: DocumentReference,
  roundId: string,
  correct: number,
  total: number,
): Promise<T | null> {
  return observeOperation("paste.progress", () =>
    db.runTransaction(async (tx) => {
      const doc = await tx.get(ref);
      if (!doc.exists) return null;
      const receipt = ref.collection("roundReceipts").doc(roundId);
      const applied = await tx.get(receipt);
      const previous = doc.data() as T;
      const questions = doc.data()?.questions;
      if (Array.isArray(questions) && total !== questions.length)
        throw new Error("Round size does not match saved questions.");
      if (applied.exists) {
        if (applied.data()?.correct !== correct || applied.data()?.total !== total)
          throw new Error("Round ID already used with another result.");
        return previous;
      }
      const next = advanceRound(previous, correct, total, Date.now());
      tx.set(receipt, { correct, total, createdAt: next.lastPracticedAt });
      tx.set(ref, next, { merge: true });
      return next;
    }),
  );
}
export async function recordPassageCompletion(
  db: Firestore,
  ref: DocumentReference,
  level: string,
  passageId: string,
) {
  return observeOperation("lesen.completion", () =>
    db.runTransaction(async (tx) => {
      const doc = await tx.get(ref);
      const previous = doc.data()?.[level];
      const completedPassageIds = [
        ...new Set<string>([...(previous?.completedPassageIds ?? []), passageId]),
      ];
      tx.set(
        ref,
        {
          [level]: {
            completedPassageIds,
            lastPracticedAt: Math.max(previous?.lastPracticedAt ?? 0, Date.now()),
          },
        },
        { merge: true },
      );
      return { completedPassageIds };
    }),
  );
}

/** Retry saving content never replaces accumulated learning state. */
export async function saveIdempotentPasteTopic(
  db: Firestore,
  ref: DocumentReference,
  content: Record<string, unknown>,
  initial: object,
): Promise<void> {
  await db.runTransaction(async (tx) => {
    const existing = await tx.get(ref);
    if (!existing.exists) tx.set(ref, initial);
    else {
      const previous = existing.data()!;
      for (const key of Object.keys(content).filter((key) => key !== "id")) {
        if (JSON.stringify(previous[key]) !== JSON.stringify(content[key]))
          throw new Error("Topic ID already used with different content.");
      }
    }
  });
}
