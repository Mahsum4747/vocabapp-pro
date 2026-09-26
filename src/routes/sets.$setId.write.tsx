import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AVAILABLE_LEVELS,
  CEFR_LEVELS,
  countWords,
  pickPrompt,
  promptGloss,
  type CefrLevel,
} from "@/content/write-prompts";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { StudySessionShell } from "@/components/study-session-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { writeItStrings } from "@/components/write-it-tr";
import { getWriteSentenceFeedback } from "@/lib/write-sentence-feedback";
import { queuedCards } from "@/lib/srs";
import { useSet, useSetProgress, useStudyStore } from "@/lib/store";
import { isCardActive } from "@/lib/types";

export const Route = createFileRoute("/sets/$setId/write")({
  component: WritePage,
});

const SUGGESTED_WORD_COUNT = 3;
const MAX_SENTENCE_LENGTH = 200;
/** Task tab hard stop: maxWords + 20%. */
const HARD_STOP_FACTOR = 1.2;

type WriteTab = "words" | "task";

type AiFeedbackState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; text: string }
  | { status: "error"; error: string };

/**
 * Phase 3, second slice: free writing, no fixed correct answer. Unlike
 * WriteIt (write-it-step.tsx, embedded in Cases/Articles), there's no
 * rule-based check here at all — nothing to substring-match against, since
 * the learner isn't filling in one inflected phrase. The only grading is
 * Gemini's own review, triggered explicitly by Check, same budget-gated
 * pattern as WriteIt's own AI feedback (see write-sentence-feedback.ts).
 *
 * Word suggestions reuse the existing due/weak ordering as-is: `queuedCards`
 * (src/lib/srs), the same function Test/Match/Learn already build their
 * rounds from, sliced to a few distinct terms — no new selection algorithm.
 * Nothing here touches FSRS/CardProgress: Write never calls `logReview`,
 * because there's no single right answer to grade against.
 */
