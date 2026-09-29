import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildTrennbareVerbenQuestion } from "@/lib/grammar-drills";
import { randomVerbSample } from "@/lib/german/verb-conjugation-data";
import { userVerbEligibleCards } from "@/lib/german/grammar-hub";
import { useStudyStore } from "@/lib/store";
import type { VerbConjugationEntry } from "@/lib/german/verb-conjugation-data";

export const Route = createFileRoute("/grammar/trennbare-verben")({
  component: TrennbareVerbenDrillRoute,
});

/**
 * Separable-verb drill: the user's own German cards whose term
 * `lookupVerbConjugation` recognizes as separable (`userVerbEligibleCards`,
 * "separable") are prioritized — the REAL conjugation of the user's own
 * verb, not a synthetic one. The whole `verb-conjugation-data.ts` table,
 * restricted the same way (`separablePrefixOf`), fills the rest. Already
 * client-bundled data (used directly by grammar-hub.ts), so this samples
 * in-process with no server round-trip — unlike the noun-based drills'
 * `fetchRandomNounSample`.
 */
function TrennbareVerbenDrillRoute() {
  const sets = useStudyStore((s) => s.sets);
  const userEntries = useMemo(() => userVerbEligibleCards(sets, "separable"), [sets]);
  return (
    <AuthGate>
      <GrammarDrillRunner<VerbConjugationEntry>
        mode="Trennbare Verben"
        topic="trennbare-verben"
        userEntries={userEntries}
        fetchSample={() => Promise.resolve(randomVerbSample(12, "separable"))}
        buildRound={(entries) => entries.map((entry) => buildTrennbareVerbenQuestion(entry))}
      />
    </AuthGate>
  );
}
