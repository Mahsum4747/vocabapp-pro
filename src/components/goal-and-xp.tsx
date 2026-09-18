import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Check, Target, Zap } from "lucide-react";
import { levelFromXp, XP_PER_LEVEL } from "@/lib/gamification";
import { useStudyStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { ProgressRing } from "./progress-ring";
import { Progress } from "./ui/progress";
import { StreakIndicator } from "./streak-indicator";

/**
 * Today's goal: how many distinct words have been worked on, out of the target.
 *
 * Counts unique words rather than reviews, so grading the same card five times
 * doesn't finish the day's goal. Hidden entirely when the profile hasn't
 * loaded or the goal is zero — an empty ring is worse than no ring.
 *
 * `streakDays` rides along in the same card rather than its own row — it's
 * the same "keeping up with today" question the goal ring already answers.
 * Omitted (or 0) renders nothing extra, same as `StreakIndicator` itself.
 */
export function DailyGoalCard({
  className,
  streakDays,
}: {
  className?: string;
  streakDays?: number;
}) {
  const profile = useStudyStore((s) => s.profile);
  const today = useStudyStore((s) => s.today);
  const done = today?.uniqueWordsReviewed ?? 0;
  // Called unconditionally, before the early return below — a hook can never
  // sit after a conditional return, or the hook count changes the moment
  // `profile` finishes loading and trips "Rendered more hooks than during
  // the previous render" (see the motion/depth branch postmortem).
  const animatedDone = useAnimatedNumber(profile ? Math.min(done, profile.dailyGoal) : 0);

  if (!profile || profile.dailyGoal <= 0) return null;

  const met = done >= profile.dailyGoal;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 rounded-2xl bg-surface p-5 shadow-[var(--elevation-1)]",
        className,
      )}
    >
      <div className="flex min-w-[200px] flex-1 items-center gap-4">
        <ProgressRing value={done} max={profile.dailyGoal} size={64} label={`${animatedDone}`} />
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
      {/* flex-wrap on the card lets this drop to its own line rather than
          crowding or overlapping the text above at narrow widths. */}
      {streakDays && streakDays > 0 ? (
        <div className="shrink-0">
          <StreakIndicator days={streakDays} />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Cards that keep going wrong, as a way into a weak-words round.
 *
 * The count is handed in rather than derived here: the home page already holds
 * the progress this is computed from, and a second read of it would be a
 * second chance to disagree with what the session serves.
 */
export function WeakWordsCard({ count, className }: { count: number; className?: string }) {
  // Nothing weak is not a state worth a card. It is the normal one.
  if (count <= 0) return null;

  return (
    <Link
      to="/review"
      search={{ filter: "weak" as const }}
      className={cn(
        "flex items-center justify-between gap-4 rounded-2xl bg-surface p-5 shadow-[var(--elevation-1)] transition-[box-shadow,transform] duration-[var(--duration-base)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:shadow-[var(--elevation-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted uppercase">
          <AlertTriangle className="size-3.5" />
          Weak words
        </p>
        <p className="mt-1 font-display text-xl font-medium tracking-tight tabular-nums">
          {count} word{count === 1 ? "" : "s"} giving you trouble
        </p>
        <p className="mt-2 text-sm text-muted">Cards you keep missing, hardest first.</p>
      </div>
      {/* The other two cards in this row are read-only status; this one is
          an action, so — unlike them — it says so, instead of relying only
          on the shared hover lift to signal that. */}
      <span className="inline-flex h-9 shrink-0 items-center gap-1 rounded-md bg-primary px-3 text-sm font-medium text-primary-fg">
        Practice
        <ArrowRight className="size-3.5" />
      </span>
    </Link>
  );
}

/** Level and XP, with the bar filling towards the next level. */
export function XpCard({ className }: { className?: string }) {
  const profile = useStudyStore((s) => s.profile);
  // Called unconditionally, before the early return below — see the same
  // note in DailyGoalCard just above.
  const animatedXp = useAnimatedNumber(profile?.totalXP ?? 0);
  if (!profile) return null;

  const { level, xpIntoLevel, nextLevelAt, xpToNextLevel } = levelFromXp(profile.totalXP);

  return (
    <Link
      to="/account"
      className={cn(
        "block rounded-2xl bg-surface p-5 shadow-[var(--elevation-1)] transition-[box-shadow,transform] duration-[var(--duration-base)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:shadow-[var(--elevation-2)]",
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
          {animatedXp} / {nextLevelAt} XP
        </span>
      </p>
      <Progress value={(xpIntoLevel / XP_PER_LEVEL) * 100} className="mt-3" />
      <p className="mt-2 text-sm text-muted tabular-nums">
        {xpToNextLevel} XP to level {level + 1}
      </p>
    </Link>
  );
}
