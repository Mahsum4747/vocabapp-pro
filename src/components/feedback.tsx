import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FeedbackTone = "correct" | "incorrect";

/** Background + text color pair for a graded option/tile (e.g. an mc or tf button). */
export function feedbackToneClasses(tone: FeedbackTone): string {
  return tone === "correct" ? "bg-success-soft text-success" : "bg-danger-soft text-danger";
}

/**
 * Result line shown after grading a typed or tapped answer — "Correct" or
 * the correct answer, colored to match the tone. `grammarNote` is a reserved
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
  return (
    <p className={cn("text-sm", tone === "correct" ? "text-success" : "text-danger", className)}>
      {children}
    </p>
  );
}
