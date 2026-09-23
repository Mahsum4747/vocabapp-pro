import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AnswerFeedbackSheet } from "@/components/answer-feedback-sheet";
import { ArticleizedTerm } from "@/components/articleized-term";
import { Definition2Line } from "@/components/definition2-line";
import { EmptyState } from "@/components/empty-state";
import { ExampleLine } from "@/components/example-line";
import { feedbackToneClasses } from "@/components/feedback";
import { StudySessionShell } from "@/components/study-session-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildTermNode } from "@/lib/term-display";
import {
  leitnerBoxOf,
  multipleChoice,
  writtenQuestion,
  type McQuestion,
  type WrittenQuestion,
} from "@/lib/quiz";
import { useSet, useSetProgress, useStudyStore } from "@/lib/store";
import { isCardActive, resolveSetLanguages } from "@/lib/types";
import { answersMatch, parseIntSearchParam, cn } from "@/lib/utils";
import { queuedCards } from "@/lib/srs";
import { ratingForOutcome, useReviewLogger } from "@/lib/review-log";
import { articleWordsForAnswer, profileFor } from "@/lib/lang/profiles";

type Search = { box?: number };

export const Route = createFileRoute("/sets/$setId/learn")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    box: parseIntSearchParam(search.box),
  }),
  component: LearnPage,
});

type Item = McQuestion | WrittenQuestion;

