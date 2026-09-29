import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildPassivQuestion } from "@/lib/grammar-drills";
import { randomVerbSample } from "@/lib/german/verb-conjugation-data";
import type { VerbConjugationEntry } from "@/lib/german/verb-conjugation-data";

export const Route = createFileRoute("/grammar/passiv")({
  component: PassivDrillRoute,
});

/**
 * Set-independent Passiv drill: werden + Partizip II per tense, drawn from
 * verbs in `verb-conjugation-data.ts` that have a `partizipII`
 * (`randomVerbSample` already filters to that).
 */
function PassivDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner<VerbConjugationEntry>
        mode="Passiv"
        topic="passiv"
        fetchSample={() => Promise.resolve(randomVerbSample(12, "any"))}
        buildRound={(entries) => entries.map((entry) => buildPassivQuestion(entry))}
      />
    </AuthGate>
  );
}
