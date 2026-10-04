import { useId } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, ListChecks, PenLine, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import type { StudyRecommendation } from "@/lib/adaptive-recommendations";
import {
  recommendationCta,
  recommendationReason,
  recommendationTitle,
} from "@/lib/primary-recommendation";
export function RecommendedNextCard({
  recommendation: r,
}: {
  recommendation: StudyRecommendation;
}) {
  const id = useId();
  const Icon =
    r.domain === "reading"
      ? BookOpen
      : r.domain === "writing"
        ? PenLine
        : r.domain === "grammar"
          ? ListChecks
          : RotateCcw;
  return (
    <section
      aria-labelledby={id}
      data-testid="recommended-next"
      className="mt-section rounded-card bg-primary-soft p-card text-fg shadow-[var(--elevation-1)]"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-primary-ink uppercase">
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            Recommended next
          </p>
          <h2
            id={id}
            className="mt-2 font-display text-2xl font-medium tracking-tight break-words text-balance"
          >
            {recommendationTitle(r)}
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-6 break-words text-pretty text-muted">
            {recommendationReason(r)}
          </p>
        </div>
        <Button
          asChild
          className="h-auto min-h-11 w-full shrink-0 py-3 whitespace-normal sm:w-auto"
        >
          <Link to={r.route} aria-describedby={id}>
            {recommendationCta(r)}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
export function RecommendedNextLoading() {
  return (
    <section
      role="status"
      aria-label="Loading recommendation"
      className="mt-section min-h-skeleton-cta rounded-card bg-surface p-card shadow-[var(--elevation-1)]"
    >
      <p className="text-xs font-medium tracking-wide text-primary-ink uppercase">
        Recommended next
      </p>
      <div aria-hidden="true" className="mt-3 space-y-3 motion-safe:animate-pulse">
        <div className="h-6 w-2/3 rounded-control bg-surface-2" />
        <div className="h-4 w-1/2 rounded-control bg-surface-2" />
      </div>
      <span className="sr-only">Loading recommendation</span>
    </section>
  );
}
