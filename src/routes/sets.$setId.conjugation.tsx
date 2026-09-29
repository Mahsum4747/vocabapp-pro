import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AnswerFeedbackSheet } from "@/components/answer-feedback-sheet";
import { EmptyState } from "@/components/empty-state";
import { StudySessionShell } from "@/components/study-session-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { conjugationQuestionForCard, type ConjugationQuestion } from "@/lib/conjugation-drill";
import { leitnerBoxOf } from "@/lib/quiz";
import { queuedCards } from "@/lib/srs";
import { useSessionPlan } from "@/lib/use-session";
import { ratingForOutcome, useReviewLogger } from "@/lib/review-log";
import { useSet, useSetProgress, useStudyStore } from "@/lib/store";
import { isCardActive, resolveSetLanguages } from "@/lib/types";
import { answersMatch, parseIntSearchParam } from "@/lib/utils";

type Search = { box?: number };

export const Route = createFileRoute("/sets/$setId/conjugation")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    box: parseIntSearchParam(search.box),
  }),
  component: ConjugationPage,
});

const QUESTION_LIMIT = 12;

/**
 * Conjugation drill: given a verb's infinitive + a randomly chosen person
 * (ich/du/er), type the conjugated present-tense form. Copied from Cloze's
 * structure almost verbatim — the only real difference is question
 * generation (conjugation-drill.ts instead of clozeBlankForCard) — so it
 * writes through the same real `logReview`/`plan.finish` path Cloze does.
 * German-only: VERB_CONJUGATION_DATA only has German verbs, and this mode's
 * tile is gated on that at the mode-grid level too (sets.$setId.index.tsx),
 * but the route itself also treats a non-German set as having no eligible
 * cards, same defensive pattern the other German-only drills use.
 */
function ConjugationPage() {
  const { setId } = Route.useParams();
  const { box } = Route.useSearch();
  const studySet = useSet(setId);
  const setLanguages = resolveSetLanguages(studySet ?? {});
  const isGerman = setLanguages.term === "de";
  const progress = useSetProgress(setId);
  const markStudied = useStudyStore((s) => s.markStudied);
  const logReview = useReviewLogger();
  const [round, setRound] = useState(0);
  const plan = useSessionPlan(studySet?.id ? setId : undefined);

  const boxCards = useMemo(() => {
    if (!studySet || !isGerman) return [];
    const active = studySet.cards.filter(isCardActive);
    return box !== undefined ? active.filter((c) => leitnerBoxOf(c, progress) === box) : active;
  }, [studySet, isGerman, box, progress]);

  const { questions, skipped } = useMemo<{
    questions: ConjugationQuestion[];
    skipped: number;
  }>(() => {
    if (!plan.ready) return { questions: [], skipped: 0 };
    const all = queuedCards(boxCards, progress, { now: Date.now() });
    const queued = box === undefined ? plan.take(all) : all;
    const eligible: ConjugationQuestion[] = [];
    let skippedCount = 0;
    for (const card of queued) {
      const question = conjugationQuestionForCard(card);
      if (question) eligible.push(question);
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
        mode="Verbs"
        index={0}
        total={0}
        filterLabel={filterLabel}
      >
        <EmptyState
          title="Nothing to conjugate"
          description="This set has no cards with conjugation data yet."
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
        mode="Verbs"
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
              {skipped} card{skipped === 1 ? "" : "s"} skipped — no conjugation data.
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

  const correct = answersMatch(written, q.answer);

  function submitWritten() {
    if (!revealed) finish(correct);
    else next();
  }

  return (
    <StudySessionShell
      setId={setId}
      title={studySet.title}
      mode="Verbs"
      index={index}
      total={questions.length}
      filterLabel={filterLabel}
      primaryAction={{ label: revealed ? "Continue" : "Check", onClick: submitWritten }}
    >
      <p className="text-xs font-medium tracking-wide text-muted uppercase">Conjugate</p>
      <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-balance">
        {q.infinitive} — {q.person}
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
            {correct ? "Correct" : <>Correct answer: {q.answer}</>}
          </AnswerFeedbackSheet>
        ) : null}
      </form>
    </StudySessionShell>
  );
}
