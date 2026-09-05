import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Sparkles } from "lucide-react";
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
import { masteryPercent } from "@/lib/quiz";
import { useStudyStore } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const sets = useStudyStore((s) => s.sets);
  const publicSets = useStudyStore((s) => s.publicSets);
  const streak = useStudyStore((s) => s.streak);
  const restoreSeeds = useStudyStore((s) => s.restoreSeeds);
  const fetchSets = useStudyStore((s) => s.fetchSets);
  const fetchPublicSets = useStudyStore((s) => s.fetchPublicSets);
  const fetchStreak = useStudyStore((s) => s.fetchStreak);

  useEffect(() => {
    fetchSets();
    fetchPublicSets();
    fetchStreak();
  }, [fetchSets, fetchPublicSets, fetchStreak]);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<string>("All");
  // Defaults to "public" — this page is reachable signed out, and Public
  // Sets is the only tab that works without an account (see AuthGate below).
  const [view, setView] = useState<"mine" | "public">("public");

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
              {continueSet.cards.length} cards · {masteryPercent(continueSet.cards)}% progress
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
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((set) => (
                  <SetCard key={set.id} set={set} />
                ))}
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
