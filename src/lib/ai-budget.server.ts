import { ceilingFromEnv, decideSpend, type AiActionKind } from "./ai-budget";
import { utcDayKey } from "./today-summary";

/**
 * Spend one AI action against the single project-wide daily pool — no
 * per-user counter, no `userId` parameter. Call it immediately before a
 * request to Gemini — never on a cache hit — and don't retry on
 * `ok: false`: the message is the answer.
 *
 * Deliberately not refunded when Gemini then fails: the request was made and
 * counts against the real quota either way.
 */
export async function spendAiAction(
  kind: AiActionKind,
): Promise<{ ok: true; remaining: number } | { ok: false; error: string }> {
  const { getAdminFirestore } = await import("./firebase-admin.server");
  const db = getAdminFirestore();
  const now = Date.now();
  const dayKey = utcDayKey(now);
  const globalRef = db.collection("ai_usage").doc(dayKey);
  const ceiling = ceilingFromEnv(process.env.GEMINI_DAILY_CEILING);

  return db.runTransaction(async (tx) => {
    const globalSnap = await tx.get(globalRef);
    const globalCount =
      typeof globalSnap.data()?.count === "number" ? (globalSnap.data()!.count as number) : 0;

    const decision = decideSpend({ kind, globalCount, ceiling });
    if (!decision.ok) return { ok: false as const, error: decision.error };

    tx.set(globalRef, { dayKey, count: decision.globalCount }, { merge: true });
    return { ok: true as const, remaining: decision.remaining };
  });
}
