import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import type { FeedbackTone } from "./feedback";
import { cn } from "@/lib/utils";

/**
 * Shared post-answer feedback panel: "Correct" / the right answer, in a
 * rounded surface above the primary action button. Every study mode that
 * reveals an answer (Learn, Test, Cloze, Satzbau, Match, Articles) renders
 * this instead of its own inline `<Feedback>` line, so the after-answer UI
 * looks and behaves the same everywhere.
 *
 * Text uses the dedicated --color-feedback-* tokens (not the general
 * --color-success / --color-danger scale) and both tones get a matching
 * check/× icon, so correct and incorrect carry equal visual weight — neither
 * reads as paler or more muted than the other.
 *
 * Pure presentation — it carries whatever the mode already computed (correct/
 * incorrect, the right answer, an example line) and never touches grading,
 * FSRS, or logReview itself.
 */
export function AnswerFeedbackSheet({
  tone,
  children,
  className,
}: {
  tone: FeedbackTone;
  children: ReactNode;
  className?: string;
}) {
  const Icon = tone === "correct" ? Check : X;
  return (
    <div
      role="status"
      className={cn(
        "mt-4 flex items-start gap-2 rounded-card px-4 py-3 text-sm font-medium shadow-[var(--elevation-1)]",
        tone === "correct" ? "bg-success-soft text-feedback-correct" : "bg-danger-soft text-feedback-incorrect",
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
