import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildRelativsatzQuestion } from "@/lib/grammar-drills";
import { userNounEligibleCards } from "@/lib/german/grammar-hub";
import { useStudyStore } from "@/lib/store";
import type { NounEntry } from "@/lib/german/types";

export const Route = createFileRoute("/grammar/relativsaetze")({
  component: RelativsaetzeDrillRoute,
});

/**
 * Relative-clause drill: the user's own German cards with a known gender
 * (`userNounEligibleCards`) are prioritized; the whole dictionary
 * (`fetchRandomNounSample`) fills the rest, each paired with the
 * case-appropriate relative pronoun, identical to the definite-article
 * table per the task's rule.
 */
function RelativsaetzeDrillRoute() {
  const sets = useStudyStore((s) => s.sets);
  const userEntries = useMemo(() => userNounEligibleCards(sets), [sets]);
  return (
    <AuthGate>
      <GrammarDrillRunner
        mode="Relativsätze"
        topic="relativsaetze"
        userEntries={userEntries}
        buildRound={(entries: NounEntry[]) => entries.map((entry) => buildRelativsatzQuestion(entry))}
      />
    </AuthGate>
  );
}
