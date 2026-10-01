import { Check, Info } from "lucide-react";
import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { LesenMatchBoard, LesenSentenceInsertionBoard } from "@/components/lesen-match";
import { StudySessionShell } from "@/components/study-session-shell";
import { Button } from "@/components/ui/button";
import { LESEN_PASSAGES } from "@/lib/german/lesen-data";
import type { LesenLevel, LesenPassage } from "@/lib/german/lesen-types";
import { recordGrammarRoundResult } from "@/lib/grammar-progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/grammar/lesen")({
  component: LesenRoute,
});

const LEVELS: LesenLevel[] = ["A1", "A2", "B1", "B2"];

/**
 * Reading comprehension: one bundled passage per round (lesen-data.ts +
 * lesen-data-b1-b2.ts — real exam content, CC BY 4.0, see
 * LESEN-ATTRIBUTION.md), covering all four levels and the source's three
 * underlying exercise shapes:
 * - "choice": A1/A2 richtig-falsch/multiple-choice, B1's three close-ended
 *   types — tap an option, same UI this route has always used.
 * - "matching" / "sentence-insertion" (B1/B2 only): real drag-and-drop via
 *   dnd-kit — see lesen-match.tsx for the shared board components.
 *
 * `grammarProgress` topicId: everything here, at every level, still writes
 * under the single fixed "lesen" topicId (unchanged from the A1/A2-only
 * version) — NOT split per level. Reasoning: grammarProgress is one
 * accuracy/totalAttempts scalar per topicId, and the grammar hub
 * (grammar.index.tsx) has exactly one "Lesen" tile, not one per level —
 * there is nowhere in the UI a per-level field would ever be read. Adding
 * "lesen-b1"/"lesen-b2" topicIds would silently orphan that data (never
 * shown anywhere) and would need new hub tiles to ever surface, which is
 * out of this task's scope. One topicId across all four levels is also
 * consistent with how every other drill in this hub works: none of them
 * split progress by difficulty tier either.
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

  // Choice-passage-only session state (unused by matching/sentence-insertion,
  // which run their own internal state in lesen-match.tsx and only report
  // back through `finishRound`).
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [choiceCorrectCount, setChoiceCorrectCount] = useState(0);

  const [done, setDone] = useState(false);
  const [resultCorrect, setResultCorrect] = useState(0);
  const [resultTotal, setResultTotal] = useState(0);

  function start(chosenLevel: LesenLevel) {
    setLevel(chosenLevel);
    setPassage(pickPassage(chosenLevel));
    setIndex(0);
    setSelected(null);
    setChoiceCorrectCount(0);
    setDone(false);
  }

  function finishRound(correctCount: number, total: number) {
    setResultCorrect(correctCount);
    setResultTotal(total);
    setDone(true);
    // One write per finished round (never per question/target/gap) — see
    // grammar-progress.ts's own doc comment on the write-budget constraint.
    // Fire-and-forget: a failed write must never block or degrade the
    // (purely session-local) score screen.
    void recordGrammarRoundResult({
      data: { topicId: "lesen", correctInRound: correctCount, totalInRound: total },
    }).catch(() => {});
  }

  function chooseOption(optionIndex: number) {
    if (!passage || passage.kind !== "choice" || selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === passage.questions[index]!.correctIndex) {
      setChoiceCorrectCount((n) => n + 1);
    }
  }

  function nextChoiceQuestion() {
    if (!passage || passage.kind !== "choice") return;
    const isLast = index + 1 >= passage.questions.length;
    if (isLast) {
      finishRound(choiceCorrectCount, passage.questions.length);
      return;
    }
    setSelected(null);
    setIndex((i) => i + 1);
  }

  if (!level || !passage) {
    return (
      <StudySessionShell title="Lesen" mode="Lesen" index={0} total={0}>
        <p className="text-sm text-muted">
          Short German reading passages with real comprehension questions — pick a level to start.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {LEVELS.map((lvl) => (
            <Button key={lvl} onClick={() => start(lvl)} variant={lvl === "A1" ? "default" : "outline"}>
              Start {lvl}
            </Button>
          ))}
        </div>
      </StudySessionShell>
    );
  }

  if (done) {
    const pct = Math.round((resultCorrect / resultTotal) * 100);
    return (
      <StudySessionShell title="Lesen" mode="Lesen" index={resultTotal} total={resultTotal}>
        <div className="mx-auto max-w-md rounded-card bg-surface p-8 text-center shadow-[var(--elevation-1)]">
          <p className="text-sm text-muted">Round result</p>
          <p className="mt-2 font-display text-5xl font-medium tracking-tight tabular-nums">{pct}%</p>
          <p className="mt-2 text-sm text-muted">
            {resultCorrect} / {resultTotal} correct
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

  if (passage.kind === "matching") {
    return (
      <StudySessionShell title="Lesen" mode="Lesen" index={0} total={1}>
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium text-subtle">
            {passage.title} · {passage.source}
          </p>
          <LesenMatchBoard key={passage.id} passage={passage} onComplete={finishRound} />
        </div>
      </StudySessionShell>
    );
  }

  if (passage.kind === "sentence-insertion") {
    return (
      <StudySessionShell title="Lesen" mode="Lesen" index={0} total={1}>
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium text-subtle">
            {passage.title} · {passage.source}
          </p>
          <LesenSentenceInsertionBoard key={passage.id} passage={passage} onComplete={finishRound} />
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
      primaryAction={revealed ? { label: "Continue", onClick: nextChoiceQuestion } : undefined}
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
                onClick={() => chooseOption(optionIndex)}
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
