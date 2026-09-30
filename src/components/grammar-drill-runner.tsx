import { Check, Info } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { StudySessionShell } from "@/components/study-session-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EmptyState } from "@/components/empty-state";
import { fetchGermanGlosses, fetchRandomNounSample, type GermanGloss } from "@/lib/german/grammar-drill-sample";
import { recordGrammarRoundResult } from "@/lib/grammar-progress";
import { GRAMMAR_RULES, type GrammarRule, type GrammarRuleTopic } from "@/content/grammar-rules";
import { pickExplanation } from "@/lib/learning-prefs";
import { useStudyStore } from "@/lib/store";
import { cn, shuffle } from "@/lib/utils";
import type { NounEntry } from "@/lib/german/types";
import type { DrillQuestion } from "@/lib/grammar-drills";

/** Best-effort "same lemma" key for dedupe between the user's own cards and
 *  the general-pool sample — a plain lemma/infinitive lowercase compare,
 *  deliberately not smarter than that (see the runner's own doc comment). */
function entryKey(entry: unknown): string | null {
  if (!entry || typeof entry !== "object") return null;
  const lemma = (entry as { lemma?: unknown }).lemma;
  const infinitive = (entry as { infinitive?: unknown }).infinitive;
  const key = typeof lemma === "string" ? lemma : typeof infinitive === "string" ? infinitive : null;
  return key ? key.trim().toLowerCase() : null;
}

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
export function GrammarDrillRunner<T = NounEntry>({
  mode,
  topic,
  buildRound,
  fetchSample,
  userEntries,
  trackProgress = true,
  ruleOverride,
  roundSize = ROUND_SIZE,
  onRoundComplete,
}: {
  mode: string;
  /** One of the 26 fixed hub topics, used both as the `grammarProgress`
   *  topicId (when `trackProgress` is true) and, absent `ruleOverride`, to
   *  look up "See the rule" content. Optional so a session with no fixed
   *  identity (Grammar Paste's free-topic drill) can omit it entirely —
   *  such a session must also pass `trackProgress={false}`, since there is
   *  no real topicId to write progress under. */
  topic?: GrammarRuleTopic;
  buildRound: (entries: T[]) => DrillQuestion[];
  /** Defaults to the noun sample (the original three drills' pool). Verb-based
   *  drills (trennbare Verben, Modalverben, Imperativ, Passiv, Konjunktiv)
   *  pass a verb sample fetcher instead (see grammar-drill-sample.ts). */
  fetchSample?: () => Promise<T[]>;
  /**
   * Entries drawn from the user's OWN library (already mapped to `T` by the
   * route — see grammar-hub.ts's `userNounEligibleCards`/
   * `userVerbEligibleCards`), prioritized over the general pool. When
   * present and non-empty, up to `ROUND_SIZE` of these (shuffled, deduped)
   * are used first and the general pool only fills the remainder; entries
   * from the general pool that share a lemma/infinitive with one already
   * picked from the user's own are dropped. Omitted or empty: unchanged
   * behavior, entirely general-pool, so a user with no eligible cards never
   * sees an empty/broken round.
   */
  userEntries?: T[];
  /** false skips the one-write-per-round `recordGrammarRoundResult` call
   *  entirely — for sessions with no fixed topicId to file it under, like
   *  Grammar Paste's free-topic AI-generated round (see grammar.paste.tsx).
   *  Defaults to true, unchanged behavior for all 19 fixed-topic callers. */
  trackProgress?: boolean;
  /** A rule to show in "See the rule" instead of looking `topic` up in the
   *  fixed `GRAMMAR_RULES` table — for a topic that isn't one of the 26
   *  fixed ones (Grammar Paste again: the AI's own short rule explanation
   *  becomes this). When neither this nor a resolvable `topic` is given,
   *  the "See the rule" button itself is hidden rather than shown broken. */
  ruleOverride?: Omit<GrammarRule, "topic">;
  /** Overrides the fixed `ROUND_SIZE` (10) every other drill uses — only
   *  for Grammar Paste's own selectable question count (10/15/20, see
   *  grammar.paste.tsx), where the round is already fully built up front
   *  and must not be silently truncated back down to 10. Affects both how
   *  many questions `buildRound`'s output is capped at AND (when
   *  `userEntries` is used) how many of the learner's own cards are drawn
   *  before falling back to the general pool — unused by Grammar Paste,
   *  which never passes `userEntries`. */
  roundSize?: number;
  /** Fires once per finished round, alongside (not instead of) the
   *  `trackProgress`-gated `grammarProgress` write — for a caller that
   *  needs its OWN, differently-keyed progress write (Grammar Paste's
   *  per-saved-topic accuracy, in `grammarPasteTopics`, see
   *  grammar.paste.tsx and grammar-paste-topics.ts). Most callers omit
   *  this entirely. */
  onRoundComplete?: (correctInRound: number, totalInRound: number) => void;
}) {
  const [round, setRound] = useState(0);
  const [entries, setEntries] = useState<T[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [ruleOpen, setRuleOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setEntries(null);
    setLoadError(false);
    const fetcher =
      fetchSample ??
      (() => fetchRandomNounSample({ data: { count: SAMPLE_SIZE } }) as unknown as Promise<T[]>);

    const ownPicks = userEntries?.length
      ? (() => {
          const seen = new Set<string>();
          const deduped: T[] = [];
          for (const entry of shuffle(userEntries)) {
            const key = entryKey(entry);
            if (key && seen.has(key)) continue;
            if (key) seen.add(key);
            deduped.push(entry);
          }
          return { picks: deduped.slice(0, roundSize), seen };
        })()
      : null;

    if (ownPicks && ownPicks.picks.length >= SAMPLE_SIZE) {
      // Enough of the user's own cards alone to fill a full sample — no
      // general-pool round-trip needed at all.
      if (!cancelled) setEntries(ownPicks.picks);
      return () => {
        cancelled = true;
      };
    }

    fetcher()
      .then((sample) => {
        if (cancelled) return;
        if (!ownPicks) {
          setEntries(sample);
          return;
        }
        const filler = sample.filter((entry) => {
          const key = entryKey(entry);
          return !key || !ownPicks.seen.has(key);
        });
        setEntries([...ownPicks.picks, ...filler]);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const questions = useMemo(() => {
    if (!entries) return [];
    return buildRound(entries).slice(0, roundSize);
    // buildRound is a fresh closure per render in the route files below,
    // so it is intentionally excluded from deps — only a new noun sample
    // (a new `entries` reference) should produce a new round.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, roundSize]);

  // Offline "meaning" line under a question's German word — see
  // DrillQuestion.glossKey's own doc comment. One batch lookup per round
  // (never per question), only for the distinct keys this round's
  // questions actually carry; drills that never set `glossKey` (most of
  // them) skip this entirely (empty `terms` -> no fetch).
  const [glosses, setGlosses] = useState<Record<string, GermanGloss>>({});
  useEffect(() => {
    const terms = [...new Set(questions.map((q) => q.glossKey).filter((k): k is string => Boolean(k)))];
    if (terms.length === 0) {
      setGlosses({});
      return;
    }
    let cancelled = false;
    fetchGermanGlosses({ data: { terms } })
      .then((result) => {
        if (!cancelled) setGlosses(result);
      })
      .catch(() => {
        if (!cancelled) setGlosses({});
      });
    return () => {
      cancelled = true;
    };
  }, [questions]);
  const explanationLanguage = useStudyStore((s) => s.profile?.explanationLanguage) ?? "en";

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

  const rule = ruleOverride ?? (topic ? GRAMMAR_RULES[topic] : undefined);
  const ruleButton = rule ? (
    <Button type="button" variant="ghost" size="sm" onClick={() => setRuleOpen(true)}>
      <Info className="size-4" />
      See the rule
    </Button>
  ) : undefined;

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
      // One write per finished round (never per question) — see
      // grammar-progress.ts's own doc comment on the write-budget
      // constraint. Fire-and-forget: a failed write here must never block
      // or degrade the (purely session-local, non-FSRS) score screen.
      // Skipped entirely when trackProgress is false (Grammar Paste's
      // free-topic session — there's no fixed topicId to file it under,
      // and this round's questions aren't Karta's own verified content).
      if (trackProgress && topic) {
        void recordGrammarRoundResult({
          data: { topicId: topic, correctInRound: correctCount, totalInRound: questions.length },
        }).catch(() => {});
      }
      onRoundComplete?.(correctCount, questions.length);
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
        {question.glossKey && glosses[question.glossKey] ? (
          <p className="mt-1 text-sm text-subtle">
            {pickExplanation(glosses[question.glossKey]!, explanationLanguage)}
          </p>
        ) : null}
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
        <DialogContent title={rule?.title ?? ""}>
          <p className="mt-2 text-sm text-muted">{rule?.intro}</p>
          {rule?.table ? (
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
          {rule?.examples ? (
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
