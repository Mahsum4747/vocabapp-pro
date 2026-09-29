import { Check, Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { StudySessionShell } from "@/components/study-session-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/empty-state";
import { fetchRandomExampleSentence } from "@/lib/german/grammar-drill-sample";
import { speak } from "@/lib/speech";
import { answersMatch, cn } from "@/lib/utils";

export const Route = createFileRoute("/grammar/diktat")({
  component: DiktatDrillRoute,
});

const ROUND_SIZE = 10;

/**
 * Dictation drill: plays a real German example sentence from the bundled
 * Wiktionary dataset (`examples-data.ts`, via `fetchRandomExampleSentence`
 * — NEVER an AI-generated sentence), the learner types what they heard,
 * and it's graded with `answersMatch` (the same normalize-and-compare
 * helper every other typed-answer mode already uses). No FSRS/card-progress
 * write anywhere here — this is a set-independent drill, same as
 * Plural/nicht-kein/possessive, just typed instead of multiple-choice, so
 * it doesn't reuse `GrammarDrillRunner` (built around MC option grids).
 */
function DiktatDrillRoute() {
  return (
    <AuthGate>
      <DiktatPage />
    </AuthGate>
  );
}

function DiktatPage() {
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [sentence, setSentence] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [value, setValue] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setSentence(null);
    setLoadError(false);
    fetchRandomExampleSentence()
      .then((s) => {
        if (cancelled) return;
        if (!s) {
          setLoadError(true);
          return;
        }
        setSentence(s);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
    // A new `index` (next sentence within the round) or `round` (restart)
    // both need a fresh sentence fetched.
  }, [index, round]);

  function restart() {
    setIndex(0);
    setCorrectCount(0);
    setDone(false);
    setValue("");
    setRevealed(false);
    setRound((n) => n + 1);
  }

  function check() {
    if (revealed || !sentence) return;
    setRevealed(true);
    if (answersMatch(value, sentence)) setCorrectCount((n) => n + 1);
  }

  function next() {
    setValue("");
    setRevealed(false);
    if (index + 1 >= ROUND_SIZE) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
  }

  if (loadError) {
    return (
      <StudySessionShell title="Diktat" mode="Diktat" index={0} total={0}>
        <EmptyState
          title="Couldn't load a sentence"
          description="Something went wrong fetching this drill's sentence pool."
          action={<Button onClick={() => setRound((n) => n + 1)}>Try again</Button>}
        />
      </StudySessionShell>
    );
  }

  if (done) {
    const pct = Math.round((correctCount / ROUND_SIZE) * 100);
    return (
      <StudySessionShell title="Diktat" mode="Diktat" index={ROUND_SIZE} total={ROUND_SIZE}>
        <div className="mx-auto max-w-md rounded-card bg-surface p-8 text-center shadow-[var(--elevation-1)]">
          <p className="text-sm text-muted">Round result</p>
          <p className="mt-2 font-display text-5xl font-medium tracking-tight tabular-nums">
            {pct}%
          </p>
          <p className="mt-2 text-sm text-muted">{correctCount} / {ROUND_SIZE} correct</p>
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

  if (!sentence) {
    return (
      <StudySessionShell title="Diktat" mode="Diktat" index={index} total={ROUND_SIZE}>
        <div className="h-40 animate-pulse rounded-card bg-surface shadow-[var(--elevation-1)]" />
      </StudySessionShell>
    );
  }

  const isCorrect = revealed && answersMatch(value, sentence);

  return (
    <StudySessionShell
      title="Diktat"
      mode="Diktat"
      index={index}
      total={ROUND_SIZE}
      primaryAction={
        revealed ? { label: "Continue", onClick: next } : { label: "Check", onClick: check, disabled: !value.trim() }
      }
    >
      <div className="mx-auto max-w-md">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => void speak(sentence, "de")}
        >
          <Play className="size-4" />
          Play sentence
        </Button>
        <Input
          className="mt-4"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={revealed}
          placeholder="Type what you heard…"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") check();
          }}
        />
        {revealed ? (
          <div
            className={cn(
              "mt-4 flex items-start gap-2 rounded-card border-2 p-4 text-sm",
              isCorrect ? "border-success text-success" : "border-danger text-danger",
            )}
          >
            {isCorrect ? <Check className="mt-0.5 size-4 shrink-0" /> : <X className="mt-0.5 size-4 shrink-0" />}
            <div className="text-fg">
              <p className="font-medium">{sentence}</p>
              {!isCorrect ? <p className="mt-1 text-muted">You typed: {value || "(nothing)"}</p> : null}
            </div>
          </div>
        ) : null}
      </div>
    </StudySessionShell>
  );
}
