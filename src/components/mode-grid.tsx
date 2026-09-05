import { Link } from "@tanstack/react-router";
import { GraduationCap, Layers, LayoutGrid, ListChecks } from "lucide-react";

const MODES = [
  {
    to: "/sets/$setId/flashcards" as const,
    title: "Flashcards",
    copy: "Flip, star, and go at your own pace.",
    icon: Layers,
  },
  {
    to: "/sets/$setId/learn" as const,
    title: "Learn",
    copy: "Reinforce with multiple-choice and written questions.",
    icon: GraduationCap,
  },
  {
    to: "/sets/$setId/test" as const,
    title: "Test",
    copy: "Quiz yourself with mixed question types.",
    icon: ListChecks,
  },
  {
    to: "/sets/$setId/match" as const,
    title: "Match",
    copy: "Match terms to definitions fast.",
    icon: LayoutGrid,
  },
];

export function ModeGrid({ setId, disabled }: { setId: string; disabled?: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {MODES.map((mode) => {
        const Icon = mode.icon;
        const inner = (
          <>
            <span className="grid size-10 place-items-center rounded-md bg-surface-2 text-primary">
              <Icon className="size-5" />
            </span>
            <span>
              <span className="block font-display text-lg font-medium tracking-tight">
                {mode.title}
              </span>
              <span className="mt-1 block text-sm text-muted">{mode.copy}</span>
            </span>
          </>
        );
        if (disabled) {
          return (
            <div
              key={mode.title}
              className="flex items-start gap-4 rounded-xl bg-surface p-5 opacity-50 shadow-[var(--shadow-border)]"
            >
              {inner}
            </div>
          );
        }
        return (
          <Link
            key={mode.title}
            to={mode.to}
            params={{ setId }}
            className="flex items-start gap-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-smooth-out)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]"
          >
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
