import { reportOperationFailure } from "@/lib/operation-errors";
import { getPromptById, promptTitle } from "@/content/write-prompts";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Award, Flame, Layers, Target, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { DailyGoalPicker } from "@/components/daily-goal-dialog";
import { LearningPrefsSection } from "@/components/learning-prefs";
import { LibraryProgressPanel } from "@/components/library-progress-panel";
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
import { getGrammarAssessment } from "@/lib/grammar-assessment";
import { getGrammarProgress, type GrammarProgressDoc } from "@/lib/grammar-progress";
import { useStudyStore } from "@/lib/store";
import type { DailyStats } from "@/lib/types";
import { cn, recentDateKeys } from "@/lib/utils";
import { getWriteItFeedbackLog, type WriteItFeedbackLogEntry } from "@/lib/write-it-feedback";
import type { ErrorCategory } from "@/lib/write-feedback-types";

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
  { id: "feedback", label: "AI Feedback" },
  { id: "grammar", label: "Grammar Review" },
  { id: "sound", label: "Sound" },
  { id: "account", label: "Account" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function AccountPage() {
  const profile = useStudyStore((s) => s.profile);
  const streak = useStudyStore((s) => s.streak);
  const fetchProfile = useStudyStore((s) => s.fetchProfile);
  const fetchStreak = useStudyStore((s) => s.fetchStreak);
  // Needed for the progress panel's review/weak-word counts — this route
  // otherwise never loads sets or progress.
  const fetchSets = useStudyStore((s) => s.fetchSets);
  const fetchAllProgress = useStudyStore((s) => s.fetchAllProgress);
  const [tab, setTab] = useState<TabId>("xp");

  useEffect(() => {
    void fetchProfile();
    void fetchStreak();
    void fetchSets();
    void fetchAllProgress();
  }, [fetchProfile, fetchStreak, fetchSets, fetchAllProgress]);

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

      <LibraryProgressPanel className="mt-6" />

      <div className="mt-6 flex gap-1 overflow-x-auto overscroll-x-contain border-b border-border/80">
        {TABS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={tab === entry.id}
            onClick={() => setTab(entry.id)}
            className={cn(
              "-mb-px shrink-0 border-b-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors pointer-coarse:py-3",
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
        {tab === "feedback" ? <AiFeedbackTab /> : null}
        {tab === "grammar" ? (
          <GrammarReviewTab explanationLanguage={profile.explanationLanguage} />
        ) : null}
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
      <section className="rounded-card bg-surface p-6 shadow-[var(--elevation-1)]">
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
              className={cn(
                "w-full rounded-control",
                row.xpEarned > 0 ? "bg-primary" : "bg-surface-2",
              )}
              style={{ height: Math.max(4, height) }}
            />
            <span className="text-2xs text-subtle">{format(`${row.date}T00:00`, "EEE")}</span>
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
        "flex gap-4 rounded-card p-4 shadow-[var(--elevation-1)]",
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
      <label className="flex items-center justify-between gap-4 rounded-card bg-surface p-4 shadow-[var(--elevation-1)]">
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

      <div className="rounded-card bg-surface p-4 shadow-[var(--elevation-1)]">
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

      <p className="text-xs text-subtle">
        Card audio (the speaker icon) uses your device&apos;s best available voice for each language
        automatically. For more or better-sounding voices, check your OS&apos;s voice settings —
        iOS: Settings → Accessibility → Spoken Content → Voices; Android: install additional voice
        packs from Google text-to-speech settings.
      </p>
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

/**
 * Read-only log of every WriteIt AI feedback the learner has ever requested
 * — grouped by set, newest set-group order determined by that group's own
 * most recent entry, newest first within each group. Mostly a lookup list,
 * plus one small top-of-page summary (`ErrorTagSummary` below) of the
 * structured `errorTags` write-sentence-feedback.ts already logs alongside
 * the free-text feedback (Dilim 3) — until now written but never read back
 * anywhere. Purely a client-side tally over the same rows this tab already
 * fetches: no new Gemini call, no new server function, no deep-link into a
 * drill from a weak category (left for a later, separate decision).
 */
function AiFeedbackTab() {
  const [entries, setEntries] = useState<WriteItFeedbackLogEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getWriteItFeedbackLog({})
      .then((rows) => {
        if (!cancelled) setEntries(rows);
      })
      .catch((err) => {
        console.error("Failed to load AI feedback log:", err);
        if (!cancelled) setError("Couldn't load your AI feedback history.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p className="text-sm text-danger">{error}</p>;
  if (entries === null) return <p className="text-sm text-muted">Loading…</p>;
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted">
        No AI feedback yet — tap &quot;Get AI feedback&quot; after a Write It step to see it here.
      </p>
    );
  }

  const groups = new Map<string, { setTitle: string; entries: WriteItFeedbackLogEntry[] }>();
  for (const entry of entries) {
    const group = groups.get(entry.setId);
    if (group) group.entries.push(entry);
    else groups.set(entry.setId, { setTitle: entry.setTitle, entries: [entry] });
  }
  // `entries` is already newest-first (server orderBy), so each group's
  // first pushed entry is its own newest — sort the groups the same way.
  const orderedGroups = [...groups.values()].sort(
    (a, b) => b.entries[0].createdAt - a.entries[0].createdAt,
  );

  return (
    <div className="space-y-6">
      <ErrorTagSummary entries={entries} />
      {orderedGroups.map((group) => (
        <section key={group.entries[0].setId}>
          <h2 className="text-sm font-medium">{group.setTitle}</h2>
          <div className="mt-2 space-y-2">
            {group.entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-card bg-surface p-4 shadow-[var(--elevation-1)]"
              >
                <p className="font-medium">
                  {entry.term ??
                    (entry.promptId && getPromptById(entry.promptId) ? (
                      promptTitle(getPromptById(entry.promptId)!)
                    ) : (
                      <span className="text-muted italic">Free writing</span>
                    ))}
                </p>
                <p className="mt-1 text-sm text-muted">&ldquo;{entry.learnerSentence}&rdquo;</p>
                <p className="mt-2 text-xs font-medium tracking-wide text-muted uppercase">
                  AI feedback
                </p>
                <p className="mt-1 text-sm text-fg">{entry.feedback}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Human-readable label per `ErrorCategory` — the raw enum value
 *  (`article_gender`, `word_order_other`, ...) is Gemini's own vocabulary,
 *  not something to show a learner as-is. */
const ERROR_CATEGORY_LABELS: Record<ErrorCategory, string> = {
  article_gender: "Article gender (der/die/das)",
  case: "Case (Akkusativ/Dativ/...)",
  verb_position: "Verb position",
  verb_conjugation: "Verb conjugation",
  register: "Register (du/Sie)",
  missing_leitpunkt: "Missing a required point",
  word_choice: "Word choice",
  spelling: "Spelling",
  word_order_other: "Word order",
};

/** Minimum total feedback rows before the summary below replaces its own
 *  gentle empty state — a handful of sentences isn't enough to call
 *  anything a "pattern" yet, and a 1-of-1 category would just be noise. */
const MIN_FEEDBACK_FOR_SUMMARY = 5;

/**
 * "Your most common mistakes" — a plain tally over `errorTags` across every
 * row already fetched by `AiFeedbackTab` above it, not a new query or a new
 * Gemini call. Same simplicity as `WeakWordsCard` (goal-and-xp.tsx): one
 * line per category, no chart, no dashboard. Read-only — tapping a
 * category doesn't go anywhere (a "practice this weak spot" deep-link is a
 * separate decision, left for later).
 */
function ErrorTagSummary({ entries }: { entries: WriteItFeedbackLogEntry[] }) {
  if (entries.length < MIN_FEEDBACK_FOR_SUMMARY) {
    return (
      <div className="rounded-card bg-surface p-4 shadow-[var(--elevation-1)]">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">
          Most common mistakes
        </p>
        <p className="mt-1 text-sm text-muted">
          Not enough feedback yet to spot a pattern — write a few more sentences and check back
          here.
        </p>
      </div>
    );
  }

  const counts = new Map<ErrorCategory, number>();
  for (const entry of entries) {
    for (const tag of entry.errorTags ?? []) {
      counts.set(tag.category, (counts.get(tag.category) ?? 0) + 1);
    }
  }
  const top = [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // `errorTags` is additive (see write-it-feedback.ts's own doc comment) —
  // older rows, or ones Gemini returned without any tags, simply have
  // none. With `entries.length` already past the threshold above but
  // nothing tagged at all, the honest state is still "no pattern yet",
  // not a misleading empty list.
  if (top.length === 0) {
    return (
      <div className="rounded-card bg-surface p-4 shadow-[var(--elevation-1)]">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">
          Most common mistakes
        </p>
        <p className="mt-1 text-sm text-muted">No categorized mistakes in your feedback yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-card bg-surface p-4 shadow-[var(--elevation-1)]">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">Most common mistakes</p>
      <ul className="mt-1 space-y-0.5">
        {top.map(({ category, count }) => (
          <li key={category} className="text-sm text-fg">
            {ERROR_CATEGORY_LABELS[category]}
            <span className="text-muted">
              {" "}
              — {count} time{count === 1 ? "" : "s"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const MIN_GRAMMAR_ATTEMPTS = 5;

type GrammarReviewState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; assessment: string }
  | { status: "error"; error: string };

/**
 * Optional, explicitly-triggered AI review of the learner's `grammarProgress`
 * data (grammar-assessment.ts) — never automatic, never polled. Loads the
 * progress doc once (same `getGrammarProgress` the grammar hub itself uses)
 * purely to decide whether there's enough data to offer the button at all;
 * the actual Gemini call only happens on click, and spends one action from
 * the same shared AI budget pool every other Gemini feature uses.
 */
function GrammarReviewTab({ explanationLanguage }: { explanationLanguage?: string }) {
  const [progress, setProgress] = useState<GrammarProgressDoc | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [state, setState] = useState<GrammarReviewState>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;
    getGrammarProgress()
      .then((doc) => {
        if (!cancelled) setProgress(doc);
      })
      .catch((err) => {
        console.error("Failed to load grammar progress:", err);
        if (!cancelled) setLoadError("Couldn't load your grammar practice data.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function requestAssessment() {
    setState({ status: "loading" });
    try {
      const result = await getGrammarAssessment({
        data: explanationLanguage ? { explanationLanguage } : {},
      });
      if (result.status === "ok") {
        setState({ status: "ready", assessment: result.assessment });
      } else if (result.status === "insufficient") {
        setState({
          status: "error",
          error: "Not enough practice data yet — try a few more drills.",
        });
      } else {
        setState({ status: "error", error: result.error });
      }
    } catch {
      setState({ status: "error", error: "Couldn't get a review right now — try again." });
    }
  }

  if (loadError) return <p className="text-sm text-danger">{loadError}</p>;
  if (progress === null) return <p className="text-sm text-muted">Loading…</p>;

  const totalAttempts = Object.values(progress).reduce((sum, t) => sum + t.totalAttempts, 0);

  if (totalAttempts < MIN_GRAMMAR_ATTEMPTS) {
    return (
      <p className="text-sm text-muted">
        Not enough grammar drill data yet — practice a few rounds under Grammar practice, then check
        back here for an AI review of your weak spots.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Get a short AI review of your grammar drill accuracy across every topic you&apos;ve
        practiced, with a suggestion for what to focus on next.
      </p>
      <Button onClick={() => void requestAssessment()} disabled={state.status === "loading"}>
        {state.status === "loading" ? "Analyzing…" : "Get grammar review"}
      </Button>
      {state.status === "ready" ? (
        <div className="rounded-card bg-surface p-4 shadow-[var(--elevation-1)]">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Grammar review</p>
          <p className="mt-1 text-sm whitespace-pre-line text-fg">{state.assessment}</p>
        </div>
      ) : null}
      {state.status === "error" ? <p className="text-sm text-danger">{state.error}</p> : null}
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
    let learningDeleted = false;
    let identityDeleted = false;
    try {
      // Two separate server functions/requests (Firestore, then Postgres) —
      // see delete-auth-account.ts for why they aren't combined into one.
      await deleteUserAccount({});
      learningDeleted = true;
      await deleteAuthAccount({});
      identityDeleted = true;
      toast.success("Account deleted.");
      // Sign out and redirect to login. Dynamic import: better-auth/react
      // must stay out of every route's eager bundle graph (see auth-gate.tsx).
      const { signOut } = await import("@/lib/auth/client");
      await signOut("/login");
    } catch (error) {
      reportOperationFailure(
        "account.delete",
        error,
        identityDeleted
          ? "Account removed. Session sign-out failed; return to Sign in."
          : learningDeleted
            ? "Learning data removed. Sign-in account deletion failed; retry deletion."
            : "Deletion did not finish. Retry to remove the remaining data.",
      );
      setIsDeleting(false);
    }
  }

  return (
    <div className="max-w-md space-y-4">
      <LearningPrefsSection />
      <div className="rounded-card bg-danger-soft p-4 shadow-[var(--elevation-1)]">
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
