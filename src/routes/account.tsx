import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Award, Flame, Layers, Target, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { DailyGoalPicker } from "@/components/daily-goal-dialog";
import { Progress } from "@/components/ui/progress";
import {
  ACHIEVEMENTS,
  achievementProgress,
  levelFromXp,
  statsOf,
  XP_BY_RATING,
  XP_PER_LEVEL,
  type Achievement,
  type AchievementId,
  type AchievementStats,
} from "@/lib/gamification";
import { getDailyStatsRange } from "@/lib/study-sets";
import { useStudyStore } from "@/lib/store";
import type { DailyStats } from "@/lib/types";
import { cn, recentDateKeys } from "@/lib/utils";

export const Route = createFileRoute("/account")({ component: AccountRoute });

function AccountRoute() {
  return (
    <AuthGate>
      <AccountPage />
    </AuthGate>
  );
}

const TABS = [
  { id: "xp", label: "XP" },
  { id: "achievements", label: "Achievements" },
  { id: "goal", label: "Daily goal" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function AccountPage() {
  const profile = useStudyStore((s) => s.profile);
  const streak = useStudyStore((s) => s.streak);
  const fetchProfile = useStudyStore((s) => s.fetchProfile);
  const fetchStreak = useStudyStore((s) => s.fetchStreak);
  const [tab, setTab] = useState<TabId>("xp");

  useEffect(() => {
    void fetchProfile();
    void fetchStreak();
  }, [fetchProfile, fetchStreak]);

  if (!profile) {
    return (
      <AppShell>
        <p className="text-sm text-muted">Loading your profile…</p>
      </AppShell>
    );
  }

  const stats = statsOf(profile, streak?.currentStreak ?? 0);

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-medium tracking-tight">Your progress</h1>

      <div className="mt-6 flex gap-1 border-b border-border/80">
        {TABS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={tab === entry.id}
            onClick={() => setTab(entry.id)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              tab === entry.id
                ? "border-primary text-fg"
                : "border-transparent text-muted hover:text-fg",
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "xp" ? (
          <XpTab totalXP={profile.totalXP} totalReviews={profile.totalReviews} />
        ) : null}
        {tab === "achievements" ? (
          <AchievementsTab unlocked={profile.achievements} stats={stats} />
        ) : null}
        {tab === "goal" ? <GoalTab timeZone={profile.timeZone} /> : null}
      </div>
    </AppShell>
  );
}

const CHART_DAYS = 7;

function XpTab({ totalXP, totalReviews }: { totalXP: number; totalReviews: number }) {
  const { level, xpIntoLevel, xpToNextLevel } = levelFromXp(totalXP);
  const [history, setHistory] = useState<DailyStats[] | null>(null);

  const dates = useMemo(() => recentDateKeys(CHART_DAYS), []);
  useEffect(() => {
    let cancelled = false;
    void getDailyStatsRange({ data: { dates } })
      .then((rows) => {
        if (!cancelled) setHistory(rows);
      })
      .catch((error) => {
        console.error("Failed to load XP history:", error);
        if (!cancelled) setHistory([]);
      });
    return () => {
      cancelled = true;
    };
  }, [dates]);

  // What is left to the next level, in answers rather than points — "60 XP"
  // means nothing until you know what an answer is worth.
  const goodAnswersNeeded = Math.ceil(xpToNextLevel / XP_BY_RATING.good);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-surface p-6 shadow-[var(--shadow-border)]">
        <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted uppercase">
          <Zap className="size-3.5" />
          Level {level}
        </p>
        <p className="mt-2 font-display text-3xl font-medium tracking-tight tabular-nums">
          {totalXP} XP
        </p>
        <Progress value={(xpIntoLevel / XP_PER_LEVEL) * 100} className="mt-4" />
        <p className="mt-2 text-sm text-muted tabular-nums">
          {xpToNextLevel} XP to level {level + 1} — about {goodAnswersNeeded} more cards answered
          well.
        </p>
        <p className="mt-4 text-sm text-muted tabular-nums">
          {totalReviews} review{totalReviews === 1 ? "" : "s"} recorded.
        </p>
      </section>

      <section>
        <h2 className="text-sm font-medium">Last {CHART_DAYS} days</h2>
        {history === null ? (
          <p className="mt-3 text-sm text-muted">Loading…</p>
        ) : (
          <XpChart rows={history} />
        )}
      </section>

      <section className="text-sm text-muted">
        <h2 className="font-medium text-fg">How XP is earned</h2>
        <ul className="mt-2 space-y-1">
          <li>
            Easy +{XP_BY_RATING.easy} · Good +{XP_BY_RATING.good} · Hard {XP_BY_RATING.hard} · Again{" "}
            {XP_BY_RATING.again}
          </li>
          <li>
            Only a card&apos;s first review each day earns XP, so reviewing the same word again
            costs nothing and gains nothing.
          </li>
        </ul>
      </section>
    </div>
  );
}

/** Seven bars, one per day. Bare divs rather than a chart library for seven numbers. */
function XpChart({ rows }: { rows: DailyStats[] }) {
  const max = Math.max(1, ...rows.map((row) => row.xpEarned));

  return (
    <div className="mt-3 flex items-end gap-2">
      {rows.map((row) => {
        const height = row.xpEarned <= 0 ? 4 : Math.round((row.xpEarned / max) * 96);
        return (
          <div key={row.date} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-xs text-muted tabular-nums">{row.xpEarned}</span>
            <div
              className={cn("w-full rounded-md", row.xpEarned > 0 ? "bg-primary" : "bg-surface-2")}
              style={{ height: Math.max(4, height) }}
            />
            <span className="text-[11px] text-subtle">{format(`${row.date}T00:00`, "EEE")}</span>
          </div>
        );
      })}
    </div>
  );
}

const ACHIEVEMENT_ICONS: Record<AchievementId, typeof Award> = {
  streak_7: Flame,
  perfect_run: Target,
  mastered_10: Award,
  set_completed: Layers,
};

function AchievementsTab({
  unlocked,
  stats,
}: {
  unlocked: Record<string, number>;
  stats: AchievementStats;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {ACHIEVEMENTS.map((achievement) => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          unlockedAt={unlocked[achievement.id]}
          stats={stats}
        />
      ))}
    </div>
  );
}

