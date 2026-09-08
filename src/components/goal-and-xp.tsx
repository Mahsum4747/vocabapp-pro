import { Link } from "@tanstack/react-router";
import { Check, Target, Zap } from "lucide-react";
import { levelFromXp, XP_PER_LEVEL } from "@/lib/gamification";
import { useStudyStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ProgressRing } from "./progress-ring";
import { Progress } from "./ui/progress";

/**
 * Today's goal: how many distinct words have been worked on, out of the target.
 *
 * Counts unique words rather than reviews, so grading the same card five times
 * doesn't finish the day's goal. Hidden entirely when the profile hasn't
 * loaded or the goal is zero — an empty ring is worse than no ring.
 */
export function DailyGoalCard({ className }: { className?: string }) {
  const profile = useStudyStore((s) => s.profile);
  const today = useStudyStore((s) => s.today);

  if (!profile || profile.dailyGoal <= 0) return null;

  const done = today?.uniqueWordsReviewed ?? 0;
  const met = done >= profile.dailyGoal;

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)]",
        className,
      )}
    >
      <ProgressRing
        value={done}
        max={profile.dailyGoal}
        size={64}
        label={`${Math.min(done, profile.dailyGoal)}`}
      />
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted uppercase">
          {met ? <Check className="size-3.5 text-success" /> : <Target className="size-3.5" />}
          Daily goal
        </p>
        <p className="mt-1 font-display text-xl font-medium tracking-tight tabular-nums">
          {done} / {profile.dailyGoal} words
        </p>
        <p className="mt-0.5 text-sm text-muted">
          {met
            ? "Goal met today. Anything more is a bonus."
            : `${profile.dailyGoal - done} to go today.`}
        </p>
      </div>
    </div>
  );
}

/** Level and XP, with the bar filling towards the next level. */
export function XpCard({ className }: { className?: string }) {
  const profile = useStudyStore((s) => s.profile);
  if (!profile) return null;

  const { level, xpIntoLevel, nextLevelAt, xpToNextLevel } = levelFromXp(profile.totalXP);

  return (
    <Link
      to="/account"
      className={cn(
        "block rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)] transition-shadow hover:shadow-[var(--shadow-border-hover)]",
        className,
      )}
    >
      <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted uppercase">
        <Zap className="size-3.5" />
        Experience
      </p>
      <p className="mt-1 font-display text-xl font-medium tracking-tight">
        Level {level}
        <span className="ml-2 text-base text-muted tabular-nums">
          {profile.totalXP} / {nextLevelAt} XP
        </span>
      </p>
      <Progress value={(xpIntoLevel / XP_PER_LEVEL) * 100} className="mt-3" />
      <p className="mt-2 text-sm text-muted tabular-nums">
        {xpToNextLevel} XP to level {level + 1}
      </p>
    </Link>
  );
}
