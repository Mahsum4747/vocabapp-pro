import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Award, Flame, Layers, Target, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { DailyGoalPicker } from "@/components/daily-goal-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { DEFAULT_SOUND_SETTINGS, playSound, type SoundSettings } from "@/lib/sound";
import { getDailyStatsRange } from "@/lib/study-sets";
import { deleteUserAccount } from "@/lib/delete-account";
import { deleteAuthAccount } from "@/lib/delete-auth-account";
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
  { id: "sound", label: "Sound" },
  { id: "account", label: "Account" },
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
      <h1 className="font-display text-3xl font-medium tracking-tight">Account</h1>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border/80">
        {TABS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={tab === entry.id}
            onClick={() => setTab(entry.id)}
            className={cn(
              "-mb-px shrink-0 border-b-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
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
        {tab === "sound" ? <SoundTab /> : null}
        {tab === "account" ? <AccountTab /> : null}
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

/**
 * Sound settings. Saved as they are changed rather than behind a Save button:
 * there are two controls and both are instantly reversible.
 */
function SoundTab() {
  const profile = useStudyStore((s) => s.profile);
  const setSoundSettings = useStudyStore((s) => s.setSoundSettings);
  const settings = profile?.soundSettings ?? DEFAULT_SOUND_SETTINGS;

  function save(next: SoundSettings) {
    void setSoundSettings(next).catch((error) =>
      console.error("Failed to save sound settings:", error),
    );
  }

  return (
    <div className="max-w-md space-y-6">
      <label className="flex items-center justify-between gap-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
        <span>
          <span className="block font-medium">Sound effects</span>
          <span className="block text-sm text-muted">
            Short cues when a card is flipped or answered.
          </span>
        </span>
        <input
          type="checkbox"
          className="size-5 shrink-0 accent-[var(--color-primary)]"
          checked={settings.enabled}
          onChange={(e) => save({ ...settings, enabled: e.target.checked })}
        />
      </label>

      <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
        <div className="flex items-center justify-between">
          <label htmlFor="volume" className="font-medium">
            Volume
          </label>
          <span className="text-sm text-muted tabular-nums">{settings.volume}</span>
        </div>
        <input
          id="volume"
          type="range"
          min={0}
          max={100}
          step={5}
          value={settings.volume}
          disabled={!settings.enabled}
          onChange={(e) => save({ ...settings, volume: Number(e.target.value) })}
          onMouseUp={() => playSound("correct")}
          onTouchEnd={() => playSound("correct")}
          className="mt-3 w-full accent-[var(--color-primary)] disabled:opacity-50"
        />
        <p className="mt-2 text-xs text-subtle">Zero is silence, even with sound switched on.</p>
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

function AccountTab() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteAccount() {
    if (confirmText.toUpperCase() !== "DELETE") return;
    setIsDeleting(true);
    try {
      // Two separate server functions/requests (Firestore, then Postgres) —
      // see delete-auth-account.ts for why they aren't combined into one.
      await deleteUserAccount({});
      await deleteAuthAccount({});
      toast.success("Account deleted.");
      // Sign out and redirect to login. Dynamic import: better-auth/react
      // must stay out of every route's eager bundle graph (see auth-gate.tsx).
      const { signOut } = await import("@/lib/auth/client");
      await signOut("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete account.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="max-w-md space-y-4">
      <div className="rounded-xl bg-danger-soft p-4 shadow-[var(--shadow-border)]">
        <h3 className="font-medium text-danger">Delete account</h3>
        <p className="mt-2 text-sm text-danger/80">
          This permanently deletes your account, all study sets, cards, and progress. This action
          cannot be undone.
        </p>
        <Button
          className="mt-4 w-full bg-danger hover:bg-danger/90"
          onClick={() => setConfirmOpen(true)}
        >
          Delete my account
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent title="Delete account permanently?">
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted">
              This will permanently delete your account and all your data, including:
            </p>
            <ul className="space-y-1 text-sm text-muted list-disc list-inside">
              <li>All study sets and cards</li>
              <li>All learning progress and review history</li>
              <li>Account settings and preferences</li>
            </ul>
            <p className="text-sm font-medium text-fg">To confirm, type DELETE below:</p>
            <Input
              type="text"
              placeholder="Type DELETE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="font-mono"
              disabled={isDeleting}
            />
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-danger hover:bg-danger/90"
                onClick={handleDeleteAccount}
                disabled={confirmText.toUpperCase() !== "DELETE" || isDeleting}
              >
                {isDeleting ? "Deleting…" : "Delete permanently"}
              </Button>
              <DialogClose asChild>
                <Button className="flex-1" variant="outline" disabled={isDeleting}>
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
