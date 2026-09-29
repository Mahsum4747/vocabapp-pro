import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Grid3x3,
  Hash,
  ListOrdered,
  MinusCircle,
  Repeat,
  SpellCheck,
  SquareDashed,
  UserCircle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { EmptyState } from "@/components/empty-state";
import {
  alwaysEligible,
  hasArticleDrillCards,
  hasCaseDrillCards,
  hasClozeCards,
  hasConjugationCards,
  hasSatzbauCards,
  isGermanSet,
  masteryPercentForMode,
} from "@/lib/german/grammar-hub";
import { useProgress, useStudyStore } from "@/lib/store";
import type { StudySet } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/grammar")({
  component: GrammarRoute,
});

function GrammarRoute() {
  return (
    <AuthGate>
      <GrammarPage />
    </AuthGate>
  );
}

type ModeId =
  | "articles"
  | "cases"
  | "conjugation"
  | "satzbau"
  | "cloze"
  | "plural"
  | "nicht-kein"
  | "possessive";

/**
 * The five real grammar modes (mode-grid.tsx), grouped the way Lernkartei's
 * "Grammatik" tab groups its own drills, but narrowed to what Karta actually
 * has: no CEFR level picker, no badges/XP, no "pull from my whole
 * vocabulary" — every mode here still runs against a specific set's own
 * cards, same as it always has via ModeGrid. This is an EXTRA entry point
 * into the same five routes, not a replacement for the per-set mode grid.
 * Plus three set-independent drills (plural, nicht/kein, possessive) that
 * run against the whole `nouns-data.ts` dictionary instead of a set.
 *
 * The five real (set-scoped) modes carry a `to` param'd on `$setId` plus an
 * `eligible`/`progressKind` pair; the three set-independent drills below
 * (plural, nicht/kein, possessive) instead carry `standaloneTo` — a fixed
 * route with no `$setId`, since their noun pool (`nouns-data.ts`) always
 * exists and there is no per-set eligibility or FSRS-backed progress to
 * show (see `alwaysEligible`'s doc comment). Exactly one of `to`/`standaloneTo`
 * is set per mode.
 */
const CATEGORIES: {
  title: string;
  modes: {
    id: ModeId;
    title: string;
    description: string;
    icon: typeof SpellCheck;
    to?: "/sets/$setId/articles" | "/sets/$setId/cases" | "/sets/$setId/conjugation" | "/sets/$setId/satzbau" | "/sets/$setId/cloze";
    standaloneTo?: "/grammar/plural" | "/grammar/nicht-kein" | "/grammar/possessive";
    eligible: (set: StudySet) => boolean;
    /** Articles/Cases: `masteryScore` is never written by these two drills
     *  (see CardProgress's own doc comment on articleMissCount/caseMissCount)
     *  — their only real signal is the raw miss counter, so their progress
     *  line reads that instead of a fabricated percent. `none`: the three
     *  standalone drills, which write nothing persistent to show a line for. */
    progressKind: "missCount" | "masteryPercent" | "none";
  }[];
}[] = [
  {
    title: "Basics",
    modes: [
      {
        id: "articles",
        title: "Articles",
        description: "der / die / das drills",
        icon: SpellCheck,
        to: "/sets/$setId/articles",
        eligible: hasArticleDrillCards,
        progressKind: "missCount",
      },
      {
        id: "plural",
        title: "Plural",
        description: "der Tisch → die Tische",
        icon: Hash,
        standaloneTo: "/grammar/plural",
        eligible: alwaysEligible,
        progressKind: "none",
      },
      {
        id: "nicht-kein",
        title: "nicht / kein",
        description: "Negate a sentence correctly",
        icon: MinusCircle,
        standaloneTo: "/grammar/nicht-kein",
        eligible: alwaysEligible,
        progressKind: "none",
      },
    ],
  },
  {
    title: "Pronouns",
    modes: [
      {
        id: "possessive",
        title: "mein / dein / sein",
        description: "Possessive adjective endings",
        icon: UserCircle,
        standaloneTo: "/grammar/possessive",
        eligible: alwaysEligible,
        progressKind: "none",
      },
    ],
  },
  {
    title: "Cases",
    modes: [
      {
        id: "cases",
        title: "Cases",
        description: "Akkusativ / Dativ inflected forms",
        icon: Grid3x3,
        to: "/sets/$setId/cases",
        eligible: hasCaseDrillCards,
        progressKind: "missCount",
      },
    ],
  },
  {
    title: "Verbs",
    modes: [
      {
        id: "conjugation",
        title: "Conjugation",
        description: "Conjugate across persons",
        icon: Repeat,
        to: "/sets/$setId/conjugation",
        eligible: hasConjugationCards,
        progressKind: "masteryPercent",
      },
    ],
  },
  {
    title: "Sentences",
    modes: [
      {
        id: "satzbau",
        title: "Satzbau",
        description: "Put the words in order",
        icon: ListOrdered,
        to: "/sets/$setId/satzbau",
        eligible: hasSatzbauCards,
        progressKind: "masteryPercent",
      },
      {
        id: "cloze",
        title: "Cloze",
        description: "Fill in the blank",
        icon: SquareDashed,
        to: "/sets/$setId/cloze",
        eligible: hasClozeCards,
        progressKind: "masteryPercent",
      },
    ],
  },
];

