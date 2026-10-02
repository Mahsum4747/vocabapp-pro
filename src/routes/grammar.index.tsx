import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Combine,
  Feather,
  Grid3x3,
  Hash,
  Headphones,
  HelpCircle,
  Link2,
  MessageSquareQuote,
  Megaphone,
  PencilLine,
  ListOrdered,
  MinusCircle,
  Quote,
  Repeat,
  Scissors,
  Shuffle,
  SpellCheck,
  SquareDashed,
  Sparkles,
  TrendingUp,
  Type,
  UserCircle,
  Users,
  Wand2,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
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
import { getGrammarProgress, type GrammarProgressDoc } from "@/lib/grammar-progress";
import { useProgress, useStudyStore } from "@/lib/store";
import type { StudySet } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/grammar/")({
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
  | "possessive"
  | "trennbare-verben"
  | "modalverben"
  | "imperativ"
  | "pronomen"
  | "adjektivendungen"
  | "steigerung"
  | "passiv"
  | "konjunktiv"
  | "relativsaetze"
  | "diktat"
  | "lesen"
  | "partizipial"
  | "nominalisierung"
  | "funktionsverbgefuege"
  | "modalpartikeln"
  | "konjunktiv1"
  | "subjektive-modalverben"
  | "passiversatzformen"
  | "paste";

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
    standaloneTo?:
      | "/grammar/plural"
      | "/grammar/nicht-kein"
      | "/grammar/possessive"
      | "/grammar/trennbare-verben"
      | "/grammar/modalverben"
      | "/grammar/imperativ"
      | "/grammar/pronomen"
      | "/grammar/adjektivendungen"
      | "/grammar/steigerung"
      | "/grammar/passiv"
      | "/grammar/konjunktiv"
      | "/grammar/relativsaetze"
      | "/grammar/diktat"
      | "/grammar/lesen"
      | "/grammar/partizipial"
      | "/grammar/nominalisierung"
      | "/grammar/funktionsverbgefuege"
      | "/grammar/modalpartikeln"
      | "/grammar/konjunktiv1"
      | "/grammar/subjektive-modalverben"
      | "/grammar/passiversatzformen"
      | "/grammar/paste";
    /** For a mode whose destination is a real route but has no content
     *  yet — renders the card dimmed with a "Coming soon" label instead of
     *  pretending there's a real drill to jump into. Unused today (Lesen,
     *  the one mode that used this, now has real content — see
     *  grammar.lesen.tsx), kept for the next such skeleton. */
    comingSoon?: boolean;
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
    title: "Cases & Pronouns",
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
      {
        id: "possessive",
        title: "mein / dein / sein",
        description: "Possessive adjective endings",
        icon: UserCircle,
        standaloneTo: "/grammar/possessive",
        eligible: alwaysEligible,
        progressKind: "none",
      },
      {
        id: "pronomen",
        title: "Pronomen",
        description: "mich/mir, dich/dir... Akkusativ or Dativ",
        icon: Users,
        standaloneTo: "/grammar/pronomen",
        eligible: alwaysEligible,
        progressKind: "none",
      },
      {
        id: "adjektivendungen",
        title: "Adjektivendungen",
        description: "der große Hund — the right -e/-en ending",
        icon: Type,
        standaloneTo: "/grammar/adjektivendungen",
        eligible: alwaysEligible,
        progressKind: "none",
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
      {
        id: "trennbare-verben",
        title: "Trennbare Verben",
        description: "anrufen → Ich rufe dich an.",
        icon: Scissors,
        standaloneTo: "/grammar/trennbare-verben",
        eligible: alwaysEligible,
        progressKind: "none",
      },
      {
        id: "modalverben",
        title: "Modalverben",
        description: "können, müssen, dürfen...",
        icon: Wrench,
        standaloneTo: "/grammar/modalverben",
        eligible: alwaysEligible,
        progressKind: "none",
      },
      {
        id: "imperativ",
        title: "Imperativ",
        description: "Komm! Kommt! Kommen Sie!",
        icon: Megaphone,
        standaloneTo: "/grammar/imperativ",
        eligible: alwaysEligible,
        progressKind: "none",
      },
      {
        id: "passiv",
        title: "Passiv",
        description: "werden + Partizip II",
        icon: ArrowLeftRight,
        standaloneTo: "/grammar/passiv",
        eligible: alwaysEligible,
        progressKind: "none",
      },
      {
        id: "konjunktiv",
        title: "Konjunktiv II",
        description: "hätte, wäre, würde + Infinitiv",
        icon: Wand2,
        standaloneTo: "/grammar/konjunktiv",
        eligible: alwaysEligible,
        progressKind: "none",
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
      {
        id: "steigerung",
        title: "Steigerung",
        description: "klein → kleiner → am kleinsten",
        icon: TrendingUp,
        standaloneTo: "/grammar/steigerung",
        eligible: alwaysEligible,
        progressKind: "none",
      },
      {
        id: "relativsaetze",
        title: "Relativsätze",
        description: "der Mann, den ich kenne",
        icon: Link2,
        standaloneTo: "/grammar/relativsaetze",
        eligible: alwaysEligible,
        progressKind: "none",
      },
    ],
  },
  {
    title: "Listening & Reading",
    modes: [
      {
        id: "diktat",
        title: "Diktat",
        description: "Listen and type what you heard",
        icon: Headphones,
        standaloneTo: "/grammar/diktat",
        eligible: alwaysEligible,
        progressKind: "none",
      },
      {
        id: "lesen",
        title: "Lesen",
        description: "Short reading passages with comprehension questions",
        icon: BookOpen,
        standaloneTo: "/grammar/lesen",
        eligible: alwaysEligible,
        progressKind: "none",
      },
    ],
  },
  {
    title: "B2/C1",
    modes: [
      {
        id: "partizipial",
        title: "Partizipialkonstruktionen",
        description: "der lesende Mann — Partizip als Relativsatz-Ersatz",
        icon: Combine,
        standaloneTo: "/grammar/partizipial",
        eligible: alwaysEligible,
        progressKind: "none",
      },
      {
        id: "nominalisierung",
        title: "Nominalisierung",
        description: "entscheiden → die Entscheidung",
        icon: Sparkles,
        standaloneTo: "/grammar/nominalisierung",
        eligible: alwaysEligible,
        progressKind: "none",
      },
      {
        id: "funktionsverbgefuege",
        title: "Funktionsverbgefüge",
        description: "Rücksicht nehmen (= berücksichtigen)",
        icon: Feather,
        standaloneTo: "/grammar/funktionsverbgefuege",
        eligible: alwaysEligible,
        progressKind: "none",
      },
      {
        id: "modalpartikeln",
        title: "Modalpartikeln",
        description: "doch, mal, ja, eben, halt...",
        icon: MessageSquareQuote,
        standaloneTo: "/grammar/modalpartikeln",
        eligible: alwaysEligible,
        progressKind: "none",
      },
      {
        id: "konjunktiv1",
        title: "Konjunktiv I",
        description: "Er sagt, er komme morgen. (indirekte Rede)",
        icon: Quote,
        standaloneTo: "/grammar/konjunktiv1",
        eligible: alwaysEligible,
        progressKind: "none",
      },
      {
        id: "subjektive-modalverben",
        title: "Subjektive Modalverben",
        description: "Er muss zu Hause sein. (Vermutung)",
        icon: HelpCircle,
        standaloneTo: "/grammar/subjektive-modalverben",
        eligible: alwaysEligible,
        progressKind: "none",
      },
      {
        id: "passiversatzformen",
        title: "Passiversatzformen",
        description: "Das lässt sich machen. / Das ist zu machen.",
        icon: Shuffle,
        standaloneTo: "/grammar/passiversatzformen",
        eligible: alwaysEligible,
        progressKind: "none",
      },
    ],
  },
  {
    title: "Your Own Topic",
    modes: [
      {
        id: "paste",
        title: "Practice your own topic",
        description: "Any grammar topic — AI-generated, not reviewed by Karta",
        icon: PencilLine,
        standaloneTo: "/grammar/paste",
        eligible: alwaysEligible,
        progressKind: "none",
      },
    ],
  },
];

