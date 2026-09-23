import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format, formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { StudyDeck, type DeckEntry } from "@/components/study-deck";
import { useStudyStore } from "@/lib/store";
import { buildLibrarySession, type ReviewSession } from "@/lib/review-session";
import { profileFor } from "@/lib/lang/profiles";
import type { QueueEntry } from "@/lib/srs";
import { newLeftToday } from "@/lib/today-summary";
import { isCardActive, resolveSetLanguages } from "@/lib/types";

type Search = { filter?: "weak"; set?: string };

export const Route = createFileRoute("/review")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    filter: search.filter === "weak" ? "weak" : undefined,
    // Scopes the library-wide round to one set's document id — same idea as
    // `?filter=weak`, but narrowing the pool instead of changing what counts
    // as due. Empty/whitespace reads as "no scope", same as omitting it.
    set: typeof search.set === "string" && search.set.trim() ? search.set.trim() : undefined,
  }),
  component: ReviewRoute,
});

/** Cross-set review is personal data end to end, so it is signed-in only. */
function ReviewRoute() {
  return (
    <AuthGate>
      <ReviewPage />
    </AuthGate>
  );
}

/**
 * How many never-seen cards one library-wide round introduces.
 *
 * Without a cap, a first visit would queue every card the learner owns. This
 * limits how much of the queue a session serves; it changes nothing about
 * scheduling.
 */
const NEW_CARDS_PER_SESSION = 20;

/** The band, as the learner sees it — the queue's ordering made visible. */
const BANDS: Record<QueueEntry["band"], { label: string; tone: DeckEntry["bandTone"] }> = {
  overdue: { label: "Overdue", tone: "danger" },
  due: { label: "Due today", tone: "primary" },
  weak: { label: "Needs practice", tone: "muted" },
  fresh: { label: "New", tone: "muted" },
  early: { label: "Ahead of schedule", tone: "muted" },
};

