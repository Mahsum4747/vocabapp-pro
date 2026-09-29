import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildTrennbareVerbenQuestion } from "@/lib/grammar-drills";
import { randomVerbSample } from "@/lib/german/verb-conjugation-data";
import type { VerbConjugationEntry } from "@/lib/german/verb-conjugation-data";

export const Route = createFileRoute("/grammar/trennbare-verben")({
  component: TrennbareVerbenDrillRoute,
});

/**
 * Set-independent separable-verb drill: draws from the whole
 * `verb-conjugation-data.ts` table, restricted to verbs `separablePrefixOf`
 * recognizes as separable (see that function's own heuristic doc comment).
 * Already client-bundled data (used directly by grammar-hub.ts), so this
 * samples in-process with no server round-trip — unlike the noun-based
 * drills' `fetchRandomNounSample`.
 */
function TrennbareVerbenDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner<VerbConjugationEntry>
        mode="Trennbare Verben"
        topic="trennbare-verben"
        fetchSample={() => Promise.resolve(randomVerbSample(12, "separable"))}
        buildRound={(entries) => entries.map((entry) => buildTrennbareVerbenQuestion(entry))}
      />
    </AuthGate>
  );
}