/**
 * CEFR level labels — purely informational/sorting, never a gate: every
 * mode stays clickable regardless of level (see CATEGORIES' own doc comment
 * on "no lock/gamification"). A mode with no entry here (Lesen — coming
 * soon, not leveled yet; Paste — free-topic, no fixed level applies) shows
 * no badge and sorts to the end of its category.
 */
type CefrLevel = "A1.1" | "A1.2" | "A2.1" | "A2.2" | "B1.1" | "B1.2" | "B2" | "B2/C1";

const CEFR_LEVEL: Partial<Record<ModeId, CefrLevel>> = {
  articles: "A1.1",
  plural: "A1.1",
  pronomen: "A1.1",
  possessive: "A1.1",
  "nicht-kein": "A1.1",
  cases: "A1.2",
  conjugation: "A1.2",
  modalverben: "A1.2",
  "trennbare-verben": "A1.2",
  imperativ: "A1.2",
  adjektivendungen: "A2.1",
  steigerung: "A2.1",
  satzbau: "A2.1",
  cloze: "A2.2",
  diktat: "A2.2",
  passiv: "B1.1",
  relativsaetze: "B1.1",
  konjunktiv: "B1.2",
  partizipial: "B2",
  nominalisierung: "B2",
  funktionsverbgefuege: "B2",
  modalpartikeln: "B2",
  konjunktiv1: "B2/C1",
  "subjektive-modalverben": "B2/C1",
  passiversatzformen: "B2/C1",
};

