import { usePasteSave } from "@/lib/use-paste-save";
import { reportOperationFailure } from "@/lib/operation-errors";
import { AlertTriangle, Copy, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { LesenChoiceBoard } from "@/components/lesen-choice";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { parseLesenPasteJson, type LesenPasteRound } from "@/lib/lesen-paste-import";
import { lesenPastePromptFor, lesenPasteRuleFor } from "@/lib/lesen-paste-prompt";
import {
  deleteLesenPasteTopic,
  getLesenPasteTopic,
  listLesenPasteTopics,
  recordLesenPasteTopicRoundResult,
  saveLesenPasteTopic,
  type LesenPasteTopicSummary,
} from "@/lib/lesen-paste-topics";
import type { LesenLevel } from "@/lib/german/lesen-types";
import { useStudyStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/grammar/lesen-paste")({
  component: LesenPasteRoute,
});

const LEVELS: LesenLevel[] = ["A1", "A2", "B1", "B2"];

/**
 * Lesen Paste: the reading-comprehension version of Grammar Paste
 * (grammar.paste.tsx) — BYTE-FOR-BYTE the same pattern: a learner picks a
 * level and an optional topic, copies a prompt into their OWN AI chat,
 * pastes back the JSON it returns, and gets a real reading-comprehension
 * round out of it. Karta's own Gemini path is never involved; see
 * lesen-paste-prompt.ts's own doc comment.
 *
 * Two things this content is NOT, on purpose (identical reasoning to
 * Grammar Paste):
 * - Not added to the bundled `LESEN_PASSAGES` pool or `lesenProgress`'s
 *   per-level completion tracking: `LesenChoiceBoard` is used directly
 *   without ever touching `recordLesenPassageCompletion`/
 *   `recordGrammarRoundResult`. Its OWN progress (accuracy/attempts) is
 *   tracked in a completely separate per-passage collection instead — see
 *   lesen-paste-topics.ts's own doc comment.
 * - Never silently presented as verified: the warning banner below is
 *   rendered OUTSIDE the session, as a sibling that stays on screen for
 *   the entire lifetime of this route component.
 *
 * A round that starts from a fresh paste is saved once, automatically, the
 * moment it parses successfully (`start()` below) — not on every question,
 * not on every re-open.
 */
function LesenPasteRoute() {
  return (
    <AuthGate>
      <LesenPastePage />
    </AuthGate>
  );
}

/** Small, persistent, never-dominant reminder that this content is
 *  unverified — same treatment as Grammar Paste's own badge. */
function AiGeneratedBadge() {
  return (
    <p className="mb-3 flex items-center gap-1.5 text-xs text-subtle">
      <AlertTriangle className="size-3 shrink-0" />
      AI-generated — accuracy not guaranteed
    </p>
  );
}

