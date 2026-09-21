import type { ButtonHTMLAttributes, ReactNode } from "react";
import { StudyChrome } from "./study-chrome";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

/**
 * The single full-width action button every study mode ends its screen with
 * ("Check" before an answer is graded, "Continue"/"Next card" after). One
 * component so the seven modes render identical markup instead of each
 * hand-rolling its own `<Button className="mt-6 w-full">`.
 */
export type StudyPrimaryAction = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className?: string;
};

/**
 * Shared study-session shell: `StudyChrome`'s top bar + progress bar, the
 * mode-specific content in the middle, and (optionally) the one full-width
 * primary action button at the bottom that every mode uses to advance.
 *
 * This does not itself touch grading, FSRS, or Firestore writes — it is pure
 * layout, built on top of the existing `StudyChrome`. Modes that don't have a
 * single bottom action (Flashcards' four FSRS ratings, Match's tile grid,
 * the "round over" screens) simply omit `primaryAction` and keep their own
 * footer content as `children`.
 */
export function StudySessionShell({
  setId,
  title,
  mode,
  index,
  total,
  filterLabel,
  headerRight,
  primaryAction,
  children,
}: {
  setId?: string;
  title: string;
  mode: string;
  index: number;
  total: number;
  filterLabel?: string;
  headerRight?: ReactNode;
  primaryAction?: StudyPrimaryAction;
  children: ReactNode;
}) {
  return (
    <StudyChrome
      setId={setId}
      title={title}
      mode={mode}
      index={index}
      total={total}
      filterLabel={filterLabel}
      headerRight={headerRight}
    >
      {children}
      {primaryAction ? (
        <Button
          type={primaryAction.type ?? "button"}
          className={cn("mt-6 w-full", primaryAction.className)}
          disabled={primaryAction.disabled}
          onClick={primaryAction.onClick}
        >
          {primaryAction.label}
        </Button>
      ) : null}
    </StudyChrome>
  );
}
