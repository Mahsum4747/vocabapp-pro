import {
  ceilingFromEnv,
  decideSpend,
  readAiActionsToday,
  type AiActionKind,
} from "./ai-budget";
import { utcDayKey } from "./today-summary";

/**
 * Spend one AI action for `userId`, atomically against both counters: the
 * user's own (`users/{uid}.aiActionsToday`) and the project-wide one
 * (`ai_usage/{utcDay}`). Call it immediately before a request to Gemini — never
 * on a cache hit — and don't retry on `ok: false`: the message is the answer.
 *
 * Deliberately not refunded when Gemini then fails: the request was made and
 * counts against the real quota either way.
 */
export async function spendAiAction(
  userId: string,
  kind: AiActionKind,
): Promise<{ ok: true; remaining: number } | { ok: false; error: string }> {
  const { getAdminFirestore } = await import("./firebase-admin.server");
  const db = getAdminFirestore();
  const now = Date.now();
  const dayKey = utcDayKey(now);
  const userRef = db.collection("users").doc(userId);
  const globalRef = db.collection("ai_usage").doc(dayKey);
  const ceiling = ceilingFromEnv(process.env.GEMINI_DAILY_CEILING);

  return db.runTransaction(async (tx) => {
    const [userSnap, globalSnap] = await Promise.all([tx.get(userRef), tx.get(globalRef)]);
    const user = readAiActionsToday(userSnap.data()?.aiActionsToday, now);
    const globalCount =
      typeof globalSnap.data()?.count === "number" ? (globalSnap.data()!.count as number) : 0;

    const decision = decideSpend({
      kind,
      userCount: user.count,
      globalCount,
      ceiling,
    });
    if (!decision.ok) return { ok: false as const, error: decision.error };

    tx.set(
      userRef,
      {
        id: userId,
        aiActionsToday: { dayKey, count: decision.userCount },
        updatedAt: now,
        ...(userSnap.exists ? {} : { createdAt: now }),
      },
      { merge: true },
    );
    tx.set(globalRef, { dayKey, count: decision.globalCount }, { merge: true });
    return { ok: true as const, remaining: decision.remaining };
  });
}
