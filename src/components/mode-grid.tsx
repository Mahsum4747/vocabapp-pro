import { Link } from "@tanstack/react-router";
import { GraduationCap, Layers, LayoutGrid, ListChecks, SpellCheck, TextCursorInput } from "lucide-react";
import { cn } from "@/lib/utils";

const MODES = [
  {
    to: "/sets/$setId/flashcards" as const,
    title: "Flashcards",
    icon: Layers,
  },
  {
    to: "/sets/$setId/learn" as const,
    title: "Learn",
    icon: GraduationCap,
  },
  {
    to: "/sets/$setId/test" as const,
    title: "Test",
    icon: ListChecks,
  },
  {
    to: "/sets/$setId/match" as const,
    title: "Match",
    icon: LayoutGrid,
  },
];

const ARTICLE_DRILL_MODE = {
  to: "/sets/$setId/articles" as const,
  title: "Articles",
  icon: SpellCheck,
};

const CLOZE_MODE = {
  to: "/sets/$setId/cloze" as const,
  title: "Cloze",
  icon: TextCursorInput,
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
}: {
  setId: string;
  /** Restrict the study session to just this Leitner box (0..MASTERY_MAX). */
  box?: number;
  disabled?: boolean;
  showArticleDrill?: boolean;
  showCloze?: boolean;
}) {
  const modes = [
    ...MODES,
    ...(showCloze ? [CLOZE_MODE] : []),
    ...(showArticleDrill ? [ARTICLE_DRILL_MODE] : []),
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const className = cn(
          "flex min-w-28 flex-1 items-center justify-center gap-2 rounded-xl bg-surface px-4 py-3 text-sm font-medium shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-smooth-out)]",
          disabled
            ? "opacity-50"
            : "hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]",
        );
        const inner = (
          <>
            <Icon className="size-4 text-primary" />
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
