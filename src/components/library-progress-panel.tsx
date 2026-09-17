import { Link } from "@tanstack/react-router";
import { AlertCircle, Sparkles } from "lucide-react";
import { useLibraryReview } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DailyGoalCard, WeakWordsCard, XpCard } from "./goal-and-xp";
import { ReviewCallout, ReviewCounts } from "./review-status";

/**
 * The account-wide "where do I stand" block: what's due across every set,
 * today's goal and XP, and how many words are weak — in that fixed order,
 * on every account-level screen (home, account). Never shown on a study
 * screen, and never mixed with a single set's own mastery bar — those answer
 * a different question and live where they already did.
 */
export function LibraryProgressPanel({ className }: { className?: string }) {
  const { library, weakCount, isLoaded } = useLibraryReview();

  // Sets/progress haven't come back yet — show a placeholder instead of the
  // "nothing due" shape sets/progress being empty would otherwise produce.
  // Callers render the rest of the page around this without waiting on it.
  if (!isLoaded) {
    return (
      <div className={className}>
        <div className="h-[92px] animate-pulse rounded-2xl bg-surface shadow-[var(--shadow-border)]" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="h-[92px] animate-pulse rounded-2xl bg-surface shadow-[var(--elevation-1)]" />
          <div className="h-[92px] animate-pulse rounded-2xl bg-surface shadow-[var(--elevation-1)]" />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {library.totals.due > 0 ? (
        <Link
          to="/review"
          className="flex flex-col justify-between gap-4 rounded-2xl bg-surface p-6 shadow-[var(--shadow-border)] transition-shadow hover:shadow-[var(--shadow-border-hover)] sm:flex-row sm:items-center"
        >
          <div className="min-w-0">
            <p
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase",
                library.totals.overdue > 0 ? "text-danger" : "text-muted",
              )}
            >
              {library.totals.overdue > 0 ? (
                <AlertCircle className="size-3.5" />
              ) : (
                <Sparkles className="size-3.5" />
              )}
              Review
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight">
              {library.totals.due} card{library.totals.due === 1 ? "" : "s"} due
            </h2>
            <ReviewCounts summary={library.totals} className="mt-1 text-muted" />
          </div>
          <span className="inline-flex h-11 shrink-0 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg">
            Start review
          </span>
        </Link>
      ) : library.target ? (
        <ReviewCallout
          setId={library.target.set.id}
          summary={library.totals}
          title={library.target.set.title}
        />
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <DailyGoalCard />
        <XpCard />
        <WeakWordsCard count={weakCount} />
      </div>
    </div>
  );
}
