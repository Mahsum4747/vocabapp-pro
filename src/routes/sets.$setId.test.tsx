import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { StudyChrome } from "@/components/study-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildTest, type TestQuestion } from "@/lib/quiz";
import { useSet, useStudyStore } from "@/lib/store";
import { answersMatch, cn } from "@/lib/utils";

export const Route = createFileRoute("/sets/$setId/test")({
  component: TestPage,
});

function TestPage() {
  const { setId } = Route.useParams();
  const studySet = useSet(setId);
  const bumpMastery = useStudyStore((s) => s.bumpMastery);
  const markStudied = useStudyStore((s) => s.markStudied);
  const [round, setRound] = useState(0);

  const questions = useMemo<TestQuestion[]>(
    () => (studySet ? buildTest(studySet.cards, Math.min(12, studySet.cards.length)) : []),
    // snapshot per round so grading doesn't reshuffle
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [studySet?.id, round],
  );

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [written, setWritten] = useState("");
  const [tf, setTf] = useState<boolean | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    markStudied(setId);
  }, [setId, markStudied]);

  function restart() {
    setIndex(0);
    setPicked(null);
    setWritten("");
    setTf(null);
    setRevealed(false);
    setScore(0);
    setMissed([]);
    setDone(false);
    setRound((n) => n + 1);
  }

  const q = questions[index];

  function finish(ok: boolean) {
    if (!q) return;
    setRevealed(true);
    if (ok) setScore((n) => n + 1);
    else {
      const card = studySet?.cards.find((c) => c.id === q.cardId);
      if (card) setMissed((m) => [...m, card.term]);
    }
    bumpMastery(setId, q.cardId, ok ? 1 : -1);
  }

  function next() {
    setPicked(null);
    setWritten("");
    setTf(null);
    setRevealed(false);
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
          description="The test won't open."
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
      <StudyChrome setId={setId} title={studySet.title} mode="Test" index={0} total={0}>
        <EmptyState title="No cards" description="Add cards to take a test." />
      </StudyChrome>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <StudyChrome
        setId={setId}
        title={studySet.title}
        mode="Test"
        index={questions.length}
        total={questions.length}
      >
        <div className="mx-auto max-w-md rounded-xl bg-surface p-8 text-center shadow-[var(--shadow-border)]">
          <p className="text-sm text-muted">Test result</p>
          <p className="mt-2 font-display text-5xl font-medium tracking-tight tabular-nums">{pct}%</p>
          <p className="mt-2 text-sm text-muted">
            {score} / {questions.length} correct
          </p>
          {missed.length > 0 ? (
            <div className="mt-6 text-left">
              <p className="text-xs font-medium tracking-wide text-muted uppercase">Missed</p>
              <ul className="mt-2 space-y-1 text-sm">
                {missed.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-sm text-success">All correct.</p>
          )}
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={restart}>New test</Button>
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

  return (
    <StudyChrome setId={setId} title={studySet.title} mode="Test" index={index} total={questions.length}>
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        {q.type === "mc" ? "Multiple choice" : q.type === "written" ? "Written" : "True / false"}
      </p>
      {q.imageUrl ? (
        <img
          src={q.imageUrl}
          alt=""
          className="mt-3 max-h-48 rounded-lg object-contain shadow-[var(--shadow-border)]"
        />
      ) : null}
      <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-balance">{q.prompt}</h2>

      {q.type === "mc" ? (
        <div className="mt-8 grid gap-2">
          {q.options.map((option) => {
            const chosen = picked === option;
            const show = revealed && (option === q.answer || chosen);
            return (
              <button
                key={option}
                type="button"
                disabled={revealed}
                onClick={() => {
                  setPicked(option);
                  finish(option === q.answer);
                }}
                className={cn(
                  "rounded-lg bg-surface px-4 py-3.5 text-left text-sm shadow-[var(--shadow-border)]",
                  show && option === q.answer && "bg-success-soft text-success",
                  show && chosen && option !== q.answer && "bg-danger-soft text-danger",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : null}

      {q.type === "written" ? (
        <form
          className="mt-8 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!revealed) finish(answersMatch(written, q.answer));
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
            <p className={cn("text-sm", answersMatch(written, q.answer) ? "text-success" : "text-danger")}>
              {answersMatch(written, q.answer) ? "Correct" : `Correct answer: ${q.answer}`}
            </p>
          ) : null}
          <Button type="submit" className="w-full">
            {revealed ? "Continue" : "Check"}
          </Button>
        </form>
      ) : null}

      {q.type === "tf" ? (
        <div className="mt-8 space-y-4">
          <p className="rounded-lg bg-surface px-4 py-4 text-lg shadow-[var(--shadow-border)]">
            {q.statement}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[true, false].map((value) => {
              const label = value ? "True" : "False";
              const chosen = tf === value;
              const show = revealed && (value === q.answer || chosen);
              return (
                <button
                  key={String(value)}
                  type="button"
                  disabled={revealed}
                  onClick={() => {
                    setTf(value);
                    finish(value === q.answer);
                  }}
                  className={cn(
                    "h-12 rounded-lg bg-surface text-sm font-medium shadow-[var(--shadow-border)]",
                    show && value === q.answer && "bg-success-soft text-success",
                    show && chosen && value !== q.answer && "bg-danger-soft text-danger",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {revealed && q.type !== "written" ? (
        <Button className="mt-6 w-full" onClick={next}>
          Continue
        </Button>
      ) : null}
    </StudyChrome>
  );
}
