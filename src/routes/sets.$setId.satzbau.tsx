import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AnswerFeedbackSheet } from "@/components/answer-feedback-sheet";
import { EmptyState } from "@/components/empty-state";
import { StudySessionShell } from "@/components/study-session-shell";
import { Button } from "@/components/ui/button";
import { leitnerBoxOf } from "@/lib/quiz";
import { queuedCards } from "@/lib/srs";
import { useSessionPlan } from "@/lib/use-session";
import { ratingForOutcome, useReviewLogger } from "@/lib/review-log";
import { satzbauChipsForCard, shuffleChips } from "@/lib/satzbau";
import { useSet, useSetProgress, useStudyStore } from "@/lib/store";
import { isCardActive, type Card } from "@/lib/types";
import { parseIntSearchParam } from "@/lib/utils";

type Search = { box?: number };

export const Route = createFileRoute("/sets/$setId/satzbau")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    box: parseIntSearchParam(search.box),
  }),
  component: SatzbauPage,
});

type SatzbauQuestion = { card: Card; chips: string[] };
type Chip = { id: number; word: string };

const QUESTION_LIMIT = 12;

/**
 * Satzbau mode: reconstruct a card's own example sentence by tapping
 * shuffled word chips into the right order (tap-to-place, not drag — the
 * same mechanic Duolingo uses, chosen because touch-drag is unreliable on
 * small screens). Tests genuine sentence-structure recall from the card's
 * own content, so — like Cloze, and unlike the isolated article drill — it
 * writes through the real `logReview`/`recordReview` path: right or wrong
 * here really does move the card's FSRS schedule and mastery.
 */
