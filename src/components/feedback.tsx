import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type FeedbackTone = "correct" | "incorrect";

/**
 * Background + text color pair for a graded option/tile (e.g. an mc or tf
 * button). Text colors are the dedicated --color-feedback-* tokens, not the
 * general --color-success / --color-danger scale, so correct and incorrect
 * carry the same contrast weight against their own soft background in both
 * color schemes (see styles.css for the measured ratios).
 */
export function feedbackToneClasses(tone: FeedbackTone): string {
  return tone === "correct"
    ? "bg-success-soft text-feedback-correct"
    : "bg-danger-soft text-feedback-incorrect";
}

/**
 * Result line shown after grading a typed or tapped answer — "Correct" or
 * the correct answer, colored to match the tone, with a matching check/×
 * icon so both tones carry equal visual weight. `grammarNote` is a reserved
 * slot for a future grammar explanation and is not rendered yet.
 */
export function Feedback({
  tone,
  children,
  grammarNote,
  className,
}: {
  tone: FeedbackTone;
  children: ReactNode;
  grammarNote?: ReactNode;
  className?: string;
}) {
  const Icon = tone === "correct" ? Check : X;
  return (
    <p
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium",
        tone === "correct" ? "text-feedback-correct" : "text-feedback-incorrect",
        className,
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}