const CEFR_ORDER: CefrLevel[] = ["A1.1", "A1.2", "A2.1", "A2.2", "B1.1", "B1.2", "B2", "B2/C1"];

function cefrRank(modeId: ModeId): number {
  const level = CEFR_LEVEL[modeId];
  return level ? CEFR_ORDER.indexOf(level) : CEFR_ORDER.length;
}

/** Small muted-pill level tag, e.g. "A1.1" — next to a mode's title. */
function CefrBadge({ modeId }: { modeId: ModeId }) {
  const level = CEFR_LEVEL[modeId];
  if (!level) return null;
  return (
    <span className="shrink-0 rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-subtle tabular-nums">
      {level}
    </span>
  );
}

/** The one ModeId whose grammarProgress topicId differs from its own id —
 *  "partizipial" writes under the same topic string its `GrammarDrillRunner`
 *  `topic` prop already uses, "partizipialkonstruktionen" (see
 *  grammar.partizipial.tsx). Every other mode's topicId equals its ModeId. */
const TOPIC_ID_OVERRIDE: Partial<Record<ModeId, string>> = {
  partizipial: "partizipialkonstruktionen",
};

/** "72% (12 questions)" — or null when the topic has never been practiced
 *  (no line shown, same as a mode with no misses yet shows no fake 0%). */
function grammarAccuracyLine(modeId: ModeId, grammarProgress: GrammarProgressDoc): string | null {
  const topicId = TOPIC_ID_OVERRIDE[modeId] ?? modeId;
  const entry = grammarProgress[topicId];
  if (!entry) return null;
  return `Grammar accuracy: ${entry.accuracy}% (${entry.totalAttempts} q)`;
}