function SatzbauPage() {
  const { setId } = Route.useParams();
  const { box } = Route.useSearch();
  const studySet = useSet(setId);
  const progress = useSetProgress(setId);
  const markStudied = useStudyStore((s) => s.markStudied);
  const logReview = useReviewLogger();
  const [round, setRound] = useState(0);
  const plan = useSessionPlan(studySet?.id ? setId : undefined);

  const boxCards = useMemo(() => {
    if (!studySet) return [];
    const active = studySet.cards.filter(isCardActive);
    return box !== undefined ? active.filter((c) => leitnerBoxOf(c, progress) === box) : active;
  }, [studySet, box, progress]);

  // Decision B (Phase 2): a card that fails satzbauChipsForCard used to just
  // vanish from the round with no signal anywhere. `skipped` counts only the
  // cards actually scanned while filling this round (not the whole pool —
  // cards never reached once QUESTION_LIMIT is hit were never rejected, they
  // just weren't needed).
  const { questions, skipped } = useMemo<{ questions: SatzbauQuestion[]; skipped: number }>(() => {
    if (!plan.ready) return { questions: [], skipped: 0 };
    const all = queuedCards(boxCards, progress, { now: Date.now() });
    const queued = box === undefined ? plan.take(all) : all;
    const eligible: SatzbauQuestion[] = [];
    let skippedCount = 0;
    for (const card of queued) {
      const chips = satzbauChipsForCard(card);
      if (chips) eligible.push({ card, chips });
      else skippedCount += 1;
      if (eligible.length >= QUESTION_LIMIT) break;
    }
    return { questions: eligible, skipped: skippedCount };
    // snapshot per round so grading doesn't reshuffle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studySet?.id, box, round, plan.session]);

  const filterLabel =
    box !== undefined
      ? `Box ${box} · ${boxCards.length} card${boxCards.length === 1 ? "" : "s"}`
      : undefined;

  const [index, setIndex] = useState(0);
  const [pool, setPool] = useState<Chip[]>([]);
  const [placed, setPlaced] = useState<Chip[]>([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [shownAt, setShownAt] = useState(() => Date.now());

  useEffect(() => {
    markStudied(setId);
  }, [setId, markStudied]);

  const q = questions[index];

  // Fresh shuffle whenever the current question changes (new index, or a
  // reshuffled round) — deliberately not folded into next()/restart() so
  // the very first question (index 0 on mount) gets a pool too.
  useEffect(() => {
    if (!q) return;
    setPool(shuffleChips(q.chips).map((word, i) => ({ id: i, word })));
    setPlaced([]);
    setChecked(false);
    setShownAt(Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function restart() {
    setIndex(0);
    setScore(0);
    setDone(false);
    setRound((n) => n + 1);
  }

  function placeChip(chip: Chip) {
    if (checked) return;
    setPool((p) => p.filter((c) => c.id !== chip.id));
    setPlaced((p) => [...p, chip]);
  }

  function removeChip(chip: Chip) {
    if (checked) return;
    setPlaced((p) => p.filter((c) => c.id !== chip.id));
    setPool((p) => [...p, chip]);
  }

  const allPlaced = pool.length === 0 && placed.length > 0;
  const correct = allPlaced && q ? placed.every((c, i) => c.word === q.chips[i]) : false;

  function check() {
    if (!q || !studySet || !allPlaced) return;
    setChecked(true);
    if (correct) setScore((n) => n + 1);
    logReview({
      setId: studySet.id,
      cardId: q.card.id,
      rating: ratingForOutcome(correct),
      responseTimeMs: Date.now() - shownAt,
    });
    if (box === undefined) plan.finish(studySet.id, q.card.id);
  }

  function next() {
    if (index + 1 >= questions.length) {
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

  if (questions.length === 0) {
    return (
      <StudySessionShell
        setId={setId}
        title={studySet.title}
        mode="Satzbau"
        index={0}
        total={0}
        filterLabel={filterLabel}
      >
        <EmptyState
          title="Nothing to build"
          description="This set has no cards with a usable example sentence (4-12 words) yet."
        />
      </StudySessionShell>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <StudySessionShell
        setId={setId}
        title={studySet.title}
        mode="Satzbau"
        index={questions.length}
        total={questions.length}
        filterLabel={filterLabel}
      >
        <div className="mx-auto max-w-md rounded-card bg-surface p-8 text-center shadow-[var(--elevation-1)]">
          <p className="text-sm text-muted">Round result</p>
          <p className="mt-2 font-display text-5xl font-medium tracking-tight tabular-nums">
            {pct}%
          </p>
          <p className="mt-2 text-sm text-muted">
            {score} / {questions.length} correct
          </p>
          {skipped > 0 ? (
            <p className="mt-1 text-xs text-subtle">
              {skipped} card{skipped === 1 ? "" : "s"} skipped — no suitable example.
            </p>
          ) : null}
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={restart}>Practice again</Button>
            <Button asChild variant="outline">
              <Link to="/sets/$setId" params={{ setId }}>
                Back to set
              </Link>
            </Button>
          </div>
        </div>
      </StudySessionShell>
    );
  }

  if (!q) return null;

  const chipClass =
    "rounded-full bg-surface-2 px-3 py-1.5 text-sm font-medium text-fg shadow-[var(--elevation-1)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50";

  return (
    <StudySessionShell
      setId={setId}
      title={studySet.title}
      mode="Satzbau"
      index={index}
      total={questions.length}
      filterLabel={filterLabel}
      primaryAction={{
        label: checked ? "Continue" : "Check",
        onClick: checked ? next : check,
        disabled: !checked && !allPlaced,
      }}
    >
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        Put the sentence in order
      </p>

      <div className="mt-4 min-h-16 rounded-card border-2 border-dashed border-border p-3">
        {placed.length === 0 ? (
          <p className="text-sm text-muted">Tap words below to build the sentence</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {placed.map((chip) => (
              <button
                key={chip.id}
                type="button"
                disabled={checked}
                onClick={() => removeChip(chip)}
                className={chipClass}
              >
                {chip.word}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {pool.map((chip) => (
          <button
            key={chip.id}
            type="button"
            disabled={checked}
            onClick={() => placeChip(chip)}
            className={chipClass}
          >
            {chip.word}
          </button>
        ))}
      </div>

      {checked ? (
        <AnswerFeedbackSheet tone={correct ? "correct" : "incorrect"}>
          {correct ? "Correct" : <>Correct order: {q.chips.join(" ")}</>}
        </AnswerFeedbackSheet>
      ) : null}
    </StudySessionShell>
  );
}
