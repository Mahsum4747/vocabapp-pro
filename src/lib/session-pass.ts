/**
 * Session length: a set can hold 50 cards while one sitting is 10. The POOL
 * (the set) is not the QUEUE (what one session serves).
 *
 * Two per-user, per-set facts, nothing else:
 *   - `cap`    how many cards one session serves (default min(20, setSize))
 *   - `served` ids finished during the current PASS through the set
 *
 * A session is the mode's own queue-ordered list (due → weak → new — this
 * file never orders or schedules anything), minus what this pass already
 * served, cut to `cap`. When every card of the set has been served the pass
 * is over: `served` resets to empty and the next session is drawn from the
 * whole set again (due/weak first, because that is the queue's order).
 *
 * Pure and framework-free. It does not touch `dueAt`, the due counts or the
 * Home summary: capping a session never changes how many cards are DUE.
 */
export type SetSession = {
  /** Absent = the default cap. */
  cap?: number;
  /** Card ids finished in the current pass. */
  served: string[];
};

export const DEFAULT_SESSION_CAP = 20;
/** Slider stops, in addition to "All" (= set size). */
export const SESSION_CAP_STOPS = [10, 20] as const;
/** Server-side ceiling on stored ids, so a runaway set can't bloat the user doc. */
export const MAX_SERVED_IDS = 2000;

export function readSetSession(stored: unknown): SetSession {
  const doc = (stored ?? {}) as Record<string, unknown>;
  const cap =
    typeof doc.cap === "number" && Number.isInteger(doc.cap) && doc.cap >= 1 ? doc.cap : undefined;
  const served = Array.isArray(doc.served)
    ? doc.served.filter((id): id is string => typeof id === "string").slice(0, MAX_SERVED_IDS)
    : [];
  return { ...(cap !== undefined ? { cap } : {}), served };
}

/** 1..setSize; the default is min(20, setSize). */
export function effectiveCap(cap: number | undefined, setSize: number): number {
  if (setSize <= 0) return 0;
  const wanted = cap ?? Math.min(DEFAULT_SESSION_CAP, setSize);
  return Math.min(setSize, Math.max(1, Math.round(wanted)));
}

/** Ids served this pass that still belong to the set (deleted cards drop out). */
export function servedInSet(session: SetSession, setCardIds: readonly string[]): string[] {
  const inSet = new Set(setCardIds);
  return session.served.filter((id) => inSet.has(id));
}

/**
 * This session's cards from an already queue-ordered list. Never invents a
 * card: fewer than `cap` left means fewer are served. If the mode's own pool
 * is entirely served already (a subset pool, e.g. only nouns) it falls back
 * to that pool rather than showing an empty round.
 */
export function takeSession<T extends { id: string }>(
  ordered: readonly T[],
  session: SetSession,
  setSize: number,
): T[] {
  const cap = effectiveCap(session.cap, setSize);
  const served = new Set(session.served);
  const rest = ordered.filter((card) => !served.has(card.id));
  return (rest.length > 0 ? rest : [...ordered]).slice(0, cap);
}

/**
 * Record one finished card. When that completes the pass (every card of the
 * set served) the list resets, so the next session starts a new pass.
 */
export function markServed(
  session: SetSession,
  cardId: string,
  setCardIds: readonly string[],
): SetSession {
  const served = servedInSet(session, setCardIds);
  if (!served.includes(cardId) && setCardIds.includes(cardId)) served.push(cardId);
  const passDone = setCardIds.length > 0 && served.length >= setCardIds.length;
  return { ...(session.cap !== undefined ? { cap: session.cap } : {}), served: passDone ? [] : served };
}

/** Cards not yet served in this pass. */
export function passRemaining(session: SetSession, setCardIds: readonly string[]): number {
  return Math.max(0, setCardIds.length - servedInSet(session, setCardIds).length);
}
