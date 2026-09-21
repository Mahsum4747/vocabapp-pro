import { Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Layers,
  LayoutGrid,
  ListChecks,
  ListOrdered,
  SpellCheck,
  SquareDashed,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Icon color per mode — text-primary is the pre-existing default. The other
// three core modes get the app's other mutually-distinct-in-both-color-schemes
// tokens (checked with oklab distance, not eyeballed: --color-danger sits too
// close to --color-warning in light mode and to --color-streak in dark mode
// to use safely alongside them, so it's left out of this set entirely rather
// than risking two tiles reading as the same color). Cloze/Satzbau/Articles
// stay on the default green — a 5th or 6th hue that's actually distinct from
// all of these doesn't exist in the current palette without inventing a new
// raw color, so they lean on their own icon shape for distinction instead.
const MODES = [
  {
    to: "/sets/$setId/flashcards" as const,
    title: "Flashcards",
    icon: Layers,
    iconColor: "text-primary-ink",
  },
  {
    to: "/sets/$setId/learn" as const,
    title: "Learn",
    icon: GraduationCap,
    iconColor: "text-slate",
  },
  {
    to: "/sets/$setId/test" as const,
    title: "Test",
    icon: ListChecks,
    iconColor: "text-warning",
  },
  {
    to: "/sets/$setId/match" as const,
    title: "Match",
    icon: LayoutGrid,
    iconColor: "text-streak",
  },
];

const ARTICLE_DRILL_MODE = {
  to: "/sets/$setId/articles" as const,
  title: "Articles",
  icon: SpellCheck,
  iconColor: "text-primary-ink",
};

// SquareDashed (an empty blank) reads more clearly as "fill this in" than the
// previous TextCursorInput, which looked identical in spirit to Learn's/
// Test's own text-entry moments.
const CLOZE_MODE = {
  to: "/sets/$setId/cloze" as const,
  title: "Cloze",
  icon: SquareDashed,
  iconColor: "text-primary-ink",
};

// ListOrdered (a numbered sequence) reads as "put these in order" more
// directly than Shuffle, which reads as randomizing rather than the deliberate
// word-order the mode actually asks for.
const SATZBAU_MODE = {
  to: "/sets/$setId/satzbau" as const,
  title: "Satzbau",
  icon: ListOrdered,
  iconColor: "text-primary-ink",
};

export function ModeGrid({
  setId,
  box,
  disabled,
  /** Show the der/die/das drill tile — only when the set has at least one
   *  German card with a known gender (Phase 3C Part B). Never shown
   *  otherwise: no color, no drill entry for a set that can't use it. */
  showArticleDrill = false,
  /** Show the cloze (fill-in-the-blank) tile — only when the set has at
   *  least one card whose own example sentence can be blanked. Unlike the
   *  article drill, cloze grades through the real FSRS/CardProgress path,
   *  so it stays in the normal box-filtered mode list, not split out. */
  showCloze = false,
  /** Show the Satzbau (word-order) tile — only when the set has at least
   *  one card whose own example sentence is in the 4-12 word range this
   *  mode is scoped to. Same real-FSRS treatment as Cloze, for the same
   *  reason: it exercises the card's own content, not an isolated skill. */
  showSatzbau = false,
}: {
  setId: string;
  /** Restrict the study session to just this Leitner box (0..MASTERY_MAX). */
  box?: number;
  disabled?: boolean;
  showArticleDrill?: boolean;
  showCloze?: boolean;
  showSatzbau?: boolean;
}) {
  const modes = [
    ...MODES,
    ...(showCloze ? [CLOZE_MODE] : []),
    ...(showSatzbau ? [SATZBAU_MODE] : []),
    ...(showArticleDrill ? [ARTICLE_DRILL_MODE] : []),
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const className = cn(
          "flex min-w-28 flex-1 items-center justify-center gap-2 rounded-xl bg-surface px-4 py-3 text-sm font-medium shadow-[var(--elevation-1)] transition-[transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-spring)]",
          disabled
            ? "opacity-50"
            : "hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[var(--elevation-2)]",
        );
        const inner = (
          <>
            <Icon className={cn("size-4", mode.iconColor)} />
            {mode.title}
          </>
        );
        if (disabled) {
          return (
            <div key={mode.title} className={className}>
              {inner}
            </div>
          );
        }
        // The article drill has its own separate card pool (gendered German
        // nouns only) — a Leitner box filter from the other four modes
        // doesn't apply to it.
        if (mode.to === "/sets/$setId/articles") {
          return (
            <Link key={mode.title} to={mode.to} params={{ setId }} className={className}>
              {inner}
            </Link>
          );
        }
        return (
          <Link
            key={mode.title}
            to={mode.to}
            params={{ setId }}
            search={box !== undefined ? { box } : {}}
            className={className}
          >
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
