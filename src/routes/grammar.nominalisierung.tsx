import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildNominalisierungQuestion } from "@/lib/grammar-drills";
import { numberSample } from "@/lib/german/grammar-drill-sample";

export const Route = createFileRoute("/grammar/nominalisierung")({
  component: NominalisierungDrillRoute,
});

/**
 * Set-independent Nominalisierung drill: the whole question pool is the
 * fixed ~28-entry verb/adjective → noun table in `grammar-drills.ts` (no
 * fiil→isim türetme field exists in nouns-data.ts — see the task's own
 * pre-decision) — same `numberSample`-just-for-round-size pattern as
 * Modalverben/Pronomen/Steigerung. No `userEntries`: nothing in a `Card`
 * identifies "this is one of these 28 fixed pairs".
 */
function NominalisierungDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner<number>
        mode="Nominalisierung"
        topic="nominalisierung"
        fetchSample={() => Promise.resolve(numberSample(12))}
        buildRound={(entries) => entries.map(() => buildNominalisierungQuestion())}
      />
    </AuthGate>
  );
}
