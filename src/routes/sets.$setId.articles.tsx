import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { StudyChrome } from "@/components/study-chrome";
import { Button } from "@/components/ui/button";
import { getArticleDrillProgress, recordArticleDrillAttempt } from "@/lib/article-drill";
import { profileFor } from "@/lib/lang/profiles";
import { useSet, useStudyStore } from "@/lib/store";
import { isCardActive, resolveSetLanguages, type ArticleDrillProgress, type Card } from "@/lib/types";
import { cn, shuffle } from "@/lib/utils";

export const Route = createFileRoute("/sets/$setId/articles")({
  component: ArticleDrillPage,
});

/**
 * Phase 3C Part B: tests ONLY the article (der/die/das) for a German noun —
 * never the meaning, never the plural, and never the card's own term.
 *
 * Deliberately outside the main study loop: grading here goes through
 * `recordArticleDrillAttempt` (its own tiny counter, see article-drill.ts),
 * never `logReview`/`recordReview` — getting an article wrong must not touch
 * the card's FSRS schedule, mastery score, XP, or streak.
 */
function ArticleDrillPage() {
  const { setId } = Route.useParams();
  const studySet = useSet(setId);
  const setLanguages = resolveSetLanguages(studySet ?? {});
  const termProfile = profileFor(setLanguages.term);
  const markStudied = useStudyStore((s) => s.markStudied);
  const [round, setRound] = useState(0);

  const drillCards = useMemo<Card[]>(() => {
    if (!studySet || !termProfile.hasNounEnrichment) return [];
    return studySet.cards.filter((c) => isCardActive(c) && c.enrichment?.gender);
  }, [studySet, termProfile]);

  // Fetched once per set, not re-read reactively: this is only used to seed
  // the round's order (weakest-first), the same reason flashcards.tsx keeps
  // its deck a snapshot rather than rebuilding it as progress comes in — an
  // attempt landing mid-round must not reshuffle the cards under the user.
  const priorProgressRef = useRef<Record<string, ArticleDrillProgress>>({});
  useEffect(() => {
    let cancelled = false;
    void getArticleDrillProgress({ data: { setId } })
      .then((rows) => {
        if (cancelled) return;
        priorProgressRef.current = Object.fromEntries(rows.map((r) => [r.cardId, r]));
        setRound((n) => n + 1);
      })
      .catch(() => {
        // Best-effort ordering hint only — an empty pool just falls back to
        // "everything untried", which is a fine order too.
      });
    return () => {
      cancelled = true;
    };
  }, [setId]);

  const order = useMemo<Card[]>(() => {
    const prior = priorProgressRef.current;
    // Weakest (or never-attempted) first — a plain sort over already-loaded
    // state, same spirit as `weakCards`, not a new scheduler: nothing here
    // computes a due date or writes anything.
    return shuffle(drillCards).sort((a, b) => {
      const pa = prior[a.id];
      const pb = prior[b.id];
      const accA = pa && pa.attempts > 0 ? pa.correct / pa.attempts : -1;
      const accB = pb && pb.attempts > 0 ? pb.correct / pb.attempts : -1;
      return accA - accB;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drillCards, round]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    markStudied(setId);
  }, [setId, markStudied]);

  function restart() {
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setDone(false);
    setRound((n) => n + 1);
  }

  const card = order[index];
  const revealed = selected !== null;
  const correctArticle = card?.enrichment?.gender ? termProfile.articleFor?.(card.enrichment.gender) : undefined;

  function choose(option: string) {
    if (!card || !studySet || revealed) return;
    const ok = option === correctArticle;
    setSelected(option);
    if (ok) setCorrectCount((n) => n + 1);
    void recordArticleDrillAttempt({ data: { cardId: card.id, setId: studySet.id, correct: ok } });
  }

  function next() {
    setSelected(null);
    if (index + 1 >= order.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
  }

  if (!studySet) {
    return (
      <AppShell>
        <EmptyState
          title="Set not found"
          description="This set doesn't exist."
          action={
            <Button asChild>
              <Link to="/">Back to library</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  if (order.length === 0) {
    return (
      <StudyChrome setId={setId} title={studySet.title} mode="Articles" index={0} total={0}>
        <EmptyState
          title="Nothing to drill yet"
          description="This set has no German nouns with a known gender yet."
        />
      </StudyChrome>
    );
  }

  if (done) {
    const pct = Math.round((correctCount / order.length) * 100);
    return (
      <StudyChrome
        setId={setId}
        title={studySet.title}
        mode="Articles"
        index={order.length}
        total={order.length}
      >
        <div className="mx-auto max-w-md rounded-xl bg-surface p-8 text-center shadow-[var(--shadow-border)]">
          <p className="text-sm text-muted">Round result</p>
          <p className="mt-2 font-display text-5xl font-medium tracking-tight tabular-nums">
            {pct}%
          </p>
          <p className="mt-2 text-sm text-muted">
            {correctCount} / {order.length} correct
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={restart}>Practice again</Button>
            <Button asChild variant="outline">
              <Link to="/sets/$setId" params={{ setId }}>
                Back to set
              </Link>
            </Button>
          </div>
        </div>
      </StudyChrome>
    );
  }

  return (
    <StudyChrome
      setId={setId}
      title={studySet.title}
      mode="Articles"
      index={index}
      total={order.length}
    >
      <p className="text-xs font-medium tracking-wide text-muted uppercase">Which article?</p>
      <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance">
        {card.term}
      </h2>
      <div className="mt-8 grid grid-cols-3 gap-2">
        {termProfile.articleWords.map((option) => {
          const isCorrectOption = option === correctArticle;
          const isChosen = selected === option;
          const show = revealed && (isCorrectOption || isChosen);
          return (
            <button
              key={option}
              type="button"
              disabled={revealed}
              onClick={() => choose(option)}
              className={cn(
                "rounded-lg bg-surface px-4 py-6 text-center text-lg font-semibold shadow-[var(--shadow-border)] transition-[background-color,box-shadow] duration-150",
                !revealed && "hover:shadow-[var(--shadow-border-hover)]",
                show && isCorrectOption && "bg-success-soft text-success",
                show && isChosen && !isCorrectOption && "bg-danger-soft text-danger",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {revealed ? (
        <Button className="mt-6 w-full" onClick={next}>
          Continue
        </Button>
      ) : null}
    </StudyChrome>
  );
}
