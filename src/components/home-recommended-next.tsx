import { useState } from "react";
import { usePrimaryRecommendation } from "@/lib/use-primary-recommendation";
import {
  hasSafeRecommendationRoute,
  isKnownStaleRecommendation,
} from "@/lib/primary-recommendation";
import { useStudyStore } from "@/lib/store";
import { Button } from "./ui/button";
import { RecommendedNextCard, RecommendedNextLoading } from "./recommended-next-card";
/** Auth identity is supplied by the existing lazy auth gate. */
export function HomeRecommendedNext({
  refreshVersion,
  owner,
}: {
  refreshVersion: number;
  owner: string | null;
}) {
  const [retry, setRetry] = useState(0);
  const state = usePrimaryRecommendation(owner, refreshVersion + retry);
  const sets = useStudyStore((s) => s.sets);
  const isLoaded = useStudyStore((s) => s.isLoaded);
  if (!owner) return null;
  if (state.status === "loading") return <RecommendedNextLoading />;
  if (state.status === "error")
    return (
      <section
        aria-label="Recommendation unavailable"
        className="mt-section flex flex-wrap items-center justify-between gap-3 rounded-card bg-surface-2 px-card py-3 text-sm text-muted"
      >
        <p>Your next suggestion is unavailable right now.</p>
        <Button variant="ghost" onClick={() => setRetry((n) => n + 1)}>
          Try again
        </Button>
      </section>
    );
  const r = state.primary;
  if (!r || !hasSafeRecommendationRoute(r) || isKnownStaleRecommendation(r, sets, isLoaded))
    return null;
  return <RecommendedNextCard recommendation={r} />;
}