function GrammarPage() {
  const sets = useStudyStore((s) => s.sets);
  const isLoaded = useStudyStore((s) => s.isLoaded);
  const fetchSets = useStudyStore((s) => s.fetchSets);
  const fetchAllProgress = useStudyStore((s) => s.fetchAllProgress);
  const progress = useProgress();
  const [expanded, setExpanded] = useState<ModeId | null>(null);

  useEffect(() => {
    fetchSets();
    fetchAllProgress();
  }, [fetchSets, fetchAllProgress]);

  // Only German sets participate — the five modes below are German-only
  // (see isGermanSet's own doc comment).
  const germanSets = useMemo(() => sets.filter(isGermanSet), [sets]);

  if (!isLoaded) {
    return (
      <AppShell>
        <div className="h-skeleton-cta animate-pulse rounded-card bg-surface shadow-[var(--elevation-1)]" />
      </AppShell>
    );
  }

  if (germanSets.length === 0) {
    return (
      <AppShell>
        <h1 className="font-display text-3xl font-medium tracking-tight">Grammar practice</h1>
        <div className="mt-6">
          <EmptyState
            title="No German sets yet"
            description="Articles, Cases, Conjugation, Satzbau and Cloze all run on German sets — create or add one first."
            action={
              <Link
                to="/create"
                className="inline-flex h-11 items-center rounded-control bg-primary px-5 text-sm font-medium text-primary-fg"
              >
                Create a set
              </Link>
            }
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-medium tracking-tight">Grammar practice</h1>
      <p className="mt-2 text-muted">
        The same five drills from each set's own mode grid, grouped by what they practice.
      </p>

      <div className="mt-section space-y-section">
        {CATEGORIES.map((category) => (
          <div key={category.title}>
            <h2 className="text-sm font-medium tracking-wide text-muted uppercase">
              {category.title}
            </h2>
            <div className="mt-3 grid gap-gutter sm:grid-cols-2">
              {category.modes.map((mode) => {
                const Icon = mode.icon;

                // The three set-independent drills: always go straight to
                // the fixed route, no set picker, no "N eligible sets" —
                // their noun pool is the whole nouns-data.ts dictionary, not
                // any set's cards (alwaysEligible's doc comment).
                if (mode.standaloneTo) {
                  return (
                    <Link
                      key={mode.id}
                      to={mode.standaloneTo}
                      className="flex items-center gap-3 rounded-card bg-surface p-card shadow-[var(--elevation-1)] transition-shadow hover:shadow-[var(--elevation-2)]"
                    >
                      <Icon className="size-5 shrink-0 text-primary-ink" />
                      <div className="min-w-0">
                        <p className="font-medium">{mode.title}</p>
                        <p className="text-sm text-muted">{mode.description}</p>
                      </div>
                    </Link>
                  );
                }

                const eligibleSets = germanSets.filter(mode.eligible);

                if (eligibleSets.length === 0) {
                  return (
                    <div
                      key={mode.id}
                      className="flex items-center gap-3 rounded-card bg-surface p-card opacity-50 shadow-[var(--elevation-1)]"
                    >
                      <Icon className="size-5 shrink-0 text-primary-ink" />
                      <div className="min-w-0">
                        <p className="font-medium">{mode.title}</p>
                        <p className="text-sm text-muted">{mode.description}</p>
                        <p className="mt-1 text-xs text-subtle">No eligible cards yet</p>
                      </div>
                    </div>
                  );
                }

                const progressLine =
                  mode.progressKind === "missCount"
                    ? missCountLine(mode.id, eligibleSets, progress)
                    : `${masteryPercentForMode(
                        mode.id as "cloze" | "satzbau" | "conjugation",
                        eligibleSets,
                        progress,
                      )}% mastery`;

                if (eligibleSets.length === 1) {
                  return (
                    <Link
                      key={mode.id}
                      to={mode.to!}
                      params={{ setId: eligibleSets[0].id }}
                      className="flex items-center gap-3 rounded-card bg-surface p-card shadow-[var(--elevation-1)] transition-shadow hover:shadow-[var(--elevation-2)]"
                    >
                      <Icon className="size-5 shrink-0 text-primary-ink" />
                      <div className="min-w-0">
                        <p className="font-medium">{mode.title}</p>
                        <p className="text-sm text-muted">{mode.description}</p>
                        <p className="mt-1 text-xs text-subtle tabular-nums">{progressLine}</p>
                      </div>
                    </Link>
                  );
                }

                // Multiple eligible sets: no single "right" set to jump into,
                // so this expands into a plain list of links — reusing the
                // same Link-to-mode pattern as the single-set case above,
                // rather than inventing a picker component.
                const isOpen = expanded === mode.id;
                return (
                  <div
                    key={mode.id}
                    className="rounded-card bg-surface p-card shadow-[var(--elevation-1)]"
                  >
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 text-left"
                      onClick={() => setExpanded(isOpen ? null : mode.id)}
                      aria-expanded={isOpen}
                    >
                      <Icon className="size-5 shrink-0 text-primary-ink" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{mode.title}</p>
                        <p className="text-sm text-muted">{mode.description}</p>
                        <p className="mt-1 text-xs text-subtle tabular-nums">
                          {progressLine} · {eligibleSets.length} sets
                        </p>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="size-4 shrink-0 text-subtle" />
                      ) : (
                        <ChevronRight className="size-4 shrink-0 text-subtle" />
                      )}
                    </button>
                    {isOpen ? (
                      <ul className="mt-3 space-y-1 border-t border-border pt-3">
                        {eligibleSets.map((set) => (
                          <li key={set.id}>
                            <Link
                              to={mode.to!}
                              params={{ setId: set.id }}
                              className={cn(
                                "block rounded-control px-2 py-1.5 text-sm hover:bg-surface-2",
                              )}
                            >
                              {set.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

/**
 * Articles/Cases have no real percent — `masteryScore` is never touched by
 * either drill (see CardProgress's own doc comment) — so their progress
 * line reads the raw miss counter those drills DO write, summed over every
 * eligible set's cards. Lower is better; 0/absent reads as "no misses yet"
 * rather than a fake 0%.
 */
function missCountLine(
  modeId: ModeId,
  sets: StudySet[],
  progress: ReturnType<typeof useProgress>,
): string {
  const field = modeId === "cases" ? "caseMissCount" : "articleMissCount";
  let total = 0;
  for (const set of sets) {
    for (const card of set.cards) {
      total += progress[card.id]?.[field] ?? 0;
    }
  }
  return total === 0 ? "No misses yet" : `${total} miss${total === 1 ? "" : "es"} recorded`;
}