function GrammarPage() {
  const sets = useStudyStore((s) => s.sets);
  const isLoaded = useStudyStore((s) => s.isLoaded);
  const fetchSets = useStudyStore((s) => s.fetchSets);
  const fetchAllProgress = useStudyStore((s) => s.fetchAllProgress);
  const progress = useProgress();
  const [expanded, setExpanded] = useState<ModeId | null>(null);
  const [grammarProgress, setGrammarProgress] = useState<GrammarProgressDoc>({});

  useEffect(() => {
    fetchSets();
    fetchAllProgress();
    // Topic-level grammar mastery (grammarProgress/{uid}) — entirely
    // separate from the FSRS-backed `progress` above, purely additive to
    // the hub's existing missCount/masteryPercent lines (see
    // `grammarAccuracyLine` below). A failed fetch just leaves the tiles
    // without an accuracy line, same as a topic never practiced yet.
    getGrammarProgress()
      .then(setGrammarProgress)
      .catch(() => {});
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

  // No early return for an empty germanSets: the set-independent drills
  // (Plural, nicht/kein, mein/dein/sein, Trennbare Verben, ...) draw from
  // nouns-data.ts/verb-conjugation-data.ts, never a set's own cards, so
  // they must stay usable with zero German sets. Each set-dependent tile
  // already renders its own "No eligible cards yet" dimmed state below
  // when `eligibleSets` is empty — that's the only "no sets" messaging
  // needed, scoped per tile instead of hiding the whole page.
  return (
    <AppShell>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">Grammar practice</h1>
          <p className="mt-2 text-muted">
            The same five drills from each set's own mode grid, grouped by what they practice.
          </p>
        </div>
        <Link
          to="/grammar/rules"
          className="tap-target inline-flex items-center gap-1.5 rounded-control bg-surface-2 px-3 py-2 text-sm font-medium text-fg shadow-[var(--elevation-1)] transition-colors hover:bg-surface-3"
        >
          <BookOpen className="size-4" />
          Browse all rules
        </Link>
      </div>

      <div className="mt-section space-y-section">
        {CATEGORIES.map((category) => (
          <div key={category.title}>
            <h2 className="text-sm font-medium tracking-wide text-muted uppercase">
              {category.title}
            </h2>
            <div className="mt-3 grid gap-gutter sm:grid-cols-2">
              {[...category.modes].sort((a, b) => cefrRank(a.id) - cefrRank(b.id)).map((mode) => {
                const Icon = mode.icon;

                // The three set-independent drills: always go straight to
                // the fixed route, no set picker, no "N eligible sets" —
                // their noun pool is the whole nouns-data.ts dictionary, not
                // any set's cards (alwaysEligible's doc comment).
                if (mode.standaloneTo) {
                  const accuracyLine = grammarAccuracyLine(mode.id, grammarProgress);
                  return (
                    <Link
                      key={mode.id}
                      to={mode.standaloneTo}
                      className={cn(
                        "flex items-center gap-3 rounded-card bg-surface p-card shadow-[var(--elevation-1)] transition-shadow hover:shadow-[var(--elevation-2)]",
                        mode.comingSoon && "opacity-50",
                      )}
                    >
                      <Icon className="size-5 shrink-0 text-primary-ink" />
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 font-medium">
                          {mode.title}
                          <CefrBadge modeId={mode.id} />
                        </p>
                        <p className="text-sm text-muted">{mode.description}</p>
                        {mode.comingSoon ? (
                          <p className="mt-1 text-xs text-subtle">Coming soon</p>
                        ) : accuracyLine ? (
                          <p className="mt-1 text-xs text-subtle tabular-nums">{accuracyLine}</p>
                        ) : null}
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
                        <p className="flex items-center gap-1.5 font-medium">
                          {mode.title}
                          <CefrBadge modeId={mode.id} />
                        </p>
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
                const accuracyLine = grammarAccuracyLine(mode.id, grammarProgress);

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
                        <p className="flex items-center gap-1.5 font-medium">
                          {mode.title}
                          <CefrBadge modeId={mode.id} />
                        </p>
                        <p className="text-sm text-muted">{mode.description}</p>
                        <p className="mt-1 text-xs text-subtle tabular-nums">
                          {progressLine}
                          {accuracyLine ? ` · ${accuracyLine}` : ""}
                        </p>
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
                        <p className="flex items-center gap-1.5 font-medium">
                          {mode.title}
                          <CefrBadge modeId={mode.id} />
                        </p>
                        <p className="text-sm text-muted">{mode.description}</p>
                        <p className="mt-1 text-xs text-subtle tabular-nums">
                          {progressLine} · {eligibleSets.length} sets
                          {accuracyLine ? ` · ${accuracyLine}` : ""}
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
