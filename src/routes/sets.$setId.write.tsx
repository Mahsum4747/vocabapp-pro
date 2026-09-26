import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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

  const [value, setValue] = useState("");
  const [aiFeedback, setAiFeedback] = useState<AiFeedbackState>({ status: "idle" });

  async function checkSentence() {
    if (!studySet || !value.trim()) return;
    setAiFeedback({ status: "loading" });
    try {
      const result = await getWriteSentenceFeedback({
        data: {
          learnerSentence: value,
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

  if (suggestedWords.length === 0) {
    return (
      <StudySessionShell setId={setId} title={studySet.title} mode="Write" index={0} total={0}>
        <EmptyState title="No cards" description="Add cards to this set before writing." />
      </StudySessionShell>
    );
  }

  return (
    <StudySessionShell setId={setId} title={studySet.title} mode="Write" index={1} total={1}>
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

      <Button
        type="button"
        className="mt-2 w-full"
        onClick={checkSentence}
        disabled={!value.trim() || aiFeedback.status === "loading"}
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