function LesenPastePage() {
  const [level, setLevel] = useState<LesenLevel>("A1");
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [round, setRound] = useState<LesenPasteRound | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [savedTopics, setSavedTopics] = useState<LesenPasteTopicSummary[] | null>(null);

  // `LesenChoiceBoard` calls `onComplete` after the LAST question's
  // Continue and then stops managing anything itself (see its own doc
  // comment) — it expects the caller to leave the question view. Bug fix:
  // this state didn't exist before, so `handleRoundComplete` only ever
  // fired the Firestore write and nothing else changed on screen — the
  // last question just sat there with Continue visibly doing nothing.
  // grammar.lesen.tsx's bundled sessions already had this same done/
  // result-screen state; Lesen Paste never got it when it was built.
  const [done, setDone] = useState(false);
  const [resultCorrect, setResultCorrect] = useState(0);
  const [resultTotal, setResultTotal] = useState(0);

  const explanationLanguage = useStudyStore((s) => s.profile?.explanationLanguage);
  const prompt = useMemo(
    () => `${lesenPastePromptFor(level, explanationLanguage)}${topic.trim()}`,
    [level, topic, explanationLanguage],
  );

  function refreshSavedTopics() {
    listLesenPasteTopics()
      .then(setSavedTopics)
      .catch(() => setSavedTopics((prev) => prev ?? []));
  }
  useEffect(refreshSavedTopics, []);

  function copyPrompt() {
    navigator.clipboard
      .writeText(prompt)
      .then(() => toast.success("Prompt copied."))
      .catch(() => toast.error("Couldn't copy the prompt."));
  }

  const roundReceipt = useRef(crypto.randomUUID());
  const persistence = usePasteSave<
    LesenPasteRound & { level: "A1" | "A2" | "B1" | "B2"; topic: string }
  >(
    (data) => saveLesenPasteTopic({ data }),
    (payload, id) => {
      setRound({
        title: payload.title,
        text: payload.text,
        questions: payload.questions as LesenPasteRound["questions"],
      });
      roundReceipt.current = crypto.randomUUID();
      setProgressRetry(null);
      setActiveTopicId(id);
      setDone(false);
      refreshSavedTopics();
    },
  );
  function start() {
    if (persistence.status === "saving") return;
    persistence.validating();
    setErrors([]);
    const result = parseLesenPasteJson(text);
    if (!result.ok) {
      persistence.reset();
      setErrors(result.errors);
      return;
    }
    persistence.begin({ level, topic: topic.trim(), ...result.value } as LesenPasteRound & {
      level: "A1" | "A2" | "B1" | "B2";
      topic: string;
    });
  }

  function openSavedTopic(summary: LesenPasteTopicSummary) {
    persistence.reset();
    getLesenPasteTopic({ data: { id: summary.id } })
      .then((full) => {
        if (!full) {
          toast.error("This saved passage is gone — maybe it was deleted elsewhere.");
          refreshSavedTopics();
          return;
        }
        setRound({ title: full.title, text: full.text, questions: full.questions });
        roundReceipt.current = crypto.randomUUID();
        setProgressRetry(null);
        setActiveTopicId(full.id);
        setDone(false);
      })
      .catch(() => toast.error("Couldn't open this saved passage."));
  }

  function deleteSavedTopic(id: string) {
    setSavedTopics((prev) => (prev ? prev.filter((t) => t.id !== id) : prev));
    deleteLesenPasteTopic({ data: { id } }).catch(() => {
      toast.error("Couldn't delete this passage.");
      refreshSavedTopics();
    });
  }

  function reset() {
    persistence.reset();
    setProgressRetry(null);
    setRound(null);
    setActiveTopicId(null);
    setDone(false);
    setText("");
    setErrors([]);
  }

  const [progressRetry, setProgressRetry] = useState<{
    id: string;
    roundId: string;
    correctInRound: number;
    totalInRound: number;
  } | null>(null);
  async function persistRound(request: NonNullable<typeof progressRetry>) {
    try {
      const summary = await recordLesenPasteTopicRoundResult({ data: request });
      if (!summary) throw new Error("Saved topic no longer exists");
      if (roundReceipt.current === request.roundId) setProgressRetry(null);
      setSavedTopics((prev) =>
        prev ? prev.map((topic) => (topic.id === summary.id ? summary : topic)) : prev,
      );
    } catch (error) {
      if (roundReceipt.current !== request.roundId) return;
      setProgressRetry(request);
      reportOperationFailure(
        "paste.progress",
        error,
        "Progress was not saved. Retry from this screen.",
      );
    }
  }
  function handleRoundComplete(correctInRound: number, totalInRound: number) {
    setResultCorrect(correctInRound);
    setResultTotal(totalInRound);
    setDone(true);
    if (!activeTopicId) return;
    void persistRound({
      id: activeTopicId,
      roundId: roundReceipt.current,
      correctInRound,
      totalInRound,
    });
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        {progressRetry ? (
          <Button onClick={() => void persistRound(progressRetry)}>Retry progress save</Button>
        ) : null}
        <AiGeneratedBadge />
        <p role="status" className="mt-2 text-sm text-muted">
          {persistence.status === "validating"
            ? "Validating…"
            : persistence.status === "saving"
              ? "Saving to your history…"
              : persistence.status === "failed"
                ? "Not saved. Practice starts after saving."
                : round
                  ? "Saved to your history"
                  : ""}
        </p>
        {persistence.status === "failed" ? (
          <Button onClick={() => void persistence.retry()}>Retry saving</Button>
        ) : null}

        {round && done ? (
          <div className="mx-auto max-w-md rounded-card bg-surface p-8 text-center shadow-[var(--elevation-1)]">
            <p className="text-sm text-muted">Round result</p>
            <p className="mt-2 font-display text-5xl font-medium tracking-tight tabular-nums">
              {Math.round((resultCorrect / resultTotal) * 100)}%
            </p>
            <p className="mt-2 text-sm text-muted">
              {resultCorrect} / {resultTotal} correct
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button onClick={reset}>Try a different passage</Button>
            </div>
          </div>
        ) : round ? (
          <>
            <LesenChoiceBoard
              key={activeTopicId ?? round.title}
              passage={{
                title: round.title,
                source: "AI-generated",
                text: round.text,
                questions: round.questions,
              }}
              onComplete={handleRoundComplete}
            />
            <div className="mt-4 flex justify-center">
              <Button type="button" variant="ghost" size="sm" onClick={reset}>
                Try a different passage
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-medium tracking-tight">
              Practice your own topic
            </h1>
            <p className="mt-2 text-sm text-muted">
              Pick a level and (optionally) a topic, copy the prompt into your own AI chat, then
              paste back the JSON it returns.
            </p>

            {savedTopics && savedTopics.length > 0 ? (
              <div className="mt-4">
                <p className="text-sm font-medium">Your saved passages</p>
                <ul className="mt-2 space-y-1.5">
                  {savedTopics.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center gap-2 rounded-card bg-surface p-3 shadow-[var(--elevation-1)]"
                    >
                      <button
                        type="button"
                        onClick={() => openSavedTopic(t)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <p className="truncate font-medium text-fg">
                          {t.title}
                          <span className="ml-1.5 text-xs font-normal text-subtle">{t.level}</span>
                        </p>
                        <p className="text-xs text-subtle">
                          {format(t.createdAt, "d MMM yyyy")} · {t.questionCount} questions
                          {t.accuracy !== null ? ` · ${t.accuracy}% accuracy` : ""}
                        </p>
                      </button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSavedTopic(t.id)}
                        aria-label={`Delete ${t.title}`}
                      >
                        <Trash2 className="text-danger" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <p className="mt-6 block text-sm font-medium">Level</p>
            <div className="mt-1 inline-flex rounded-control border border-border p-0.5">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  aria-pressed={level === lvl}
                  className={cn(
                    "rounded-control px-3 py-1 text-sm font-medium transition-colors",
                    level === lvl ? "bg-primary text-primary-ink" : "text-muted hover:text-fg",
                  )}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <label htmlFor="lesen-paste-topic" className="mt-4 block text-sm font-medium">
              Topic (optional)
            </label>
            <Input
              id="lesen-paste-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Jobsuche, Reisen — leave blank for any suitable topic"
              className="mt-1"
            />

            <details className="mt-4 rounded-card bg-surface-2 p-3 text-sm">
              <summary className="cursor-pointer font-medium text-fg">Lesen Paste prompt</summary>
              <p className="mt-2 text-muted">{lesenPasteRuleFor(level)}</p>
              <p className="mt-1 text-muted">
                Paste this prompt into your own AI chat (the level and TOPIC line are already filled
                in from above), then paste the JSON it returns below.
              </p>
              <pre className="mt-2 max-h-48 overflow-auto rounded-card bg-surface p-3 font-mono text-xs whitespace-pre-wrap text-fg">
                {prompt}
              </pre>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={copyPrompt}
              >
                <Copy />
                Copy prompt
              </Button>
            </details>

            <label htmlFor="lesen-paste-json" className="mt-4 block text-sm font-medium">
              Paste the JSON here
            </label>
            <Textarea
              id="lesen-paste-json"
              value={text}
              onChange={(e) => {
                if (persistence.status === "failed") persistence.reset();
                setText(e.target.value);
              }}
              placeholder='{"title": "...", "text": "...", "questions": [...]}'
              className="mt-1 min-h-40 font-mono text-sm"
            />
            {errors.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-danger">
                {errors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            ) : null}
            <Button
              type="button"
              className="mt-4 w-full"
              onClick={start}
              disabled={
                !text.trim() || persistence.status === "saving" || persistence.status === "failed"
              }
            >
              Start practice round
            </Button>
          </>
        )}
      </div>
    </AppShell>
  );
}
