import { Check, Info } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { StudySessionShell } from "@/components/study-session-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EmptyState } from "@/components/empty-state";
import { fetchRandomNounSample } from "@/lib/german/grammar-drill-sample";
import { GRAMMAR_RULES, type GrammarRuleTopic } from "@/content/grammar-rules";
import { cn } from "@/lib/utils";
import type { NounEntry } from "@/lib/german/types";
import type { DrillQuestion } from "@/lib/grammar-drills";

const ROUND_SIZE = 10;
// A little slack over ROUND_SIZE: nicht/kein and possessive draw several
// questions from the same noun (different templates/persons/cases), plural
// needs exactly one per noun, so 10 distinct nouns comfortably covers either.
const SAMPLE_SIZE = 12;

/**
 * Shared runner for the three set-independent German grammar drills
 * (plural, nicht/kein, mein/dein/sein): pulls a random noun sample from the
 * server, turns it into a round of questions via `buildRound`, and renders
 * the same tap-to-answer grid the case grid (sets.$setId.cases.tsx) uses —
 * border-success/border-danger/opacity-30, a Check icon on the revealed
 * answer, "Continue" to advance.
 *
 * Deliberately has NO cardId/setId anywhere in its state or props: these
 * drills are not tied to any card, so there is nothing to call
 * `logReview`/`recordArticleDrillAttempt`/any FSRS write with. Score is a
 * bare `useState` counter that resets on unmount and is never persisted.
 */
export function GrammarDrillRunner({
  mode,
  topic,
  buildRound,
}: {
  mode: string;
  topic: GrammarRuleTopic;
  buildRound: (entries: NounEntry[]) => DrillQuestion[];
}) {
  const [round, setRound] = useState(0);
  const [entries, setEntries] = useState<NounEntry[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [ruleOpen, setRuleOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setEntries(null);
    setLoadError(false);
    fetchRandomNounSample({ data: { count: SAMPLE_SIZE } })
      .then((sample) => {
        if (!cancelled) setEntries(sample);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [round]);

  const questions = useMemo(() => {
    if (!entries) return [];
    return buildRound(entries).slice(0, ROUND_SIZE);
    // buildRound is a fresh closure per render in the route files below,
    // so it is intentionally excluded from deps — only a new noun sample
    // (a new `entries` reference) should produce a new round.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  function restart() {
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setDone(false);
    setRound((n) => n + 1);
  }

  const rule = GRAMMAR_RULES[topic];
  const ruleButton = (
    <Button type="button" variant="ghost" size="sm" onClick={() => setRuleOpen(true)}>
      <Info className="size-4" />
      See the rule
    </Button>
  );

  if (loadError) {
    return (
      <StudySessionShell title={mode} mode={mode} index={0} total={0}>
        <EmptyState
          title="Couldn't load words"
          description="Something went wrong fetching this drill's word list."
          action={<Button onClick={() => setRound((n) => n + 1)}>Try again</Button>}
        />
      </StudySessionShell>
    );
  }

  if (!entries || questions.length === 0) {
    return (
      <StudySessionShell title={mode} mode={mode} index={0} total={0}>
        <div className="h-40 animate-pulse rounded-card bg-surface shadow-[var(--elevation-1)]" />
      </StudySessionShell>
    );
  }

  if (done) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <StudySessionShell title={mode} mode={mode} index={questions.length} total={questions.length}>
        <div className="mx-auto max-w-md rounded-card bg-surface p-8 text-center shadow-[var(--elevation-1)]">
          <p className="text-sm text-muted">Round result</p>
          <p className="mt-2 font-display text-5xl font-medium tracking-tight tabular-nums">
            {pct}%
          </p>
          <p className="mt-2 text-sm text-muted">
            {correctCount} / {questions.length} correct
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={restart}>Practice again</Button>
            <Button asChild variant="outline">
              <Link to="/grammar">Back to Grammar</Link>
            </Button>
          </div>
        </div>
      </StudySessionShell>
    );
  }

  const question = questions[index]!;
  const revealed = selected !== null;
  const isCorrect = revealed && selected === question.correctAnswer;
  const [before, after] = question.prompt.split("___");
  const filledSlot = revealed ? selected : "___";

  function choose(option: string) {
    if (revealed) return;
    setSelected(option);
    if (option === question.correctAnswer) setCorrectCount((n) => n + 1);
  }

  function next() {
    setSelected(null);
    if (index + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
  }

  return (
    <>
      <StudySessionShell
        title={mode}
        mode={mode}
        index={index}
        total={questions.length}
        headerRight={ruleButton}
        primaryAction={revealed ? { label: "Continue", onClick: next } : undefined}
      >
        <p className="font-serif text-2xl font-semibold tracking-tight text-headword text-balance">
          {before}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-control px-1",
              revealed && isCorrect && "text-success",
              revealed && !isCorrect && "text-danger",
              !revealed && "text-muted",
            )}
          >
            {filledSlot}
          </span>
          {after}
        </p>
        <div className="mt-8 grid grid-cols-2 gap-2">
          {question.options.map((option) => {
            const isCorrectOption = option === question.correctAnswer;
            const isChosen = selected === option;
            const isWrongPick = revealed && isChosen && !isCorrectOption;
            const isAnswer = revealed && isCorrectOption;
            const dim = revealed && !isChosen && !isCorrectOption;
            return (
              <button
                key={option}
                type="button"
                disabled={revealed}
                onClick={() => choose(option)}
                className={cn(
                  "w-full rounded-card border-2 bg-surface px-4 py-5 text-center text-base font-semibold text-fg shadow-[var(--elevation-1)] transition-[box-shadow,opacity,border-color] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                  isAnswer ? "border-success" : isWrongPick ? "border-danger" : "border-border",
                  !revealed && "hover:shadow-[var(--elevation-2)]",
                  dim && "opacity-30",
                )}
              >
                <span className="inline-flex items-center justify-center gap-1.5">
                  {option}
                  {isAnswer ? <Check className="size-4 text-success" aria-hidden="true" /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </StudySessionShell>
      <Dialog open={ruleOpen} onOpenChange={setRuleOpen}>
        <DialogContent title={rule.title}>
          <p className="mt-2 text-sm text-muted">{rule.intro}</p>
          {rule.table ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {rule.table.headers.map((header) => (
                      <th key={header} className="p-2 text-left font-medium text-muted">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rule.table.rows.map((row) => (
                    <tr key={row.join("|")} className="border-b border-border/60">
                      {row.map((cell, i) => (
                        <td key={i} className="p-2 text-fg">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {rule.examples ? (
            <ul className="mt-4 space-y-1 text-sm text-fg">
              {rule.examples.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
