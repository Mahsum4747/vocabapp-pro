import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildAdjektivendungenQuestion } from "@/lib/grammar-drills";
import { userNounEligibleCards } from "@/lib/german/grammar-hub";
import { useStudyStore } from "@/lib/store";
import type { NounEntry } from "@/lib/german/types";

export const Route = createFileRoute("/grammar/adjektivendungen")({
  component: AdjektivendungenDrillRoute,
});

/**
 * Adjective-ending drill: the user's own German cards with a known gender
 * (`userNounEligibleCards`) are prioritized; the whole dictionary
 * (`fetchRandomNounSample`, same as Plural/nicht-kein/possessive) fills the
 * rest, combined with a fixed small adjective list (nouns-data.ts has no
 * adjective column — see grammar-drills.ts's `ADJECTIVES`).
 */
function AdjektivendungenDrillRoute() {
  const sets = useStudyStore((s) => s.sets);
  const userEntries = useMemo(() => userNounEligibleCards(sets), [sets]);
  return (
    <AuthGate>
      <GrammarDrillRunner
        mode="Adjektivendungen"
        topic="adjektivendungen"
        userEntries={userEntries}
        buildRound={(entries: NounEntry[]) => entries.map((entry) => buildAdjektivendungenQuestion(entry))}
      />
    </AuthGate>
  );
}