function AchievementCard({
  achievement,
  unlockedAt,
  stats,
}: {
  achievement: Achievement;
  unlockedAt: number | undefined;
  stats: AchievementStats;
}) {
  const Icon = ACHIEVEMENT_ICONS[achievement.id];
  const { current, target } = achievementProgress(achievement, stats);
  const isUnlocked = unlockedAt !== undefined;

  return (
    <div
      className={cn(
        "flex gap-4 rounded-xl p-4 shadow-[var(--shadow-border)]",
        isUnlocked ? "bg-surface" : "bg-surface/50",
      )}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-full",
          isUnlocked ? "bg-primary text-primary-fg" : "bg-surface-2 text-subtle",
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className={cn("font-medium", !isUnlocked && "text-muted")}>{achievement.name}</p>
        <p className="mt-0.5 text-sm text-muted">{achievement.description}</p>
        <p className="mt-1 text-xs tabular-nums">
          {isUnlocked ? (
            <span className="text-success">Unlocked {format(unlockedAt, "d MMM yyyy")}</span>
          ) : (
            <span className="text-subtle">
              {current} / {target}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

function GoalTab({ timeZone }: { timeZone: string }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        The goal counts distinct words reviewed in a day, not answers — so coming back to the same
        card doesn&apos;t move it.
      </p>
      <DailyGoalPicker />
      <p className="text-xs text-subtle">
        Days roll over in your own timezone{timeZone ? ` (${timeZone})` : ""}.
      </p>
    </div>
  );
}