function ReviewPage() {
  const { filter, set: setId } = Route.useSearch();
  const sets = useStudyStore((s) => s.sets);
  const fetchSets = useStudyStore((s) => s.fetchSets);
  const fetchAllProgress = useStudyStore((s) => s.fetchAllProgress);
  const fetchTodaySummary = useStudyStore((s) => s.fetchTodaySummary);
  const toggleStar = useStudyStore((s) => s.toggleStar);

  // Same pool the queue reads, just narrowed to one set before it's built —
  // banding, ordering and the weak filter all behave exactly as they do
  // library-wide.
  const scopedSets = useMemo(
    () => (setId ? sets.filter((s) => s.id === setId) : sets),
    [sets, setId],
  );
  const scopedSetTitle = setId ? sets.find((s) => s.id === setId)?.title : undefined;

  // Both reads go through server functions behind authMiddleware — the client
  // never touches Firestore.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void Promise.all([fetchSets(), fetchAllProgress(), fetchTodaySummary()]).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchSets, fetchAllProgress, fetchTodaySummary]);

  /**
   * The round is a snapshot, taken once the data is in and never rebuilt while
   * it runs: grading a card rewrites its progress row, and re-deriving from
   * that would reorder the deck under the learner mid-session.
   */
  const [session, setSession] = useState<ReviewSession | null>(null);
  useEffect(() => {
    if (!ready || session) return;
    // Progress comes from the store rather than a subscribed value, so a
    // graded card landing cannot re-run this.
    // New cards are capped by what today's goal still owes, the same number
    // Home shows; the flat cap only applies if the summary couldn't be loaded.
    const today = useStudyStore.getState().todaySummary;
    setSession(
      buildLibrarySession(scopedSets, useStudyStore.getState().progress, {
        now: Date.now(),
        newCardLimit: today
          ? newLeftToday(today.summary, today.dailyGoal)
          : NEW_CARDS_PER_SESSION,
        ...(filter === "weak" ? { filter } : {}),
      }),
    );
  }, [ready, session, scopedSets, filter]);

  /**
   * Weak Practice routing: which raw miss type (Adım 5's articleMissCount/
   * caseMissCount on CardProgress — written but never read until now) the
   * hardest card in this weak round is actually failing on. Neither count
   * touches scheduling/mastery, and this reads them for routing only, so
   * card identity/schedule stay untouched.
   *
   * Looks only at the single hardest card (`weakCards`' own worst-first
   * order — session.cards[0] under `filter: "weak"`), not the whole round:
   * the round can mix cards from different sets/skills, and there is no
   * single drill that covers all of them at once.
   */
  const navigate = useNavigate();
  const weakPracticeTarget = useMemo(() => {
    if (filter !== "weak" || !session || session.cards.length === 0) return null;
    const top = session.cards[0];
    const progress = useStudyStore.getState().progress[top.card.id];
    const articleMissCount = progress?.articleMissCount ?? 0;
    const caseMissCount = progress?.caseMissCount ?? 0;
    if (articleMissCount === caseMissCount) return null;
    const mode = caseMissCount > articleMissCount ? "cases" : "articles";

    const targetSet = sets.find((s) => s.id === top.setId);
    if (!targetSet) return null;
    // A verb set (or any set with no gendered nouns) has no Articles/Cases
    // drill to send anyone into — same gate ModeGrid uses to show/hide
    // those tiles at all.
    const termProfile = profileFor(resolveSetLanguages(targetSet).term);
    const hasGenderedCards =
      termProfile.hasNounEnrichment &&
      targetSet.cards.some((c) => isCardActive(c) && c.enrichment?.gender);
    if (!hasGenderedCards) return null;

    return { mode, setId: top.setId } as const;
  }, [filter, session, sets]);

  useEffect(() => {
    if (!weakPracticeTarget) return;
    void navigate({
      to: weakPracticeTarget.mode === "cases" ? "/sets/$setId/cases" : "/sets/$setId/articles",
      params: { setId: weakPracticeTarget.setId },
      replace: true,
    });
  }, [weakPracticeTarget, navigate]);

  /**
   * Memoised: StudyDeck treats a new deck identity as a new round, so building
   * this inline would restart the session on every render.
   */
  const deck = useMemo<DeckEntry[]>(
    () =>
      (session?.cards ?? []).map((entry) => ({
        card: entry.card,
        setId: entry.setId,
        setTitle: entry.setTitle,
        termLanguage: entry.termLanguage,
        definitionLanguage2: entry.definitionLanguage2,
        // In a weak-words round every card is here for the same reason, so the
        // chip names the round rather than repeating the band on each card.
        bandLabel: filter === "weak" ? "Weak words" : BANDS[entry.band].label,
        bandTone: filter === "weak" ? "danger" : BANDS[entry.band].tone,
      })),
    [session, filter],
  );

  const onToggleStar = useCallback(
    (entry: DeckEntry) => void toggleStar(entry.setId, entry.card.id),
    [toggleStar],
  );

  if (!session || weakPracticeTarget) {
    return (
      <AppShell>
        <p className="text-sm text-muted">Loading your review queue…</p>
      </AppShell>
    );
  }

  if (session.cards.length === 0 && filter === "weak") {
    return (
      <AppShell>
        <section className="mx-auto max-w-lg py-16 text-center">
          <h1 className="font-display text-3xl font-medium tracking-tight">
            Nothing is giving you trouble
          </h1>
          <p className="mt-3 text-muted">No words are weak right now.</p>
        </section>
      </AppShell>
    );
  }

  if (session.cards.length === 0) {
    return (
      <AppShell>
        <section className="mx-auto max-w-lg py-16 text-center">
          <h1 className="font-display text-3xl font-medium tracking-tight">You're all caught up</h1>
          <p className="mt-3 text-muted">
            {session.nextDueAt === null
              ? "Nothing is scheduled for review right now."
              : `Nothing is due yet. Your next card comes up ${formatDistanceToNow(
                  session.nextDueAt,
                  {
                    addSuffix: true,
                  },
                )}, on ${format(session.nextDueAt, "EEEE d MMM, HH:mm")}.`}
          </p>
          {/* Deliberately nothing to click here. Answering a card before it is
              due tells the scheduler the recall was easier than it was, which
              shortens the very intervals this queue depends on — so there is
              no filler round on offer. */}
        </section>
      </AppShell>
    );
  }

  const title = scopedSetTitle
    ? filter === "weak"
      ? `Weak words · ${scopedSetTitle}`
      : scopedSetTitle
    : filter === "weak"
      ? "Weak words"
      : "Review";

  return (
    <StudyDeck
      deck={deck}
      title={title}
      mode={scopedSetTitle ? "One set" : "All sets"}
      onToggleStar={onToggleStar}
    />
  );
}
