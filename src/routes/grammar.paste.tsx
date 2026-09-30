import { AlertTriangle, Copy, Download, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { parseGrammarPasteJson, type GrammarPasteRound } from "@/lib/grammar-paste-import";
import {
  DEFAULT_GRAMMAR_PASTE_QUESTION_COUNT,
  GRAMMAR_PASTE_QUESTION_COUNTS,
  grammarPastePromptFor,
  grammarPasteRuleFor,
  type GrammarPasteQuestionCount,
} from "@/lib/grammar-paste-prompt";
import {
  deleteGrammarPasteTopic,
  getGrammarPasteTopic,
  listGrammarPasteTopics,
  recordGrammarPasteTopicRoundResult,
  saveGrammarPasteTopic,
  type GrammarPasteTopicSummary,
} from "@/lib/grammar-paste-topics";
import { numberSample } from "@/lib/german/grammar-drill-sample";
import { useStudyStore } from "@/lib/store";
import { cn, shuffle } from "@/lib/utils";
import type { DrillQuestion } from "@/lib/grammar-drills";

export const Route = createFileRoute("/grammar/paste")({
  component: GrammarPasteRoute,
});

/**
 * Grammar Paste: the grammar-drill version of the vocabulary "Paste"/
 * "Karta JSON" flow (import-dialog.tsx / karta-prompt.ts / karta-import.ts)
 * — a learner types ANY topic (not one of the 26 fixed hub topics), copies
 * a prompt into their OWN AI chat, pastes the JSON it returns, and gets a
 * real 10-question round out of it. Karta's own Gemini path is never
 * involved here; see grammar-paste-prompt.ts's own doc comment.
 *
 * Two things this content is NOT, on purpose:
 * - Not added to the fixed hub or `grammarProgress`: it's unverified,
 *   AI-generated, learner-supplied content, not Karta's own reviewed
 *   material — `GrammarDrillRunner` is passed `trackProgress={false}` so
 *   no `grammarProgress` write happens, and there is no 27th hub tile or
 *   `ModeId` for it. Its OWN progress (accuracy/attempts) is tracked in a
 *   completely separate, per-topic collection instead — see
 *   grammar-paste-topics.ts's own doc comment.
 * - Never silently presented as verified: the warning banner below is
 *   rendered OUTSIDE `GrammarDrillRunner`, as a sibling that stays on
 *   screen for the entire lifetime of this route component — through
 *   loading, every question, and the final score screen alike — not just
 *   on the input screen before the round starts. The same label is also
 *   in front of every saved-topic row below, and in grammar-assessment.ts's
 *   prompt wherever one of these topics is included.
 *
 * A round that starts from a fresh paste is saved once, automatically, the
 * moment it parses successfully (`start()` below) — not on every question,
 * not on every re-open. Re-opening a saved topic from the list re-fetches
 * its full content (`getGrammarPasteTopic`) rather than storing it twice.
 */
function GrammarPasteRoute() {
  return (
    <AuthGate>
      <GrammarPastePage />
    </AuthGate>
  );
}

/** Small, persistent, never-dominant reminder that this content is
 *  unverified — rendered as a sibling above the input screen AND the
 *  session, so it's on screen through every state (see this file's own
 *  doc comment), but a single muted line, not a bordered box competing
 *  with the question itself. */
function AiGeneratedBadge() {
  return (
    <p className="mb-3 flex items-center gap-1.5 text-xs text-subtle">
      <AlertTriangle className="size-3 shrink-0" />
      AI-generated — accuracy not guaranteed
    </p>
  );
}

function GrammarPastePage() {
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState<GrammarPasteQuestionCount>(
    DEFAULT_GRAMMAR_PASTE_QUESTION_COUNT,
  );
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [round, setRound] = useState<GrammarPasteRound | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [savedTopics, setSavedTopics] = useState<GrammarPasteTopicSummary[] | null>(null);

  const explanationLanguage = useStudyStore((s) => s.profile?.explanationLanguage);
  const prompt = useMemo(
    () => `${grammarPastePromptFor(explanationLanguage, questionCount)}${topic.trim()}`,
    [topic, explanationLanguage, questionCount],
  );

  function refreshSavedTopics() {
    listGrammarPasteTopics()
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

  function start() {
    setErrors([]);
    const result = parseGrammarPasteJson(text, questionCount);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setRound(result.value);
    setActiveTopicId(null);
    // Saved once, automatically, right here — never per question, never on
    // re-opening an already-saved topic (see openSavedTopic below, which
    // never calls this).
    saveGrammarPasteTopic({ data: result.value })
      .then(({ id }) => {
        setActiveTopicId(id);
        refreshSavedTopics();
      })
      .catch((err) => {
        console.error("Failed to save Grammar Paste topic:", err);
        toast.error("Couldn't save this topic to your history — the round still works.");
      });
  }

  function openSavedTopic(id: string) {
    getGrammarPasteTopic({ data: { id } })
      .then((full) => {
        if (!full) {
          toast.error("This saved topic is gone — maybe it was deleted elsewhere.");
          refreshSavedTopics();
          return;
        }
        setRound({ topic: full.topic, ruleExplanation: full.ruleExplanation, questions: full.questions });
        setActiveTopicId(full.id);
      })
      .catch(() => toast.error("Couldn't open this saved topic."));
  }

  function deleteSavedTopic(id: string) {
    setSavedTopics((prev) => (prev ? prev.filter((t) => t.id !== id) : prev));
    deleteGrammarPasteTopic({ data: { id } }).catch(() => {
      toast.error("Couldn't delete this topic.");
      refreshSavedTopics();
    });
  }

  function reset() {
    setRound(null);
    setActiveTopicId(null);
    setText("");
    setErrors([]);
  }

  function handleRoundComplete(correctInRound: number, totalInRound: number) {
    if (!activeTopicId) return;
    recordGrammarPasteTopicRoundResult({ data: { id: activeTopicId, correctInRound, totalInRound } })
      .then((summary) => {
        if (!summary) return;
        setSavedTopics((prev) =>
          prev ? prev.map((t) => (t.id === summary.id ? summary : t)) : prev,
        );
      })
      .catch(() => {});
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <AiGeneratedBadge />

        {round ? (
          <GrammarPasteSession round={round} onRestart={reset} onRoundComplete={handleRoundComplete} />
        ) : (
          <>
            <h1 className="font-display text-2xl font-medium tracking-tight">
              Practice your own topic
            </h1>
            <p className="mt-2 text-sm text-muted">
              Type any German grammar topic — not just the 26 built into Karta — copy the prompt
              into your own AI chat, then paste back the JSON it returns.
            </p>

            {savedTopics && savedTopics.length > 0 ? (
              <div className="mt-4">
                <p className="text-sm font-medium">Your saved topics</p>
                <ul className="mt-2 space-y-1.5">
                  {savedTopics.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center gap-2 rounded-card bg-surface p-3 shadow-[var(--elevation-1)]"
                    >
                      <button
                        type="button"
                        onClick={() => openSavedTopic(t.id)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <p className="truncate font-medium text-fg">{t.topic}</p>
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
                        aria-label={`Delete ${t.topic}`}
                      >
                        <Trash2 className="text-danger" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <label htmlFor="grammar-paste-topic" className="mt-6 block text-sm font-medium">
              Topic
            </label>
            <Input
              id="grammar-paste-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Kausalsätze, Genitiv-Attribute"
              className="mt-1"
            />

            <p className="mt-4 block text-sm font-medium">Number of questions</p>
            <div className="mt-1 inline-flex rounded-control border border-border p-0.5">
              {GRAMMAR_PASTE_QUESTION_COUNTS.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  aria-pressed={questionCount === count}
                  className={cn(
                    "rounded-control px-3 py-1 text-sm font-medium transition-colors",
                    questionCount === count ? "bg-primary text-primary-ink" : "text-muted hover:text-fg",
                  )}
                >
                  {count}
                </button>
              ))}
            </div>

            <details className="mt-4 rounded-card bg-surface-2 p-3 text-sm">
              <summary className="cursor-pointer font-medium text-fg">Grammar Paste prompt</summary>
              <p className="mt-2 text-muted">{grammarPasteRuleFor(questionCount)}</p>
              <p className="mt-1 text-muted">
                Paste this prompt into your own AI chat (the TOPIC line is already filled in from
                above), then paste the JSON it returns below.
              </p>
              <pre className="mt-2 max-h-48 overflow-auto rounded-card bg-surface p-3 font-mono text-xs whitespace-pre-wrap text-fg">
                {prompt}
              </pre>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={copyPrompt}>
                <Copy />
                Copy prompt
              </Button>
            </details>

            <label htmlFor="grammar-paste-json" className="mt-4 block text-sm font-medium">
              Paste the JSON here
            </label>
            <Textarea
              id="grammar-paste-json"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='{"topic": "...", "ruleExplanation": "...", "questions": [...]}'
              className="mt-1 min-h-40 font-mono text-sm"
            />
            {errors.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-danger">
                {errors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            ) : null}
            <Button type="button" className="mt-4 w-full" onClick={start} disabled={!text.trim()}>
              Start practice round
            </Button>
          </>
        )}
      </div>
    </AppShell>
  );
}

/** The round re-shaped back into exactly the JSON schema
 *  grammar-paste-prompt.ts/grammar-paste-import.ts define — pasting this
 *  back into the textarea above reproduces the identical session. */
function exportableJson(round: GrammarPasteRound): string {
  return JSON.stringify(
    {
      topic: round.topic,
      ruleExplanation: round.ruleExplanation,
      questions: round.questions.map((q) => ({
        prompt: q.prompt,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      })),
    },
    null,
    2,
  );
}

/** `GrammarDrillRunner`'s generic `T` is just a slot index here — the
 *  round's 10 questions are already fully built from `round`, so
 *  `fetchSample` only needs to hand back an array of the right length
 *  (same `numberSample`-just-for-round-size pattern Modalverben/Pronomen/
 *  Subjektive Modalverben use for their own fixed pools), and `buildRound`
 *  ignores its contents entirely. */
function GrammarPasteSession({
  round,
  onRestart,
  onRoundComplete,
}: {
  round: GrammarPasteRound;
  onRestart: () => void;
  onRoundComplete: (correctInRound: number, totalInRound: number) => void;
}) {
  function buildRound(): DrillQuestion[] {
    return round.questions.map((q) => {
      const correctAnswer = q.options[q.correctIndex];
      return {
        prompt: q.prompt,
        options: shuffle(q.options),
        correctAnswer,
      };
    });
  }

  function copyJson() {
    navigator.clipboard
      .writeText(exportableJson(round))
      .then(() => toast.success("Round JSON copied — paste it back here anytime to redo it."))
      .catch(() => toast.error("Couldn't copy the JSON."));
  }

  function downloadJson() {
    const blob = new Blob([exportableJson(round)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${round.topic.trim().replace(/\s+/g, "-").toLowerCase() || "grammar-paste"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Round downloaded.");
  }

  return (
    <>
      <GrammarDrillRunner<number>
        mode={`Grammar Paste: ${round.topic}`}
        trackProgress={false}
        ruleOverride={{ title: round.topic, intro: round.ruleExplanation }}
        fetchSample={() => Promise.resolve(numberSample(round.questions.length))}
        buildRound={buildRound}
        roundSize={round.questions.length}
        onRoundComplete={onRoundComplete}
      />
      <div className="mx-auto mt-4 flex max-w-md items-center justify-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={copyJson}>
          <Copy />
          Copy JSON
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={downloadJson}>
          <Download />
          Download
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onRestart}>
          Try a different topic
        </Button>
      </div>
    </>
  );
}
