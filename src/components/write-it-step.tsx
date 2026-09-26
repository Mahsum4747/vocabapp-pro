import { useState } from "react";
import { getWriteItFeedback } from "@/lib/write-it-feedback";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { writeItStrings } from "./write-it-tr";

/** Which case `correctForm` is inflected for — decides the example
 *  sentence's own verb, so the placeholder never models a wrong sentence
 *  (a Dativ noun phrase can't be "sehen"'s object; "sehen" wants Akkusativ). */
export type WriteItCase = "akkusativ" | "dativ" | "nominativ";

export type WriteItStepProps = {
  /** The inflected form the sentence must use — e.g. "den" (Cases) or
   *  "der" (Articles, always the nominative there). */
  correctForm: string;
  /** The headword that follows it, e.g. "Vater". */
  term: string;
  caseHint: WriteItCase;
  /** `profile.explanationLanguage`, forwarded as-is — "tr" switches this
   *  step's own static copy to Turkish, same as the reveal line's gloss/
   *  feedback already do; anything else falls back to English. */
  explanationLanguage?: string;
  /** Identify which card/set an AI feedback request (and its log entry)
   *  belongs to — not used by the rule-based check itself. */
  cardId: string;
  setId: string;
  setTitle: string;
};

/** One fixed, hand-picked verb per case, chosen because it actually takes
 *  that case as a plain object — never a template that happens to fit the
 *  form but not the grammar (sehen is Akkusativ-only; "dem Film" is never
 *  its object, whatever the form looks like on its own). */
const EXAMPLE_TEMPLATE: Record<WriteItCase, (phrase: string) => string> = {
  akkusativ: (phrase) => `Ich sehe ${phrase}.`,
  dativ: (phrase) => `Das gehört ${phrase}.`,
  nominativ: (phrase) => `Hier ist ${phrase}.`,
};

function normalize(value: string): string {
  return value.normalize("NFC").trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Phase 3, first production step after Cases/Articles — recognition to
 * production, but a small, checkable one, not free writing (that stays a
 * later, separate phase). Optional: it sits below the existing reveal,
 * never blocks or replaces the page's own Continue action, and asks
 * nothing of a learner who skips straight past it.
 *
 * Checking is rule-based only, no Gemini, no AI call of any kind: does the
 * typed sentence contain the exact inflected phrase ("den Vater") as a
 * substring, case/whitespace-insensitive? That is the full check. It does
 * NOT evaluate grammar, sentence structure, or quality — a bare "den
 * Vater" with no real sentence around it still passes, on purpose (that
 * judgment needs a model in the loop, which this slice deliberately
 * doesn't add).
 *
 * A wrong answer isn't a single failure mode, though: a sentence that
 * never mentions the headword at all ("Ich sehe ne hund" for "Stuhl") is
 * told apart from one that uses the headword in the wrong inflected form
 * ("Ich sehe der Stuhl") — same substring-search technique, just checked
 * against the bare headword instead of the full inflected phrase. Only
 * the second case shows "Almost — the form here is X"; the first gets its
 * own "doesn't use X" message instead, since it never got close.
 *
 * The rule-based result itself is never persisted: no server call, no
 * Firestore write for it. What's typed lives only in this component's own
 * state and disappears the moment the learner moves on (see this
 * component's own call sites for the `key` that resets it per card). The
 * separate, opt-in AI feedback below IS logged server-side (one row per
 * request, see write-it-feedback.ts) so a learner can look it back up later
 * from Account — the sentence and rule-based verdict that triggered it stay
 * transient either way.
 */
type AiFeedbackState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; text: string }
  | { status: "error"; error: string };

export function WriteItStep({
  correctForm,
  term,
  caseHint,
  explanationLanguage,
  cardId,
  setId,
  setTitle,
}: WriteItStepProps) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AiFeedbackState>({ status: "idle" });

  const phrase = `${correctForm} ${term}`;
  const usesForm = normalize(value).includes(normalize(phrase));
  // Simple substring check on the bare headword only — no NLP, no
  // stemming beyond what normalize() already does (case/whitespace). This
  // decides which wrong-answer message to show: a sentence that never
  // mentions the word at all ("Ich sehe ne hund" for "Stuhl") is a
  // different failure than one that uses the word but the wrong inflected
  // form ("Ich sehe der Stuhl") — the first never got close, the second
  // did, and "Almost" should only ever describe the second.
  const usesHeadword = normalize(value).includes(normalize(term));
  // A correct check finalizes this step — nothing left to retry, so the
  // box locks. A wrong check does NOT lock: "Almost" stays up, the input
  // (already never disabled here) stays fully editable, so the learner can
  // fix the sentence and check again.
  const locked = checked && usesForm;
  const example = EXAMPLE_TEMPLATE[caseHint](phrase);
  const t = writeItStrings(explanationLanguage);
  const instruction = t.instruction(phrase);

  async function requestAiFeedback() {
    setAiFeedback({ status: "loading" });
    try {
      const result = await getWriteItFeedback({
        data: {
          term,
          correctForm,
          caseHint,
          learnerSentence: value,
          cardId,
          setId,
          setTitle,
          ...(explanationLanguage ? { explanationLanguage } : {}),
        },
      });
      if (!result.ok) {
        setAiFeedback({ status: "error", error: result.error });
        return;
      }
      setAiFeedback({ status: "ready", text: result.feedback });
    } catch {
      setAiFeedback({ status: "error", error: t.aiFeedbackError });
    }
  }

  return (
    <div className="mt-4 rounded-card bg-surface-2 p-4">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">{t.label}</p>
      <p className="mt-1 text-sm text-fg">
        {instruction.before}
        <span className="font-semibold">{phrase}</span>
        {instruction.after}
      </p>
      <div className="mt-2 flex gap-2">
        <Input
          value={value}
          disabled={locked}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(false);
            setAiFeedback({ status: "idle" });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              e.preventDefault();
              setChecked(true);
            }
          }}
          placeholder={t.placeholder(example)}
          className="flex-1"
        />
        <Button type="button" variant="outline" onClick={() => setChecked(true)} disabled={!value.trim() || locked}>
          {t.check}
        </Button>
      </div>
      {checked ? (
        <p className={`mt-2 text-sm ${usesForm ? "text-success" : "text-muted"}`}>
          {usesForm ? t.correct : usesHeadword ? t.incorrect(phrase) : t.missingHeadword(term)}
        </p>
      ) : null}
      {/* Always available once something's been checked — right or wrong,
          a learner may still want the extra explanation. Fully separate
          from the rule-based result above: its own budget-gated Gemini
          call, its own visually distinct block, never blocking or altering
          the Correct/Almost verdict. */}
      {checked ? (
        <div className="mt-3 border-t border-border pt-3">
          {aiFeedback.status === "idle" ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={requestAiFeedback}
            >
              {t.aiFeedbackButton}
            </Button>
          ) : null}
          {aiFeedback.status === "loading" ? (
            <p className="text-sm text-muted">{t.aiFeedbackLoading}</p>
          ) : null}
          {aiFeedback.status === "ready" ? (
            <div className="rounded-control bg-surface px-3 py-2">
              <p className="text-xs font-medium tracking-wide text-muted uppercase">
                {t.aiFeedbackLabel}
              </p>
              <p className="mt-1 text-sm text-fg">{aiFeedback.text}</p>
            </div>
          ) : null}
          {aiFeedback.status === "error" ? (
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-muted">{aiFeedback.error}</p>
              <Button type="button" variant="ghost" size="sm" onClick={requestAiFeedback}>
                {t.aiFeedbackButton}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
