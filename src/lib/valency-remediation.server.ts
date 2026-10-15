import type { Firestore } from "firebase-admin/firestore";
import {
  evaluateReviewedValencyAnswer,
  reviewedValencyQuestions,
  type FixedValencySelection,
} from "./german/reviewed-valency-practice";
import { remediationNextReviewAt } from "./grammar-remediation";

export type ValencyAttempt = {
  operationId: string;
  selection: FixedValencySelection;
  answer: string;
};
export type ValencyAttemptRow = {
  id: string;
  topic: string;
  itemResult?: ValencyAttempt & { outcome: string };
  completedAt: number;
  nextReviewAt: number;
};

/** Server grades the immutable published item; no arbitrary sentences, client score or user ID. */
export async function saveValencyAttempt(
  db: Firestore,
  userId: string,
  input: ValencyAttempt,
  now = Date.now(),
) {
  const result = evaluateReviewedValencyAnswer(input.selection, input.answer);
  if (!result)
    return { ok: false as const, error: "This exercise version or answer is no longer valid." };
  const item = reviewedValencyQuestions().find(
    (q) => q.reviewedValencyItem!.exerciseId === input.selection.exerciseId,
  )!.reviewedValencyItem!;
  const ref = db.doc(`users/${userId}/grammarRemediation/${input.operationId}`);
  return db.runTransaction(async (tx) => {
    const existing = (await tx.get(ref)).data();
    if (existing) {
      if (
        !existing.itemResult ||
        existing.itemResult.answer !== input.answer ||
        existing.itemResult.outcome !== result.outcome ||
        (["exerciseId", "version", "recordId", "senseId", "sentence"] as const).some(
          (key) => existing.itemResult.selection?.[key] !== input.selection[key],
        )
      )
        return { ok: false as const, error: "This operation already contains another answer." };
      return {
        ok: true as const,
        completedAt: existing.completedAt as number,
        nextReviewAt: existing.nextReviewAt as number,
      };
    }
    const nextReviewAt = remediationNextReviewAt(now);
    tx.set(ref, {
      topic: "verb-patterns",
      diagnosticTargetId: item.recordId,
      correctCount: result.outcome === "correct" ? 1 : 0,
      totalCount: 1,
      completedAt: now,
      nextReviewAt,
      schemaVersion: 1,
      itemResult: { ...input, outcome: result.outcome },
    });
    if (result.outcome !== "correct")
      tx.set(db.doc(`users/${userId}/learningDiagnostics/${input.operationId}`), {
        domain: "grammar",
        category: "lexical_government",
        targetId: item.recordId,
        targetLabel: `${item.construction} ${item.preposition ?? ""} + ${item.case}`,
        context: "targeted_practice",
        occurredAt: now,
        confidence: 0.8,
        independent: false,
        support: "choice",
        schemaVersion: 1,
      });
    return { ok: true as const, completedAt: now, nextReviewAt };
  });
}

/** Latest answer per exact version; a memorized retry never becomes independent mastery. */
export function valencyReviewQueue(rows: ValencyAttemptRow[], now = Date.now()) {
  const latest = new Map<string, ValencyAttemptRow>();
  const known = new Map(
    reviewedValencyQuestions().map((q) => [
      q.reviewedValencyItem!.exerciseId,
      q.reviewedValencyItem!,
    ]),
  );
  for (const row of rows) {
    const attempt = row.itemResult,
      item = attempt && known.get(attempt.selection.exerciseId);
    if (
      row.topic !== "verb-patterns" ||
      !attempt ||
      !item ||
      row.completedAt > now ||
      evaluateReviewedValencyAnswer(attempt.selection, attempt.answer)?.outcome !== attempt.outcome
    )
      continue;
    const previous = latest.get(item.exerciseId);
    if (
      !previous ||
      row.completedAt > previous.completedAt ||
      (row.completedAt === previous.completedAt && row.id > previous.id)
    )
      latest.set(item.exerciseId, row);
  }
  return {
    mistakes: [...latest].filter(([, r]) => r.itemResult!.outcome !== "correct").map(([id]) => id),
    due: [...latest].filter(([, r]) => r.nextReviewAt <= now).map(([id]) => id),
  };
}
