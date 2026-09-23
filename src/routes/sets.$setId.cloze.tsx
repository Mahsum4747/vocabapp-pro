import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AnswerFeedbackSheet } from "@/components/answer-feedback-sheet";
import { EmptyState } from "@/components/empty-state";
import { StudySessionShell } from "@/components/study-session-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { caseBlankMatches, clozeBlankForCard, type ClozeBlank } from "@/lib/cloze";
import { CASE_LABEL } from "@/lib/case-forms";
import { leitnerBoxOf } from "@/lib/quiz";
import { queuedCards } from "@/lib/srs";
import { useSessionPlan } from "@/lib/use-session";
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
  const plan = useSessionPlan(studySet?.id ? setId : undefined);

  const boxCards = useMemo(() => {
    if (!studySet) return [];
    const active = studySet.cards.filter(isCardActive);
    return box !== undefined ? active.filter((c) => leitnerBoxOf(c, progress) === box) : active;
  }, [studySet, box, progress]);

  // Decision B (Phase 2): a card that fails clozeBlankForCard used to just
  // vanish from the round with no signal anywhere. `skipped` counts only the
  // cards actually scanned while filling this round (not the whole pool —
  // cards never reached once QUESTION_LIMIT is hit were never rejected, they
  // just weren't needed).
  const { questions, skipped } = useMemo<{ questions: ClozeQuestion[]; skipped: number }>(() => {
    if (!plan.ready) return { questions: [], skipped: 0 };
    const all = queuedCards(boxCards, progress, { now: Date.now() });
    const queued = box === undefined ? plan.take(all) : all;
    const eligible: ClozeQuestion[] = [];
    let skippedCount = 0;
    for (const card of queued) {
      const blank = clozeBlankForCard(card);
      if (blank) eligible.push({ card, blank });
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
    if (box === undefined) plan.finish(studySet.id, q.card.id);
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
      <StudySessionShell
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
      </StudySessionShell>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <StudySessionShell
        setId={setId}
        title={studySet.title}
        mode="Cloze"
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

  // A case-aware blank ("den Vater") is graded on the exact inflected form;
  // the classic noun-only blank keeps its accent-insensitive match.
  const correct = q.blank.caseBlank
    ? caseBlankMatches(written, q.blank.answer)
    : answersMatch(written, q.blank.answer);

  function submitWritten() {
    if (!revealed) finish(correct);
    else next();
  }

  return (
    <StudySessionShell
      setId={setId}
      title={studySet.title}
      mode="Cloze"
      index={index}
      total={questions.length}
      filterLabel={filterLabel}
      primaryAction={{ label: revealed ? "Continue" : "Check", onClick: submitWritten }}
    >
      <p className="text-xs font-medium tracking-wide text-muted uppercase">Fill in the blank</p>
      {/* Case-aware blank only: name the lemma and the case asked, so the
          learner knows to produce the inflected article + noun. The classic
          noun-only blank shows no such hint. */}
      {q.blank.caseBlank ? (
        <p className="mt-2 text-sm text-muted">
          {q.card.term} ({CASE_LABEL[q.blank.caseBlank]})
        </p>
      ) : null}
      <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-balance whitespace-pre-line">
        {q.blank.before}
        <span className="mx-1 inline-block min-w-16 border-b-2 border-primary align-baseline">
          {revealed ? (
            <span className={correct ? "text-success" : "text-danger"}>{q.blank.answer}</span>
          ) : (
            " "
          )}
        </span>
        {q.blank.caseBlank ? (
          <span className="mr-1 text-sm text-muted">
            ({q.blank.caseBlank === "akkusativ" ? "Akk." : "Dat."})
          </span>
        ) : null}
        {q.blank.after}
      </h2>

      <form
        className="mt-8 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          submitWritten();
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
          <AnswerFeedbackSheet tone={correct ? "correct" : "incorrect"}>
            {correct ? "Correct" : <>Correct answer: {q.blank.answer}</>}
          </AnswerFeedbackSheet>
        ) : null}
      </form>
    </StudySessionShell>
  );
}
