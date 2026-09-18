import { Link } from "@tanstack/react-router";
import { AlertCircle, Sparkles } from "lucide-react";
import { useStudyStore, useLibraryReview } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DailyGoalCard, WeakWordsCard, XpCard } from "./goal-and-xp";
import { ReviewCallout, ReviewCounts } from "./review-status";
import { StreakIndicator } from "./streak-indicator";

/**
 * The account-wide "where do I stand" block: what's due across every set,
 * the streak, today's goal and XP, and how many words are weak — in that
 * fixed order, on every account-level screen (home, account). Never shown on
 * a study screen, and never mixed with a single set's own mastery bar — those
 * answer a different question and live where they already did.
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
  const streakShown = Boolean(streak && streak.currentStreak > 0);

  // Sets/progress haven't come back yet — show a placeholder instead of the
  // "nothing due" shape sets/progress being empty would otherwise produce.
  // Callers render the rest of the page around this without waiting on it.
  if (!isLoaded) {
    return (
      <div className={className}>
        {showReview ? (
          <div className="h-[92px] animate-pulse rounded-2xl bg-surface shadow-[var(--shadow-border)]" />
        ) : null}
        <div className={cn("grid gap-4 md:grid-cols-2", showReview && "mt-6")}>
          <div className="h-[92px] animate-pulse rounded-2xl bg-surface shadow-[var(--elevation-1)]" />
          <div className="h-[92px] animate-pulse rounded-2xl bg-surface shadow-[var(--elevation-1)]" />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {showReview && library.totals.due > 0 ? (
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
      ) : showReview && library.target ? (
        <ReviewCallout
          setId={library.target.set.id}
          summary={library.totals}
          title={library.target.set.title}
        />
      ) : null}

      {streakShown ? (
        <div className={reviewShown ? "mt-6" : undefined}>
          <StreakIndicator days={streak!.currentStreak} />
        </div>
      ) : null}

      <div className={cn("grid gap-4 md:grid-cols-2", (reviewShown || streakShown) && "mt-6")}>
        <DailyGoalCard />
        <XpCard />
        <WeakWordsCard count={weakCount} />
      </div>
    </div>
  );
}
