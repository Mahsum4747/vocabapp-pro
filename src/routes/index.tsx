import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, ChevronDown, ChevronRight, Plus, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { EmptyState } from "@/components/empty-state";
import { SetCard } from "@/components/set-card";
import { PublicSetCard } from "@/components/public-set-card";
import { StreakIndicator } from "@/components/streak-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SUBJECTS } from "@/lib/types";
import { masteryStats } from "@/lib/quiz";
import { isStudiableSet, summarizeLibrary, weakCards } from "@/lib/srs";
import { ReviewCallout, ReviewCounts } from "@/components/review-status";
import { DailyGoalCard, WeakWordsCard, XpCard } from "@/components/goal-and-xp";
import { useProgress, useStudyStore } from "@/lib/store";
import { cn } from "@/lib/utils";

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
  const streak = useStudyStore((s) => s.streak);
  const restoreSeeds = useStudyStore((s) => s.restoreSeeds);
  const fetchSets = useStudyStore((s) => s.fetchSets);
  const fetchPublicSets = useStudyStore((s) => s.fetchPublicSets);
  const fetchStreak = useStudyStore((s) => s.fetchStreak);
  const fetchAllProgress = useStudyStore((s) => s.fetchAllProgress);
  const fetchProfile = useStudyStore((s) => s.fetchProfile);
  const progress = useProgress();

  useEffect(() => {
    fetchSets();
    fetchPublicSets();
    fetchStreak();
    // One query for the whole library, so every set card can show real
    // mastery without a request per set.
    fetchAllProgress();
    // Goal, XP and today's counters — one call, shared by both cards below.
    fetchProfile();
  }, [fetchSets, fetchPublicSets, fetchStreak, fetchAllProgress, fetchProfile]);
  const { view: viewParam } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<string>("All");
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());
  // Defaults to "public" — this page is reachable signed out, and Public
  // Sets is the only tab that works without an account (see AuthGate below).
  const [view, setView] = useState<"mine" | "public">(viewParam ?? "public");

  // The mobile bottom nav's "My Library" tab navigates here with ?view=mine;
  // pick that up even when this component is already mounted (a client-side
  // navigation doesn't remount, so the useState initializer above only runs once).
  useEffect(() => {
    if (viewParam) setView(viewParam);
  }, [viewParam]);

  // `sets` only ever holds the current user's own sets (getMySets/getSetById
  // are ownership-scoped), so excluding those ids from `publicSets` is the
  // same as excluding "my own public sets" — without pulling the auth client
  // into this route's bundle.
  const otherPublicSets = useMemo(() => {
    const ownIds = new Set(sets.map((s) => s.id));
    return publicSets.filter((set) => !ownIds.has(set.id));
  }, [publicSets, sets]);

  /**
   * What the whole library owes, and which set to open first.
   *
   * Derived from the progress map this page already loads for the mastery
   * bars — no extra query, and no counter of its own that could drift from
   * what a session actually serves.
   */
  const reviewNow = useMemo(
    () => summarizeLibrary(sets, progress, { now: Date.now() }),
    [sets, progress],
  );

  const continueSet = useMemo(() => {
    return [...sets]
      .filter((s) => s.lastStudiedAt)
      .sort((a, b) => (b.lastStudiedAt ?? 0) - (a.lastStudiedAt ?? 0))[0];
  }, [sets]);

  /**
   * How many cards are giving this learner trouble.
   *
   * Derived from the progress map this page already loads for the mastery
   * bars — no extra query — and from the same `isWeakWord` the weak-words
   * session filters on, so the number on the card is the number of cards the
   * round will serve.
   */
  const weakCount = useMemo(() => {
    const now = Date.now();
    return sets
      .filter(isStudiableSet)
      .reduce((total, set) => total + weakCards(set.cards, progress, { now }).length, 0);
  }, [sets, progress]);

  const continueMastery = useMemo(
    () => masteryStats(continueSet?.cards ?? [], progress),
    [continueSet, progress],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sets.filter((set) => {
      if (subject !== "All" && set.subject !== subject) return false;
      if (!q) return true;
      return (
        set.title.toLowerCase().includes(q) ||
        set.description.toLowerCase().includes(q) ||
        set.subject.toLowerCase().includes(q) ||
        set.cards.some(
          (card) =>
            card.term.toLowerCase().includes(q) || card.definition.toLowerCase().includes(q),
        )
      );
    });
  }, [sets, query, subject]);

  const subjects = ["All", ...SUBJECTS.filter((name) => sets.some((s) => s.subject === name))];

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

  return (
    <AppShell>
      <section className="stagger-in">
        <p className="text-sm font-medium text-muted">Personal library</p>
        <h1 className="mt-2 max-w-xl font-display text-4xl font-medium tracking-tight md:text-5xl">
          What will you study today?
        </h1>
        <p className="mt-3 max-w-lg text-muted">
          Flip cards, learn, test, and match. Your sets sync across all your devices.
        </p>
        {streak ? (
          <div className="mt-4">
            <StreakIndicator days={streak.currentStreak} />
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/create">
              <Plus />
              New set
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/create" search={{ ai: true }}>
              <Sparkles />
              Generate from topic
            </Link>
          </Button>
        </div>
      </section>

      {/* Reviews come first when any are waiting: the engine already knows
          what is due, and this is the way in.

          Two shapes, never both. When cards are actually due, the library-wide
          Review session is the entry point. When nothing is due but a set has
          new cards, there is nothing to review — so the per-set callout offers
          to start learning instead. */}
      {reviewNow.totals.due > 0 ? (
        <Link
          to="/review"
          className="mt-8 flex flex-col justify-between gap-4 rounded-2xl bg-surface p-6 shadow-[var(--shadow-border)] transition-shadow hover:shadow-[var(--shadow-border-hover)] sm:flex-row sm:items-center"
        >
          <div className="min-w-0">
            <p
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase",
                reviewNow.totals.overdue > 0 ? "text-danger" : "text-muted",
              )}
            >
              {reviewNow.totals.overdue > 0 ? (
                <AlertCircle className="size-3.5" />
              ) : (
                <Sparkles className="size-3.5" />
              )}
              Review
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight">
              {reviewNow.totals.due} card{reviewNow.totals.due === 1 ? "" : "s"} due
            </h2>
            <ReviewCounts summary={reviewNow.totals} className="mt-1 text-muted" />
          </div>
          <span className="inline-flex h-11 shrink-0 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg">
            Start review
          </span>
        </Link>
      ) : reviewNow.target ? (
        <ReviewCallout
          setId={reviewNow.target.set.id}
          summary={reviewNow.totals}
          title={reviewNow.target.set.title}
          className="mt-8"
        />
      ) : null}

      {/* Goal first, then XP: one is today's commitment, the other is the
          long game. Both hide themselves when there is nothing to show. */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <DailyGoalCard />
        <XpCard />
        <WeakWordsCard count={weakCount} />
      </div>

      {continueSet ? (
        <Link
          to="/sets/$setId"
          params={{ setId: continueSet.id }}
          className="mt-10 flex flex-col justify-between gap-4 rounded-2xl bg-primary p-6 text-primary-fg shadow-[var(--shadow-card)] md:flex-row md:items-end"
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
              {continueMastery.notStarted > 0 ? ` · ${continueMastery.notStarted} not started` : ""}
            </p>
          </div>
          <span className="inline-flex h-11 items-center rounded-md bg-primary-fg px-4 text-sm font-medium text-primary">
            Continue
          </span>
        </Link>
      ) : null}

      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <button type="button" onClick={() => setView("mine")}>
            <Badge tone={view === "mine" ? "primary" : "muted"}>My Library</Badge>
          </button>
          <button type="button" onClick={() => setView("public")}>
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
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {subjects.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSubject(name)}
                  className="shrink-0"
                >
                  <Badge tone={subject === name ? "primary" : "muted"}>{name}</Badge>
                </button>
              ))}
            </div>

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
              <div className="mt-6 space-y-6">
                {folderGroups.map((group) => {
                  const collapsed = collapsedFolders.has(group.name);
                  return (
                    <div key={group.name}>
                      <button
                        type="button"
                        onClick={() => toggleFolder(group.name)}
                        className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-fg"
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
                        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {group.sets.map((set) => (
                            <SetCard key={set.id} set={set} />
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
          <EmptyState title="No public sets" description="No one has shared a set yet." />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {otherPublicSets.map((set) => (
            <PublicSetCard key={set.id} set={set} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
