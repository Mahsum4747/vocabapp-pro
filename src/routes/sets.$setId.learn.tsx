import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Definition2Line } from "@/components/definition2-line";
import { EmptyState } from "@/components/empty-state";
import { ExampleLine } from "@/components/example-line";
import { StudyChrome } from "@/components/study-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  leitnerBoxOf,
  multipleChoice,
  writtenQuestion,
  type McQuestion,
  type WrittenQuestion,
} from "@/lib/quiz";
import { useSet, useSetProgress, useStudyStore } from "@/lib/store";
import { isCardActive } from "@/lib/types";
import { answersMatch, parseIntSearchParam, cn } from "@/lib/utils";
import { queuedCards } from "@/lib/srs";
import { ratingForOutcome, useReviewLogger } from "@/lib/review-log";

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
      <StudyChrome
        setId={setId}
        title={studySet.title}
        mode="Learn"
        index={0}
        total={0}
        filterLabel={filterLabel}
      >
        <EmptyState title="No cards" description="Add cards to start learning." />
      </StudyChrome>
    );
  }

  if (done) {
    const pct = Math.round((correctCount / items.length) * 100);
    return (
      <StudyChrome
        setId={setId}
        title={studySet.title}
        mode="Learn"
        index={items.length}
        total={items.length}
        filterLabel={filterLabel}
      >
        <div className="mx-auto max-w-md rounded-xl bg-surface p-8 text-center shadow-[var(--shadow-border)]">
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
      </StudyChrome>
    );
  }

  if (!item) return null;

  const isMc = item.type === "mc";
  const isCorrect = isMc ? selected === item.answer : answersMatch(written, item.answer);

  return (
    <StudyChrome
      setId={setId}
      title={studySet.title}
      mode="Learn"
      index={index}
      total={items.length}
      filterLabel={filterLabel}
    >
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        Term matching the definition
      </p>
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt=""
          className="mt-3 max-h-48 rounded-lg object-contain shadow-[var(--shadow-border)]"
        />
      ) : null}
      <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-balance whitespace-pre-line">
        {item.prompt}
      </h2>
      <Definition2Line
        definition2={item.definition2}
        definitionLanguage2={studySet.definitionLanguage2}
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
                  "rounded-lg bg-surface px-4 py-3.5 text-left text-sm shadow-[var(--shadow-border)] transition-[background-color,box-shadow] duration-150",
                  !revealed && "hover:shadow-[var(--shadow-border-hover)]",
                  show && option === item.answer && "bg-success-soft text-success",
                  show && chosen && option !== item.answer && "bg-danger-soft text-danger",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        <form
          className="mt-8 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!revealed) grade(answersMatch(written, item.answer));
            else next();
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
            <p className={cn("text-sm", isCorrect ? "text-success" : "text-danger")}>
              {isCorrect ? "Correct" : `Correct answer: ${item.answer}`}
            </p>
          ) : null}
          <Button type="submit" className="w-full">
            {revealed ? "Continue" : "Check"}
          </Button>
        </form>
      )}

      {/* Only after grading — the example contains the term, i.e. the answer. */}
      {revealed ? (
        <ExampleLine example={item.example} termLanguage={studySet.termLanguage} className="mt-4" />
      ) : null}

      {revealed && isMc ? (
        <Button className="mt-6 w-full" onClick={next}>
          Continue
        </Button>
      ) : null}
    </StudyChrome>
  );
}
