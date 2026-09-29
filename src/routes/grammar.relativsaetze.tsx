import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildRelativsatzQuestion } from "@/lib/grammar-drills";
import type { NounEntry } from "@/lib/german/types";

export const Route = createFileRoute("/grammar/relativsaetze")({
  component: RelativsaetzeDrillRoute,
});

/**
 * Set-independent relative-clause drill: noun sample from the whole
 * dictionary (`fetchRandomNounSample`) + case-appropriate relative
 * pronoun, identical to the definite-article table per the task's rule.
 */
function RelativsaetzeDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner
        mode="Relativsätze"
        topic="relativsaetze"
        buildRound={(entries: NounEntry[]) => entries.map((entry) => buildRelativsatzQuestion(entry))}
      />
    </AuthGate>
  );
}
