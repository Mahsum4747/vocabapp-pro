import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { EmptyState } from "@/components/empty-state";
import { LibraryProgressPanel } from "@/components/library-progress-panel";
import { PullToRefresh } from "@/components/pull-to-refresh";
import { SetCard } from "@/components/set-card";
import { PublicSetCard } from "@/components/public-set-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { masteryStats } from "@/lib/quiz";
import { useProgress, useStudyStore } from "@/lib/store";
import { DEFAULT_DAILY_GOAL } from "@/lib/daily-goal";
import { LearningPrefsPrompt } from "@/components/learning-prefs";
import { buildTodaySummary, describeToday, type TodayQueue } from "@/lib/today-summary";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Lazy: pulls in the auth client (better-auth/react), which must stay out of
// this route's eager bundle — see auth-gate.tsx's RequireAuth for why. Only
// used to pick this page's default tab; it renders nothing itself.
const ReportSignedIn = lazy(() =>
  import("@/lib/auth/gates").then((m) => ({ default: m.ReportSignedIn })),
);

type Search = { view?: "mine" | "public" };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    view: search.view === "mine" ? "mine" : undefined,
  }),
  component: Home,
});

function Home() {
  const sets = useStudyStore((s) => s.sets);
  const publicSets = useStudyStore((s) => s.publicSets);
  const restoreSeeds = useStudyStore((s) => s.restoreSeeds);
  const fetchSets = useStudyStore((s) => s.fetchSets);
  const fetchPublicSets = useStudyStore((s) => s.fetchPublicSets);
  const fetchStreak = useStudyStore((s) => s.fetchStreak);
  const fetchAllProgress = useStudyStore((s) => s.fetchAllProgress);
  const fetchProfile = useStudyStore((s) => s.fetchProfile);
  const fetchTodaySummary = useStudyStore((s) => s.fetchTodaySummary);
  const todaySummary = useStudyStore((s) => s.todaySummary);
  const todaySummarySettled = useStudyStore((s) => s.todaySummarySettled);
  const updateSetMeta = useStudyStore((s) => s.updateSetMeta);
  const progress = useProgress();
  const isLoaded = useStudyStore((s) => s.isLoaded);
  const profile = useStudyStore((s) => s.profile);

  // The server's cached summary is the source; if it couldn't be fetched (signed
  // out with local sample sets, or a failed read) fall back to computing the
  // same summary locally with the same functions.
  const todayQueue = useMemo<TodayQueue | null>(() => {
    if (!todaySummarySettled) return null;
    const now = Date.now();
    if (todaySummary) return describeToday(todaySummary.summary, todaySummary.dailyGoal, now);
    return describeToday(
      buildTodaySummary(sets, progress, now),
      profile?.dailyGoal ?? DEFAULT_DAILY_GOAL,
      now,
    );
  }, [todaySummary, todaySummarySettled, sets, progress, profile]);

  useEffect(() => {
    fetchSets();
    fetchPublicSets();
    fetchStreak();
    // One query for the whole library, so every set card can show real
    // mastery without a request per set.
    fetchAllProgress();
    // Goal, XP and today's counters — one call, shared by both cards below.
    fetchProfile();
    // Cached queue counts for the Today card — one document read when fresh.
    fetchTodaySummary();
  }, [fetchSets, fetchPublicSets, fetchStreak, fetchAllProgress, fetchProfile, fetchTodaySummary]);

  // Pull-to-refresh re-runs the exact same fetches as the mount effect above
  // — same data, just re-requested on demand instead of full page reload.
  function refreshHome() {
    return Promise.all([
      fetchSets(),
      fetchPublicSets(),
      fetchStreak(),
      fetchAllProgress(),
      fetchProfile(),
      fetchTodaySummary(),
    ]);
  }

  const { view: viewParam } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [moveFolder, setMoveFolder] = useState("");
  const [moving, setMoving] = useState(false);
  // Starts on "public" — the only tab that works before we know whether this
  // visitor is signed in (see AuthGate below) — and flips to "mine" once
  // `ReportSignedIn` resolves, unless an explicit `?view=` or a manual click
  // already decided it.
  const [view, setView] = useState<"mine" | "public">(viewParam ?? "public");
  const viewDecided = useRef(Boolean(viewParam));

  // The mobile bottom nav's "My Library" tab navigates here with ?view=mine;
  // pick that up even when this component is already mounted (a client-side
  // navigation doesn't remount, so the useState initializer above only runs once).
  useEffect(() => {
    if (viewParam) {
      viewDecided.current = true;
      setView(viewParam);
    }
  }, [viewParam]);

  /** A visitor's own click always wins over the sign-in-based default. */
  function chooseView(next: "mine" | "public") {
    viewDecided.current = true;
    setView(next);
  }

  // `sets` only ever holds the current user's own sets (getMySets/getSetById
  // are ownership-scoped), so excluding those ids from `publicSets` is the
  // same as excluding "my own public sets" — without pulling the auth client
  // into this route's bundle.
  const otherPublicSets = useMemo(() => {
    const ownIds = new Set(sets.map((s) => s.id));
    return publicSets.filter((set) => !ownIds.has(set.id));
  }, [publicSets, sets]);

  const continueSet = useMemo(() => {
    return [...sets]
      .filter((s) => s.lastStudiedAt)
      .sort((a, b) => (b.lastStudiedAt ?? 0) - (a.lastStudiedAt ?? 0))[0];
  }, [sets]);

  const continueMastery = useMemo(
    () => masteryStats(continueSet?.cards ?? [], progress),
    [continueSet, progress],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sets;
    return sets.filter(
      (set) =>
        set.title.toLowerCase().includes(q) ||
        set.description.toLowerCase().includes(q) ||
        set.subject.toLowerCase().includes(q) ||
        set.cards.some(
          (card) =>
            card.term.toLowerCase().includes(q) || card.definition.toLowerCase().includes(q),
        ),
    );
  }, [sets, query]);

  const UNCATEGORIZED = "Uncategorized";
  const folderGroups = useMemo(() => {
    const groups = new Map<string, typeof filtered>();
    for (const set of filtered) {
      const key = set.folder?.trim() || UNCATEGORIZED;
      const list = groups.get(key);
      if (list) list.push(set);
      else groups.set(key, [set]);
    }
    const names = Array.from(groups.keys())
      .filter((name) => name !== UNCATEGORIZED)
      .sort((a, b) => a.localeCompare(b));
    if (groups.has(UNCATEGORIZED)) names.push(UNCATEGORIZED);
    return names.map((name) => ({ name, sets: groups.get(name)! }));
  }, [filtered]);

  function toggleFolder(name: string) {
    setCollapsedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  const folderOptions = useMemo(
    () =>
      Array.from(new Set(sets.map((s) => s.folder?.trim()).filter((f): f is string => !!f))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [sets],
  );

  const uncategorizedCount = useMemo(
    () => sets.filter((s) => !s.folder?.trim()).length,
    [sets],
  );
  const uncategorizedRatio = sets.length > 0 ? uncategorizedCount / sets.length : 0;

  function toggleSelectMode(next: boolean) {
    setSelectMode(next);
    setSelectedIds(new Set());
    setMoveFolder("");
  }

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function moveSelectedToFolder() {
    const target = moveFolder.trim();
    if (!target || selectedIds.size === 0) return;
    setMoving(true);
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) => updateSetMeta(id, { folder: target })),
      );
      toast.success(
        `Moved ${selectedIds.size} set${selectedIds.size === 1 ? "" : "s"} to "${target}".`,
      );
      toggleSelectMode(false);
    } catch (error) {
      console.error("Failed to move sets to folder:", error);
      toast.error("Couldn't move those sets, try again.");
    } finally {
      setMoving(false);
    }
  }

  return (
    <AppShell>
      <PullToRefresh onRefresh={refreshHome}>
        {/* Renders nothing — just tells us once whether to default this page's
          tab to "mine" instead of "public" for a signed-in visitor. */}
        <Suspense fallback={null}>
          <ReportSignedIn
            onKnown={(signedIn) => {
              if (!viewDecided.current) {
                viewDecided.current = true;
                setView(signedIn ? "mine" : "public");
              }
            }}
          />
        </Suspense>
        <section className="stagger-in">
          <TodayCta
            isLoaded={isLoaded && todaySummarySettled}
            libraryEmpty={sets.length === 0}
            today={todayQueue}
            onLoadSamples={() => restoreSeeds()}
          />

          <LearningPrefsPrompt />

          {/* Frequent, but secondary to today's actual work above — a visitor
            with a full library still reaches for these often enough that
            they stay one tap away, just lighter than the CTA. */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/create">
                <Plus />
                New set
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/create" search={{ ai: true }}>
                <Sparkles />
                Generate from topic
              </Link>
            </Button>
          </div>
        </section>

        <LibraryProgressPanel className="mt-section" showReview={false} />

        {continueSet ? (
          <Link
            to="/sets/$setId"
            params={{ setId: continueSet.id }}
            className="mt-section flex flex-col justify-between gap-4 rounded-card bg-primary p-card text-primary-fg shadow-[var(--elevation-raised)] md:flex-row md:items-end"
          >
            <div>
              <p className="text-xs font-medium tracking-wide text-primary-fg/70 uppercase">
                Continue where you left off
              </p>
              <h2 className="mt-2 font-display text-2xl font-medium tracking-tight">
                {continueSet.title}
              </h2>
              <p className="mt-1 text-sm text-primary-fg/75">
                {continueSet.cards.length} cards · {continueMastery.percent}% progress
                {continueMastery.notStarted > 0
                  ? ` · ${continueMastery.notStarted} not started`
                  : ""}
              </p>
            </div>
            <span className="inline-flex h-11 items-center rounded-control bg-primary-fg px-4 text-sm font-medium text-primary">
              Continue
            </span>
          </Link>
        ) : null}

        <div className="mt-section flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <button type="button" className="tap-target" onClick={() => chooseView("mine")}>
              <Badge tone={view === "mine" ? "primary" : "muted"}>My Library</Badge>
            </button>
            <button type="button" className="tap-target" onClick={() => chooseView("public")}>
              <Badge tone={view === "public" ? "accent" : "muted"}>Public Sets</Badge>
            </button>
          </div>
          {view === "mine" ? (
            <AuthGate>
              <div className="relative w-full md:max-w-xs">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sets or cards"
                  className="pl-10"
                  aria-label="Search"
                />
              </div>
            </AuthGate>
          ) : null}
        </div>

        {view === "mine" ? (
          // My Library is personal data — AuthGate redirects to /login when
          // signed out (e.g. a visitor who came for Public Sets clicks this tab).
          <AuthGate>
            <>
              {selectMode ? (
                <div className="mt-4 flex flex-col gap-2 rounded-control bg-surface-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-muted tabular-nums">
                    {selectedIds.size} selected
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      list="library-folder-options"
                      value={moveFolder}
                      onChange={(e) => setMoveFolder(e.target.value)}
                      placeholder="Move to folder…"
                      className="h-9 w-48"
                    />
                    <datalist id="library-folder-options">
                      {folderOptions.map((name) => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                    <Button
                      type="button"
                      size="sm"
                      disabled={!moveFolder.trim() || selectedIds.size === 0 || moving}
                      onClick={moveSelectedToFolder}
                    >
                      Move
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleSelectMode(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : sets.length > 0 && uncategorizedRatio > 0.5 ? (
                // Most of the library has no folder — the light one-line tip
                // stopped being enough to notice, so this offers the fix
                // directly instead of pointing at "edit a set" one at a time.
                <div className="mt-4 flex flex-col gap-2 rounded-control bg-surface-2 p-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    {uncategorizedCount} of {sets.length} sets have no folder yet.
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => toggleSelectMode(true)}
                  >
                    Organize into folders
                  </Button>
                </div>
              ) : null}

              {filtered.length === 0 ? (
                <div className="mt-8">
                  <EmptyState
                    title={sets.length === 0 ? "Library is empty" : "No results"}
                    description={
                      sets.length === 0
                        ? "Create your first set or load the sample sets."
                        : "Try a different search or subject."
                    }
                    action={
                      sets.length === 0 ? (
                        <div className="flex flex-wrap justify-center gap-2">
                          <Button asChild>
                            <Link to="/create">Create a set</Link>
                          </Button>
                          <Button variant="outline" onClick={() => restoreSeeds()}>
                            Load samples
                          </Button>
                        </div>
                      ) : undefined
                    }
                  />
                </div>
              ) : (
                <div className="mt-section space-y-section">
                  {folderGroups.map((group) => {
                    const collapsed = collapsedFolders.has(group.name);
                    return (
                      <div key={group.name}>
                        <button
                          type="button"
                          onClick={() => toggleFolder(group.name)}
                          className="tap-target flex items-center gap-1.5 text-sm font-medium text-muted hover:text-fg"
                        >
                          {collapsed ? (
                            <ChevronRight className="size-4" />
                          ) : (
                            <ChevronDown className="size-4" />
                          )}
                          {group.name}
                          <span className="tabular-nums">({group.sets.length})</span>
                        </button>
                        {!collapsed ? (
                          <div className="mt-3 grid gap-gutter sm:grid-cols-2 lg:grid-cols-3">
                            {group.sets.map((set) => (
                              <SetCard
                                key={set.id}
                                set={set}
                                selectable={selectMode}
                                selected={selectedIds.has(set.id)}
                                onToggleSelect={() => toggleSelected(set.id)}
                              />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          </AuthGate>
        ) : otherPublicSets.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No public sets"
              description={
                // otherPublicSets excludes the viewer's own sets, so a signed-in
                // visitor who owns every currently-public set sees this as
                // empty too — say so, rather than implying nobody has shared
                // anything at all.
                sets.length > 0
                  ? "You're the only one sharing sets right now."
                  : "No one has shared a set yet."
              }
            />
          </div>
        ) : (
          <div className="mt-section grid gap-gutter sm:grid-cols-2 lg:grid-cols-3">
            {otherPublicSets.map((set) => (
              <PublicSetCard key={set.id} set={set} />
            ))}
          </div>
        )}
      </PullToRefresh>
    </AppShell>
  );
}

/**
 * "What do I do today?" — the page's single heaviest element, answering the
 * question the old "What will you study today?" heading only asked. Four
 * shapes, in priority order: cards due beats weak words beats "all caught
 * up" beats an empty library, since an empty library has no due/weak counts
 * of its own to show.
 */
function TodayCta({
  isLoaded,
  libraryEmpty,
  today,
  onLoadSamples,
}: {
  isLoaded: boolean;
  libraryEmpty: boolean;
  today: TodayQueue | null;
  onLoadSamples: () => void;
}) {
  if (!isLoaded || !today) {
    return (
      <div className="h-skeleton-cta animate-pulse rounded-card bg-surface shadow-[var(--elevation-1)]" />
    );
  }

  if (libraryEmpty) {
    return (
      <div className="rounded-card bg-surface p-card text-center shadow-[var(--elevation-1)]">
        <p className="flex items-center justify-center gap-1.5 text-xs font-medium tracking-wide text-muted uppercase">
          <Sparkles className="size-3.5" />
          Today
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">
          Start your first set
        </h1>
        <p className="mt-2 text-muted">Create a set or load ready-made sample sets to begin.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button asChild>
            <Link to="/create">Create a set</Link>
          </Button>
          <Button variant="outline" onClick={onLoadSamples}>
            Load samples
          </Button>
        </div>
      </div>
    );
  }

  if (today.kind === "items") {
    const { due, weak, newLeft } = today;

    // Nothing due or new, only weak words: the weak-words round, as before.
    if (due === 0 && newLeft === 0) {
      return (
        <Link
          to="/review"
          search={{ filter: "weak" as const }}
          className="block rounded-card bg-surface p-card shadow-[var(--elevation-1)] transition-shadow hover:shadow-[var(--elevation-2)]"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted uppercase">
                <AlertTriangle className="size-3.5" />
                Today
              </p>
              <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">
                {weak} word{weak === 1 ? "" : "s"} need another look
              </h1>
              <p className="mt-1 text-sm text-muted">
                Nothing due right now — these keep slipping.
              </p>
            </div>
            <span className="inline-flex h-11 shrink-0 items-center justify-center rounded-control bg-primary px-5 text-sm font-medium text-primary-fg">
              Practice weak words
            </span>
          </div>
        </Link>
      );
    }

    return (
      <Link
        to="/review"
        className="block rounded-card bg-primary p-card text-primary-fg shadow-[var(--elevation-raised)] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:bg-primary-hover active:bg-primary-hover"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-primary-fg/70 uppercase">
              <Sparkles className="size-3.5" />
              Today
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">
              {due > 0
                ? `${due} word${due === 1 ? "" : "s"} waiting`
                : `${newLeft} new word${newLeft === 1 ? "" : "s"} ready`}
            </h1>
            <p className="mt-1 text-sm text-primary-fg/80">{today.line}</p>
          </div>
          <span className="inline-flex h-11 shrink-0 items-center justify-center rounded-control bg-primary-fg px-5 text-sm font-medium text-primary">
            Start review
          </span>
        </div>
      </Link>
    );
  }

  // Nothing owed today — but never "finished": unstudied cards may remain
  // beyond today's goal, so the way into a set stays open.
  return (
    <div className="rounded-card bg-surface p-card shadow-[var(--elevation-1)]">
      <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted uppercase">
        <Check className="size-3.5 text-success" />
        Today
      </p>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">Nothing due.</h1>
      <p className="mt-1 text-sm text-muted">You can still open a set.</p>
      {today.nextLine ? <p className="mt-1 text-sm text-muted">{today.nextLine}</p> : null}
    </div>
  );
}