function WritePage() {
  const { setId } = Route.useParams();
  const studySet = useSet(setId);
  const progress = useSetProgress(setId);
  const markStudied = useStudyStore((s) => s.markStudied);
  const explanationLanguage = useStudyStore((s) => s.profile?.explanationLanguage);
  const t = writeItStrings(explanationLanguage);

  const suggestedWords = useMemo(() => {
    if (!studySet) return [];
    const active = studySet.cards.filter(isCardActive);
    const queued = queuedCards(active, progress, { now: Date.now() });
    const terms: string[] = [];
    for (const card of queued) {
      if (!terms.includes(card.term)) terms.push(card.term);
      if (terms.length >= SUGGESTED_WORD_COUNT) break;
    }
    return terms;
    // Picked once per set visit, not on every progress/keystroke change —
    // same "snapshot per round" convention as Test/Cases's own question sets.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studySet?.id]);

  const [tab, setTab] = useState<WriteTab>("words");
  const [level, setLevel] = useState<CefrLevel>("A2");
  const [task, setTask] = useState(() => pickPrompt("A2"));
  const [taskValue, setTaskValue] = useState("");
  const [value, setValue] = useState("");
  const [aiFeedback, setAiFeedback] = useState<AiFeedbackState>({ status: "idle" });

  function changeTab(next: WriteTab) {
    setTab(next);
    setAiFeedback({ status: "idle" });
  }

  function changeLevel(next: CefrLevel) {
    if (!AVAILABLE_LEVELS.includes(next)) return;
    setLevel(next);
    setTask(pickPrompt(next));
    setTaskValue("");
    setAiFeedback({ status: "idle" });
  }

  function nextTask() {
    setTask(pickPrompt(level, task?.id));
    setTaskValue("");
    setAiFeedback({ status: "idle" });
  }

  const taskWords = countWords(taskValue);

  async function checkSentence() {
    const text = tab === "task" ? taskValue : value;
    if (!studySet || !text.trim()) return;
    if (tab === "task" && (!task || taskWords < task.minWords)) return;
    setAiFeedback({ status: "loading" });
    try {
      const result = await getWriteSentenceFeedback({
        data: {
          learnerSentence: text,
          ...(tab === "task" && task ? { promptId: task.id } : {}),
          setId: studySet.id,
          setTitle: studySet.title,
          ...(explanationLanguage ? { explanationLanguage } : {}),
        },
      });
      if (!result.ok) {
        setAiFeedback({ status: "error", error: result.error });
        return;
      }
      markStudied(setId);
      setAiFeedback({ status: "ready", text: result.feedback });
    } catch {
      setAiFeedback({ status: "error", error: t.aiFeedbackError });
    }
  }

  if (!studySet) {
    return (
      <AppShell>
        <EmptyState
          title="Set not found"
          description="It was deleted or isn't on this device."
          action={
            <Button asChild>
              <Link to="/">Back to library</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  if (tab === "words" && suggestedWords.length === 0) {
    return (
      <StudySessionShell setId={setId} title={studySet.title} mode="Write" index={0} total={0}>
        <EmptyState title="No cards" description="Add cards to this set before writing." />
      </StudySessionShell>
    );
  }

  return (
    <StudySessionShell setId={setId} title={studySet.title} mode="Write" index={1} total={1}>
      <div className="mb-4 flex gap-1 rounded-control bg-surface-2 p-1" role="tablist">
        {(["words", "task"] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => changeTab(k)}
            className={`flex-1 rounded-control px-3 py-1.5 text-sm font-medium ${
              tab === k ? "bg-surface text-fg shadow-[var(--elevation-1)]" : "text-muted"
            }`}
          >
            {k === "words" ? "Set words" : "Task"}
          </button>
        ))}
      </div>

      {tab === "task" ? (
        <>
          <div className="flex flex-wrap gap-1.5">
            {CEFR_LEVELS.map((l) => {
              const available = AVAILABLE_LEVELS.includes(l);
              return (
                <button
                  key={l}
                  type="button"
                  disabled={!available}
                  aria-pressed={level === l}
                  onClick={() => changeLevel(l)}
                  className={`rounded-control px-3 py-1 text-sm ${
                    level === l
                      ? "bg-surface font-semibold text-fg shadow-[var(--elevation-1)]"
                      : "bg-surface-2 text-muted"
                  } disabled:opacity-50`}
                >
                  {l}
                  {available ? "" : " · coming soon"}
                </button>
              );
            })}
          </div>
          {task ? (
            <div className="mt-4 rounded-card bg-surface p-4 shadow-[var(--elevation-1)]">
              <p className="text-sm text-fg">{task.situationDe}</p>
              <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm text-fg">
                {task.leitpunkte.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted">{promptGloss(task, explanationLanguage)}</p>
              <p className="mt-1 text-xs text-subtle">
                {task.register === "du" ? "Register: du" : "Register: Sie"}
              </p>
              <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={nextTask}>
                Different task
              </Button>
            </div>
          ) : null}
          <Textarea
            value={taskValue}
            onChange={(e) => {
              const next = e.target.value;
              if (task && countWords(next) > Math.floor(task.maxWords * HARD_STOP_FACTOR)) {
                // Allow deletions/edits, block growth past the hard stop.
                if (next.length > taskValue.length) return;
              }
              setTaskValue(next);
              setAiFeedback({ status: "idle" });
            }}
            placeholder="Schreiben Sie hier…"
            className="mt-4 min-h-48"
          />
          {task ? (
            <p className="mt-1 text-right text-xs text-subtle tabular-nums">
              {taskWords} / {task.minWords}–{task.maxWords} words
            </p>
          ) : null}
        </>
      ) : null}

      {tab === "words" ? (
        <>
          <div className="rounded-card bg-surface p-4 shadow-[var(--elevation-1)]">
            <p className="text-sm text-fg">
              Write a sentence using at least one of:{" "}
              {suggestedWords.map((word, i) => (
                <span key={word}>
                  <span className="font-semibold">{word}</span>
                  {i < suggestedWords.length - 1 ? ", " : ""}
                </span>
              ))}
              .
            </p>
          </div>

          <Textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setAiFeedback({ status: "idle" });
            }}
            maxLength={MAX_SENTENCE_LENGTH}
            placeholder="Write your sentence(s) here…"
            className="mt-4 min-h-32"
          />
          <p className="mt-1 text-right text-xs text-subtle tabular-nums">
            {value.length} / {MAX_SENTENCE_LENGTH}
          </p>
        </>
      ) : null}

      <Button
        type="button"
        className="mt-2 w-full"
        onClick={checkSentence}
        disabled={
          aiFeedback.status === "loading" ||
          (tab === "task" ? !task || taskWords < task.minWords : !value.trim())
        }
      >
        {t.check}
      </Button>

      {aiFeedback.status === "loading" ? (
        <p className="mt-3 text-sm text-muted">{t.aiFeedbackLoading}</p>
      ) : null}
      {aiFeedback.status === "ready" ? (
        <div className="mt-3 rounded-control bg-surface-2 px-3 py-2">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            {t.aiFeedbackLabel}
          </p>
          <p className="mt-1 text-sm text-fg">{aiFeedback.text}</p>
        </div>
      ) : null}
      {aiFeedback.status === "error" ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted">{aiFeedback.error}</p>
          <Button type="button" variant="ghost" size="sm" onClick={checkSentence}>
            {t.aiFeedbackButton}
          </Button>
        </div>
      ) : null}
    </StudySessionShell>
  );
}
