import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildKonjunktivEinsQuestion } from "@/lib/grammar-drills";
import { numberSample } from "@/lib/german/grammar-drill-sample";

export const Route = createFileRoute("/grammar/konjunktiv1")({
  component: KonjunktivEinsDrillRoute,
});

/**
 * Konjunktiv I (indirekte Rede) drill — a USAGE drill (reported speech),
 * deliberately separate from `/grammar/konjunktiv`'s FORM drill (würde vs.
 * synthetic Konjunktiv II). The whole question pool is now the fixed
 * scenario/verb templates in `grammar-drills.ts` (context sentence and
 * injected verb are bound together per template, never drawn independently
 * from the general verb pool — see `buildKonjunktivEinsQuestion`'s own doc
 * comment, the same fix already applied to Subjektive Modalverben), so
 * this uses `numberSample` purely to size the round, same pattern as
 * Modalverben/Pronomen/Subjektive Modalverben. No `userEntries`: there is
 * no card property that identifies "this card fits one of these 7
 * scenarios".
 */
function KonjunktivEinsDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner<number>
        mode="Konjunktiv I"
        topic="konjunktiv1"
        fetchSample={() => Promise.resolve(numberSample(12))}
        buildRound={(entries) => entries.map(() => buildKonjunktivEinsQuestion())}
      />
    </AuthGate>
  );
}
