import { Link } from "@tanstack/react-router";
import { AlertCircle, Check, Sparkles } from "lucide-react";
import type { ReviewSummary } from "@/lib/srs";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

/**
 * "8 due · 3 overdue · 4 new" — the same three numbers everywhere they appear.
 *
 * `overdue` is a subset of `due`, so it reads as detail about the due count
 * rather than as a separate pile to add up. New cards are shown apart because
 * they are unstarted work, not a review backlog.
 */
export function ReviewCounts({
  summary,
  className,
}: {
  summary: ReviewSummary;
  className?: string;
}) {
  const parts: string[] = [];
  if (summary.due > 0) parts.push(`${summary.due} due`);
  if (summary.fresh > 0) parts.push(`${summary.fresh} new`);

  if (parts.length === 0) return null;

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm tabular-nums", className)}>
      {parts.join(" · ")}
      {summary.overdue > 0 ? (
        <span className="inline-flex items-center gap-1 text-danger">
          <AlertCircle className="size-3.5" />
          {summary.overdue} overdue
        </span>
      ) : null}
    </span>
  );
}

/**
 * A compact due badge for a set in the library grid. Renders nothing when
 * there is nothing waiting, so a tidy library stays tidy.
 */
export function DueBadge({ summary }: { summary: ReviewSummary }) {
  if (summary.due === 0 && summary.fresh === 0) return null;

  const label = summary.due > 0 ? `${summary.due} due` : `${summary.fresh} new`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums",
        summary.overdue > 0
          ? "bg-danger-soft text-danger"
          : summary.due > 0
            ? "bg-primary text-primary-fg"
            : "bg-surface-2 text-muted",
      )}
    >
      {summary.overdue > 0 ? <AlertCircle className="size-3" /> : null}
      {label}
    </span>
  );
}

/**
 * The review call to action for one set: what is waiting, and one button that
 * starts the existing flashcards flow — whose queue already orders overdue →
 * due → weak → new. No separate review engine, just a signposted way in.
 */
export function ReviewCallout({
  setId,
  summary,
  title,
  className,
}: {
  setId: string;
  summary: ReviewSummary;
  /** Set name, when the callout is shown somewhere that isn't already about one set. */
  title?: string;
  className?: string;
}) {
  const nothingWaiting = summary.due === 0 && summary.fresh === 0 && summary.weak === 0;

  if (nothingWaiting) {
    return (
      <p className={cn("flex items-center gap-2 text-sm text-muted", className)}>
        <Check className="size-4 text-success" />
        {summary.total === 0
          ? "No cards to review yet."
          : "Nothing due right now — you're all caught up."}
      </p>
    );
  }

  const urgent = summary.overdue > 0;

  /**
   * Heading and button are derived from ONE decision, so they can never
   * disagree — the bug this replaces said "Ready to review" above a "Start
   * learning" button for a set whose cards were all new or not yet due.
   *
   * A card that has never been seen cannot be "reviewed", so a set with
   * nothing due says so plainly and offers to start learning instead.
   */
  const mode: "overdue" | "due" | "new" | "weak" =
    summary.overdue > 0 ? "overdue" : summary.due > 0 ? "due" : summary.fresh > 0 ? "new" : "weak";

  const HEADING = {
    overdue: "Reviews overdue",
    due: "Ready to review",
    new: "New cards to learn",
    weak: "Worth another look",
  } as const;

  const ACTION = {
    overdue: "Start review",
    due: "Start review",
    new: "Start learning",
    weak: "Start review",
  } as const;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl p-4 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:justify-between",
        urgent ? "bg-danger-soft" : "bg-surface",
        className,
      )}
    >
      <div className="min-w-0">
        <p
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase",
            urgent ? "text-danger" : "text-muted",
          )}
        >
          {urgent ? <AlertCircle className="size-3.5" /> : <Sparkles className="size-3.5" />}
          {HEADING[mode]}
        </p>
        {title ? (
          <p className="mt-1 truncate font-display text-lg font-medium tracking-tight">{title}</p>
        ) : null}
        <ReviewCounts summary={summary} className="mt-1 text-muted" />
      </div>
      <Button asChild className="shrink-0">
        <Link to="/sets/$setId/flashcards" params={{ setId }}>
          {ACTION[mode]}
        </Link>
      </Button>
    </div>
  );
}
