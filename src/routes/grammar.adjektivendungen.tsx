import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildAdjektivendungenQuestion } from "@/lib/grammar-drills";
import type { NounEntry } from "@/lib/german/types";

export const Route = createFileRoute("/grammar/adjektivendungen")({
  component: AdjektivendungenDrillRoute,
});

/**
 * Set-independent adjective-ending drill: noun sample from the whole
 * dictionary (`fetchRandomNounSample`, same as Plural/nicht-kein/
 * possessive) + a fixed small adjective list (nouns-data.ts has no
 * adjective column — see grammar-drills.ts's `ADJECTIVES`).
 */
function AdjektivendungenDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner
        mode="Adjektivendungen"
        topic="adjektivendungen"
        buildRound={(entries: NounEntry[]) => entries.map((entry) => buildAdjektivendungenQuestion(entry))}
      />
    </AuthGate>
  );
}
