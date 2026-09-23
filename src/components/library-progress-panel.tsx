import { Link } from "@tanstack/react-router";
import { AlertCircle, Sparkles } from "lucide-react";
import { useStudyStore, useLibraryReview } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DailyGoalCard, WeakWordsCard, XpCard } from "./goal-and-xp";
import { ReviewCallout, ReviewCounts } from "./review-status";

/**
 * The account-wide "where do I stand" block: what's due across every set,
 * today's goal (with the streak riding along) and XP, and how many words
 * are weak — in that fixed order, on every main/dashboard screen (Home,
 * Account, and Set Detail, directly under each page's header). Never shown
 * on a study screen, and never mixed with a single set's own mastery bar or
 * its interactive Leitner box grid — those answer a different (per-set,
 * clickable) question and keep their own place on Set Detail.
 */
export function LibraryProgressPanel({
  className,
  showReview = true,
}: {
  className?: string;
  /**
   * The home page's own primary CTA already covers "what's due" more
   * prominently than this panel's review card/callout would — set false
   * there to avoid showing the same number twice. Account page has no such
   * block, so it keeps the default.
   */
  showReview?: boolean;
}) {
  const { library, weakCount, isLoaded } = useLibraryReview();
  const streak = useStudyStore((s) => s.streak);
  const reviewShown = showReview && (library.totals.due > 0 || Boolean(library.target));

  // Sets/progress haven't come back yet — show a placeholder instead of the
  // "nothing due" shape sets/progress being empty would otherwise produce.
  // Callers render the rest of the page around this without waiting on it.
  if (!isLoaded) {
    // A label, not just a pulsing rectangle — if this load stalls (slow
    // network, a store fetch that never settles) the slab still reads as
    // "loading", not as an empty surface left behind by an unfinished page.
    const skeleton = (
      <div
        role="status"
        className="flex h-skeleton-stat animate-pulse items-center justify-center rounded-card bg-surface text-xs text-subtle shadow-[var(--elevation-1)]"
      >
        Loading…
      </div>
    );
    return (
      <div className={className}>
        {showReview ? skeleton : null}
        <div className={cn("grid gap-gutter md:grid-cols-2", showReview && "mt-6")}>
          {skeleton}
          {skeleton}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {showReview && library.totals.due > 0 ? (
        <Link
          to="/review"
          className="flex flex-col justify-between gap-4 rounded-card bg-surface p-card shadow-[var(--elevation-1)] transition-shadow hover:shadow-[var(--elevation-2)] sm:flex-row sm:items-center"
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
          <span className="inline-flex h-11 shrink-0 items-center rounded-control bg-primary px-4 text-sm font-medium text-primary-fg">
            Start review
          </span>
        </Link>
      ) : showReview && library.target ? (
        <ReviewCallout
          setId={library.target.set.id}
          summary={library.totals}
          title={library.target.set.title}
        />
      ) : null}

      <div className={cn("grid gap-gutter md:grid-cols-2", reviewShown && "mt-6")}>
        <DailyGoalCard streakDays={streak?.currentStreak} />
        <XpCard />
        {/* Full width rather than a third column-1 card with nothing
            balancing it in column 2 — a deliberate row, not a stray leftover. */}
        <WeakWordsCard count={weakCount} className="md:col-span-2" />
      </div>
    </div>
  );
}
