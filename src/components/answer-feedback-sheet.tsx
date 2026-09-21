import type { ReactNode } from "react";
import type { FeedbackTone } from "./feedback";
import { cn } from "@/lib/utils";

/**
 * Shared post-answer feedback panel: "Correct" / the right answer, in a
 * rounded surface above the primary action button. Every study mode that
 * reveals an answer (Learn, Test, Cloze, Satzbau, Match, Articles) renders
 * this instead of its own inline `<Feedback>` line, so the after-answer UI
 * looks and behaves the same everywhere.
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
  return (
    <div
      role="status"
      className={cn(
        "mt-4 rounded-card px-4 py-3 text-sm shadow-[var(--elevation-1)]",
        tone === "correct" ? "bg-success-soft text-success" : "bg-danger-soft text-danger",
        className,
      )}
    >
      {children}
    </div>
  );
}
