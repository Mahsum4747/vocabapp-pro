import { Check, Info } from "lucide-react";
import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { StudySessionShell } from "@/components/study-session-shell";
import { Button } from "@/components/ui/button";
import { LESEN_PASSAGES } from "@/lib/german/lesen-data";
import type { LesenLevel, LesenPassage } from "@/lib/german/lesen-types";
import { recordGrammarRoundResult } from "@/lib/grammar-progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/grammar/lesen")({
  component: LesenRoute,
});

/**
 * Reading comprehension: one bundled A1/A2 passage per round (lesen-data.ts
 * — real exam content, CC BY 4.0, see LESEN-ATTRIBUTION.md), with that
 * passage's own ready-made comprehension questions. Unlike `GrammarDrillRunner`
 * (built around a single-line cloze prompt split on "___"), a passage needs
 * its full text shown once, above a short list of plain multiple-choice
 * questions about it — different enough that this is its own small runner,
 * same pattern Diktat uses for its own non-cloze shape.
 *
 * This IS one of Karta's own 27 fixed topics (not a user-generated Grammar
 * Paste topic), so it writes `grammarProgress` normally, one write per
 * finished round, under the fixed topicId "lesen" — same discipline as
 * every other drill (see grammar-progress.ts's own doc comment).
 */
function LesenRoute() {
  return (
    <AuthGate>
      <LesenPage />
    </AuthGate>
  );
}

function pickPassage(level: LesenLevel): LesenPassage {
  const pool = LESEN_PASSAGES.filter((p) => p.level === level);
  return pool[Math.floor(Math.random() * pool.length)]!;
}

function LesenPage() {
  const [level, setLevel] = useState<LesenLevel | null>(null);
  const [passage, setPassage] = useState<LesenPassage | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  function start(chosenLevel: LesenLevel) {
    setLevel(chosenLevel);
    setPassage(pickPassage(chosenLevel));
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setDone(false);
  }

  function choose(optionIndex: number) {
    if (!passage || selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === passage.questions[index]!.correctIndex) {
      setCorrectCount((n) => n + 1);
    }
  }

  function next() {
    if (!passage) return;
    setSelected(null);
    if (index + 1 >= passage.questions.length) {
      setDone(true);
      // One write per finished round (never per question) — see
      // grammar-progress.ts's own doc comment on the write-budget
      // constraint. Fire-and-forget: a failed write must never block or
      // degrade the (purely session-local) score screen.
      void recordGrammarRoundResult({
        data: { topicId: "lesen", correctInRound: correctCount, totalInRound: passage.questions.length },
      }).catch(() => {});
      return;
    }
    setIndex((i) => i + 1);
  }

  if (!level || !passage) {
    return (
      <StudySessionShell title="Lesen" mode="Lesen" index={0} total={0}>
        <p className="text-sm text-muted">
          Short German reading passages with real comprehension questions — pick a level to start.
        </p>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => start("A1")}>Start A1</Button>
          <Button onClick={() => start("A2")} variant="outline">
            Start A2
          </Button>
        </div>
      </StudySessionShell>
    );
  }

  if (done) {
    const pct = Math.round((correctCount / passage.questions.length) * 100);
    return (
      <StudySessionShell
        title="Lesen"
        mode="Lesen"
        index={passage.questions.length}
        total={passage.questions.length}
      >
        <div className="mx-auto max-w-md rounded-card bg-surface p-8 text-center shadow-[var(--elevation-1)]">
          <p className="text-sm text-muted">Round result</p>
          <p className="mt-2 font-display text-5xl font-medium tracking-tight tabular-nums">{pct}%</p>
          <p className="mt-2 text-sm text-muted">
            {correctCount} / {passage.questions.length} correct
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={() => start(level)}>Practice again</Button>
            <Button asChild variant="outline">
              <Link to="/grammar">Back to Grammar</Link>
            </Button>
          </div>
        </div>
      </StudySessionShell>
    );
  }

  const question = passage.questions[index]!;
  const revealed = selected !== null;

  return (
    <StudySessionShell
      title="Lesen"
      mode="Lesen"
      index={index}
      total={passage.questions.length}
      primaryAction={revealed ? { label: "Continue", onClick: next } : undefined}
    >
      <div className="mx-auto max-w-md">
        <div className="rounded-card bg-surface-2 p-4">
          <p className="text-xs font-medium text-subtle">
            {passage.title} · {passage.source}
          </p>
          <p className="mt-2 whitespace-pre-line text-sm text-fg">{passage.text}</p>
        </div>

        <p className="mt-6 font-serif text-xl font-semibold tracking-tight text-headword text-balance">
          {question.prompt}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {question.options.map((option, optionIndex) => {
            const isCorrectOption = optionIndex === question.correctIndex;
            const isChosen = selected === optionIndex;
            const isWrongPick = revealed && isChosen && !isCorrectOption;
            const isAnswer = revealed && isCorrectOption;
            const dim = revealed && !isChosen && !isCorrectOption;
            return (
              <button
                key={option}
                type="button"
                disabled={revealed}
                onClick={() => choose(optionIndex)}
                className={cn(
                  "w-full rounded-card border-2 bg-surface px-4 py-3 text-left text-sm font-medium text-fg shadow-[var(--elevation-1)] transition-[box-shadow,opacity,border-color] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                  isAnswer ? "border-success" : isWrongPick ? "border-danger" : "border-border",
                  !revealed && "hover:shadow-[var(--elevation-2)]",
                  dim && "opacity-30",
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  {option}
                  {isAnswer ? <Check className="size-4 shrink-0 text-success" aria-hidden="true" /> : null}
                </span>
              </button>
            );
          })}
        </div>
        {revealed ? (
          <p className="mt-3 flex items-start gap-1.5 text-sm text-subtle">
            <Info className="mt-0.5 size-4 shrink-0" />
            {question.explanation}
          </p>
        ) : null}
      </div>
    </StudySessionShell>
  );
}