function LearnPage() {
  const { setId } = Route.useParams();
  const { box } = Route.useSearch();
  const studySet = useSet(setId);
  const setLanguages = resolveSetLanguages(studySet ?? {});
  const termProfile = profileFor(setLanguages.term);
  // A plain call, not a hook: it sits above early returns.
  const termNode = buildTermNode(studySet?.cards ?? [], termProfile);
  const progress = useSetProgress(setId);
  const markStudied = useStudyStore((s) => s.markStudied);
  const logReview = useReviewLogger();
  const [round, setRound] = useState(0);

  const boxCards = useMemo(() => {
    if (!studySet) return [];
    const active = studySet.cards.filter(isCardActive);
    return box !== undefined ? active.filter((c) => leitnerBoxOf(c, progress) === box) : active;
  }, [studySet, box, progress]);

  const items = useMemo<Item[]>(() => {
    // Queue order (overdue → due → weak → new) rather than a plain shuffle.
    const cards = queuedCards(
      boxCards.filter((c) => c.term && c.definition),
      progress,
      { now: Date.now() },
    );
    return cards.map((card) => {
      // A card the scheduler considers established is asked by recall
      // (type the term); anything still being learned gets multiple choice.
      const state = progress[card.id]?.state;
      const established = state === "review" || state === "mastered";
      return established ? writtenQuestion(card) : multipleChoice(boxCards, card);
    });
    // round forces a fresh shuffle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studySet?.id, box, round]);

  const filterLabel =
    box !== undefined
      ? `Box ${box} · ${boxCards.length} card${boxCards.length === 1 ? "" : "s"}`
      : undefined;

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [written, setWritten] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [shownAt, setShownAt] = useState(() => Date.now());

  useEffect(() => {
    markStudied(setId);
  }, [setId, markStudied]);

  function restart() {
    setIndex(0);
    setSelected(null);
    setWritten("");
    setRevealed(false);
    setCorrectCount(0);
    setDone(false);
    setRound((n) => n + 1);
  }

  const item = items[index];

  function grade(ok: boolean) {
    if (!item || !studySet) return;
    setRevealed(true);
    if (ok) setCorrectCount((n) => n + 1);

    logReview({
      setId: studySet.id,
      cardId: item.cardId,
      rating: ratingForOutcome(ok),
      responseTimeMs: Date.now() - shownAt,
    });
  }

  function next() {
    setSelected(null);
    setWritten("");
    setRevealed(false);
    setShownAt(Date.now());
    if (index + 1 >= items.length) {
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
          action={
            <Button asChild>
              <Link to="/">Back to library</Link>
            </Button>
          }
          description="This set doesn't exist."
        />
      </AppShell>
    );
  }

  if (items.length === 0) {
    return (
      <StudySessionShell
        setId={setId}
        title={studySet.title}
        mode="Learn"
        index={0}
        total={0}
        filterLabel={filterLabel}
      >
        <EmptyState title="No cards" description="Add cards to start learning." />
      </StudySessionShell>
    );
  }

  if (done) {
    const pct = Math.round((correctCount / items.length) * 100);
    return (
      <StudySessionShell
        setId={setId}
        title={studySet.title}
        mode="Learn"
        index={items.length}
        total={items.length}
        filterLabel={filterLabel}
      >
        <div className="mx-auto max-w-md rounded-card bg-surface p-8 text-center shadow-[var(--elevation-1)]">
          <p className="text-sm text-muted">Round result</p>
          <p className="mt-2 font-display text-5xl font-medium tracking-tight tabular-nums">
            {pct}%
          </p>
          <p className="mt-2 text-sm text-muted">
            {correctCount} / {items.length} correct
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={restart}>Learn again</Button>
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

  if (!item) return null;

  const isMc = item.type === "mc";
  // "written" always asks for the term (both callers of writtenQuestion() use
  // its default ask: "definition"), so item.answer here is always the term —
  // the only side an article could ever apply to. Gated on THIS card's own
  // known gender, not just the set's language: a card with no enrichment
  // takes the same `[]` path it always did, so its grading is untouched.
  const answerCard = !isMc ? studySet.cards.find((c) => c.id === item.cardId) : undefined;
  const matchOptions = {
    ignorableLeadingWords: articleWordsForAnswer(answerCard?.enrichment, termProfile),
  };
  const isCorrect = isMc ? selected === item.answer : answersMatch(written, item.answer, matchOptions);
  // MC options carry bare terms; show the article, colored, where the card's
  // gender is known (display only — grading above compares the bare strings).
  const showTerm =
    item.type === "mc" && item.promptSide === "definition" ? termNode : (t: string) => t;

  function submitWritten() {
    if (!revealed) grade(answersMatch(written, item.answer, matchOptions));
    else next();
  }

  return (
    <StudySessionShell
      setId={setId}
      title={studySet.title}
      mode="Learn"
      index={index}
      total={items.length}
      filterLabel={filterLabel}
      primaryAction={
        isMc
          ? revealed
            ? { label: "Continue", onClick: next }
            : undefined
          : { label: revealed ? "Continue" : "Check", onClick: submitWritten }
      }
    >
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        Term matching the definition
      </p>
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt=""
          className="mt-3 max-h-48 rounded-control object-contain shadow-[var(--elevation-1)]"
        />
      ) : null}
      <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-balance whitespace-pre-line">
        {item.prompt}
      </h2>
      <Definition2Line
        definition2={item.definition2}
        definitionLanguage2={setLanguages.definition2 ?? studySet.definitionLanguage2}
        className="mt-1"
      />

      {isMc ? (
        <div className="mt-8 grid gap-2">
          {item.options.map((option) => {
            const chosen = selected === option;
            const show = revealed && (option === item.answer || chosen);
            return (
              <button
                key={option}
                type="button"
                disabled={revealed}
                onClick={() => {
                  setSelected(option);
                  grade(option === item.answer);
                }}
                className={cn(
                  "rounded-card bg-surface px-4 py-3.5 text-left text-sm shadow-[var(--elevation-1)] transition-[background-color,box-shadow] duration-[var(--duration-fast)]",
                  !revealed && "hover:shadow-[var(--elevation-2)]",
                  show && option === item.answer && feedbackToneClasses("correct"),
                  show && chosen && option !== item.answer && feedbackToneClasses("incorrect"),
                )}
              >
                {showTerm(option)}
              </button>
            );
          })}
        </div>
      ) : (
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
            placeholder="Type the term"
            disabled={revealed}
            autoFocus
          />
          {revealed ? (
            <AnswerFeedbackSheet tone={isCorrect ? "correct" : "incorrect"}>
              {isCorrect ? (
                <>
                  Correct ·{" "}
                  <ArticleizedTerm
                    term={item.answer}
                    enrichment={answerCard?.enrichment}
                    profile={termProfile}
                  />
                </>
              ) : (
                <>
                  Correct answer:{" "}
                  <ArticleizedTerm
                    term={item.answer}
                    enrichment={answerCard?.enrichment}
                    profile={termProfile}
                  />
                </>
              )}
            </AnswerFeedbackSheet>
          ) : null}
        </form>
      )}

      {/* Only after grading — the example contains the term, i.e. the answer. */}
      {revealed ? (
        <ExampleLine example={item.example} termLanguage={setLanguages.term ?? studySet.termLanguage} className="mt-4" />
      ) : null}
    </StudySessionShell>
  );
}
