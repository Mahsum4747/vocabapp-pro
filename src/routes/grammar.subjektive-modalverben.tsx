import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildSubjektiveModalverbenQuestion } from "@/lib/grammar-drills";
import { numberSample } from "@/lib/german/grammar-drill-sample";

export const Route = createFileRoute("/grammar/subjektive-modalverben")({
  component: SubjektiveModalverbenDrillRoute,
});

/**
 * Subjektive Modalverben drill: the whole question pool is now the fixed
 * scenario/verb templates in `grammar-drills.ts` (context and main verb are
 * bound together per template, never drawn independently from the general
 * verb pool — see `buildSubjektiveModalverbenQuestion`'s own doc comment),
 * so this uses `numberSample` purely to size the round, same pattern as
 * Modalverben/Pronomen/Steigerung. No `userEntries` — there is no card
 * property that identifies "this card fits one of these scenarios".
 */
function SubjektiveModalverbenDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner<number>
        mode="Subjektive Modalverben"
        topic="subjektive-modalverben"
        fetchSample={() => Promise.resolve(numberSample(12))}
        buildRound={(entries) => entries.map(() => buildSubjektiveModalverbenQuestion())}
      />
    </AuthGate>
  );
}
