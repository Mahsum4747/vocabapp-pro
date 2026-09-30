import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildModalpartikelQuestion } from "@/lib/grammar-drills";
import { numberSample } from "@/lib/german/grammar-drill-sample";

export const Route = createFileRoute("/grammar/modalpartikeln")({
  component: ModalpartikelnDrillRoute,
});

/**
 * Set-independent Modalpartikeln drill: the whole question pool is the
 * fixed sentence/particle table in `grammar-drills.ts` — same
 * `numberSample`-just-for-round-size pattern as Modalverben. No
 * `userEntries`: nothing on a `Card` identifies "this uses this particle".
 */
function ModalpartikelnDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner<number>
        mode="Modalpartikeln"
        topic="modalpartikeln"
        fetchSample={() => Promise.resolve(numberSample(12))}
        buildRound={(entries) => entries.map(() => buildModalpartikelQuestion())}
      />
    </AuthGate>
  );
}
