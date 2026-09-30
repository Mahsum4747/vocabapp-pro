import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildFunktionsverbgefuegeQuestion } from "@/lib/grammar-drills";
import { numberSample } from "@/lib/german/grammar-drill-sample";

export const Route = createFileRoute("/grammar/funktionsverbgefuege")({
  component: FunktionsverbgefuegeDrillRoute,
});

/**
 * Set-independent Funktionsverbgefüge drill: the whole question pool is
 * the fixed phrase/simple-verb table in `grammar-drills.ts` — same
 * `numberSample`-just-for-round-size pattern as Modalverben. No
 * `userEntries`: the fixed phrase list has no matching card property.
 */
function FunktionsverbgefuegeDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner<number>
        mode="Funktionsverbgefüge"
        topic="funktionsverbgefuege"
        fetchSample={() => Promise.resolve(numberSample(12))}
        buildRound={(entries) => entries.map(() => buildFunktionsverbgefuegeQuestion())}
      />
    </AuthGate>
  );
}
