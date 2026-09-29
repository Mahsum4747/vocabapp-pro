import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildSteigerungQuestion } from "@/lib/grammar-drills";
import { numberSample } from "@/lib/german/grammar-drill-sample";

export const Route = createFileRoute("/grammar/steigerung")({
  component: SteigerungDrillRoute,
});

/**
 * Set-independent comparison drill: fixed adjective list in
 * grammar-drills.ts (regular + the four named irregulars), same
 * "ignore the sample contents" pattern as Modalverben/Pronomen.
 *
 * Deliberately NOT given a `userEntries` prop, same reasoning as
 * Modalverben's own doc comment: a small fixed adjective list is already
 * the drill's entire pool, and no card property identifies "this card is
 * one of these comparison adjectives" to match a user's own card against.
 */
function SteigerungDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner<number>
        mode="Steigerung"
        topic="steigerung"
        fetchSample={() => Promise.resolve(numberSample(12))}
        buildRound={(entries) => entries.map(() => buildSteigerungQuestion())}
      />
    </AuthGate>
  );
}
