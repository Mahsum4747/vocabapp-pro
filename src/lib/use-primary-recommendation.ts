import { useEffect, useState } from "react";
import { loadPrimaryRecommendation } from "./primary-recommendation";
import { logOperationFailure } from "./diagnostics";
import type { StudyRecommendation } from "./adaptive-recommendations";
export type PrimaryRecommendationState =
  | { status: "loading" }
  | { status: "ready"; primary: StudyRecommendation | null }
  | { status: "error" };
type Snapshot = { owner: string; version: number; state: PrimaryRecommendationState };
export function usePrimaryRecommendation(
  owner: string | null,
  version: number,
): PrimaryRecommendationState {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  useEffect(() => {
    if (!owner) return;
    let current = true;
    setSnapshot({ owner, version, state: { status: "loading" } });
    loadPrimaryRecommendation(async () => {
      const { getLearningSignals } = await import("./get-learning-signals");
      return getLearningSignals();
    })
      .then((primary) => {
        if (current) setSnapshot({ owner, version, state: { status: "ready", primary } });
      })
      .catch((error) => {
        if (!current) return;
        logOperationFailure("home.recommendation.load", error);
        setSnapshot({ owner, version, state: { status: "error" } });
      });
    return () => {
      current = false;
    };
  }, [owner, version]);
  // Never expose another account's result or the previous refresh's recommendation.
  return snapshot?.owner === owner && snapshot.version === version
    ? snapshot.state
    : { status: "loading" };
}
