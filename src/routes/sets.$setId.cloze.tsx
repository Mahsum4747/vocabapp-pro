import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { Feedback } from "@/components/feedback";
import { StudyChrome } from "@/components/study-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clozeBlankForCard, type ClozeBlank } from "@/lib/cloze";
import { leitnerBoxOf } from "@/lib/quiz";
import { queuedCards } from "@/lib/srs";
import { ratingForOutcome, useReviewLogger } from "@/lib/review-log";
import { useSet, useSetProgress, useStudyStore } from "@/lib/store";
import { isCardActive, type Card } from "@/lib/types";
import { answersMatch, parseIntSearchParam } from "@/lib/utils";

type Search = { box?: number };

export const Route = createFileRoute("/sets/$setId/cloze")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    box: parseIntSearchParam(search.box),
  }),
  component: ClozePage,
});

type ClozeQuestion = { card: Card; blank: ClozeBlank };

const QUESTION_LIMIT = 12;

/**
 * Cloze mode: fill in the term blanked out of a card's own example sentence
 * ("Ich trinke gern ___." → "Tee"). Unlike the article drill, this tests
 * genuine recall of the word itself, so it writes through the same
 * `logReview`/`recordReview` path every other typed-answer mode uses — right
 * or wrong here really does move the card's FSRS schedule and mastery.
 */
function ClozePage() {
  const { setId } = Route.useParams();
  const { box } = Route.useSearch();
  const studySet = useSet(setId);
  const progress = useSetProgress(setId);
  const markStudied = useStudyStore((s) => s.markStudied);
  const logReview = useReviewLogger();
  const [round, setRound] = useState(0);

  const boxCards = useMemo(() => {
    if (!studySet) return [];
    const active = studySet.cards.filter(isCardActive);
    return box !== undefined ? active.filter((c) => leitnerBoxOf(c, progress) === box) : active;
  }, [studySet, box, progress]);

  const questions = useMemo<ClozeQuestion[]>(() => {
    const queued = queuedCards(boxCards, progress, { now: Date.now() });
    const eligible: ClozeQuestion[] = [];
    for (const card of queued) {
      const blank = clozeBlankForCard(card);
      if (blank) eligible.push({ card, blank });
      if (eligible.length >= QUESTION_LIMIT) break;
    }
    return eligible;
    // snapshot per round so grading doesn't reshuffle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studySet?.id, box, round]);

  const filterLabel =
    box !== undefined
      ? `Box ${box} · ${boxCards.length} card${boxCards.length === 1 ? "" : "s"}`
      : undefined;

  const [index, setIndex] = useState(0);
  const [written, setWritten] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [shownAt, setShownAt] = useState(() => Date.now());

  useEffect(() => {
    markStudied(setId);
  }, [setId, markStudied]);

  function restart() {
    setIndex(0);
    setWritten("");
    setRevealed(false);
    setScore(0);
    setDone(false);
    setRound((n) => n + 1);
  }

  const q = questions[index];

  function finish(ok: boolean) {
    if (!q || !studySet) return;
    setRevealed(true);
    if (ok) setScore((n) => n + 1);
    logReview({
      setId: studySet.id,
      cardId: q.card.id,
      rating: ratingForOutcome(ok),
      responseTimeMs: Date.now() - shownAt,
    });
  }

  function next() {
    setWritten("");
    setRevealed(false);
    setShownAt(Date.now());
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
      <StudyChrome
        setId={setId}
        title={studySet.title}
        mode="Cloze"
        index={0}
        total={0}
        filterLabel={filterLabel}
      >
        <EmptyState
          title="Nothing to fill in"
          description="This set has no cards with a usable example sentence yet."
        />
      </StudyChrome>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <StudyChrome
        setId={setId}
        title={studySet.title}
        mode="Cloze"
        index={questions.length}
        total={questions.length}
        filterLabel={filterLabel}
      >
        <div className="mx-auto max-w-md rounded-xl bg-surface p-8 text-center shadow-[var(--shadow-border)]">
          <p className="text-sm text-muted">Round result</p>
          <p className="mt-2 font-display text-5xl font-medium tracking-tight tabular-nums">
            {pct}%
          </p>
          <p className="mt-2 text-sm text-muted">
            {score} / {questions.length} correct
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

  if (!q) return null;

  const correct = answersMatch(written, q.blank.answer);

  return (
    <StudyChrome
      setId={setId}
      title={studySet.title}
      mode="Cloze"
      index={index}
      total={questions.length}
      filterLabel={filterLabel}
    >
      <p className="text-xs font-medium tracking-wide text-muted uppercase">Fill in the blank</p>
      <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-balance whitespace-pre-line">
        {q.blank.before}
        <span className="mx-1 inline-block min-w-16 border-b-2 border-primary align-baseline">
          {revealed ? (
            <span className={correct ? "text-success" : "text-danger"}>{q.blank.answer}</span>
          ) : (
            " "
          )}
        </span>
        {q.blank.after}
      </h2>

      <form
        className="mt-8 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!revealed) finish(correct);
          else next();
        }}
      >
        <Input
          value={written}
          onChange={(e) => setWritten(e.target.value)}
          placeholder="Your answer"
          disabled={revealed}
          autoFocus
        />
        {revealed ? (
          <Feedback tone={correct ? "correct" : "incorrect"}>
            {correct ? "Correct" : <>Correct answer: {q.blank.answer}</>}
          </Feedback>
        ) : null}
        <Button type="submit" className="w-full">
          {revealed ? "Continue" : "Check"}
        </Button>
      </form>
    </StudyChrome>
  );
}
