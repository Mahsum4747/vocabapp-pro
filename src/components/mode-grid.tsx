import { Link } from "@tanstack/react-router";
import { GraduationCap, Layers, LayoutGrid, ListChecks } from "lucide-react";
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

export function ModeGrid({ setId, disabled }: { setId: string; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {MODES.map((mode) => {
        const Icon = mode.icon;
        const className = cn(
          "flex min-w-28 flex-1 items-center justify-center gap-2 rounded-xl bg-surface px-4 py-3 text-sm font-medium shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-smooth-out)]",
          disabled ? "opacity-50" : "hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]",
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
        return (
          <Link key={mode.title} to={mode.to} params={{ setId }} className={className}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
