import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildImperativQuestion } from "@/lib/grammar-drills";
import { randomVerbSample } from "@/lib/german/verb-conjugation-data";
import { userVerbEligibleCards } from "@/lib/german/grammar-hub";
import { useStudyStore } from "@/lib/store";
import type { VerbConjugationEntry } from "@/lib/german/verb-conjugation-data";

export const Route = createFileRoute("/grammar/imperativ")({
  component: ImperativDrillRoute,
});

/**
 * Imperativ drill: the user's own German cards whose term
 * `lookupVerbConjugation` recognizes (`userVerbEligibleCards`, "any") are
 * prioritized; non-separable verbs from `verb-conjugation-data.ts`
 * (`randomVerbSample(count, "any")` already excludes separable-prefix
 * verbs — see that function's doc comment) fill the rest, since
 * separable-prefix repositioning in the imperative is out of scope for
 * either source.
 */
function ImperativDrillRoute() {
  const sets = useStudyStore((s) => s.sets);
  const userEntries = useMemo(() => userVerbEligibleCards(sets, "any"), [sets]);
  return (
    <AuthGate>
      <GrammarDrillRunner<VerbConjugationEntry>
        mode="Imperativ"
        topic="imperativ"
        userEntries={userEntries}
        fetchSample={() => Promise.resolve(randomVerbSample(12, "any"))}
        buildRound={(entries) => entries.map((entry) => buildImperativQuestion(entry))}
      />
    </AuthGate>
  );
}
