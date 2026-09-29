import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildImperativQuestion } from "@/lib/grammar-drills";
import { randomVerbSample } from "@/lib/german/verb-conjugation-data";
import type { VerbConjugationEntry } from "@/lib/german/verb-conjugation-data";

export const Route = createFileRoute("/grammar/imperativ")({
  component: ImperativDrillRoute,
});

/**
 * Set-independent Imperativ drill: non-separable verbs from
 * `verb-conjugation-data.ts` (`randomVerbSample(count, "any")` already
 * excludes separable-prefix verbs — see that function's doc comment),
 * since separable-prefix repositioning in the imperative is out of scope.
 */
function ImperativDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner<VerbConjugationEntry>
        mode="Imperativ"
        topic="imperativ"
        fetchSample={() => Promise.resolve(randomVerbSample(12, "any"))}
        buildRound={(entries) => entries.map((entry) => buildImperativQuestion(entry))}
      />
    </AuthGate>
  );
}
