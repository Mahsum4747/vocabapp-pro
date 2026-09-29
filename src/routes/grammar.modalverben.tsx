import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildModalverbenQuestion } from "@/lib/grammar-drills";
import { numberSample } from "@/lib/german/grammar-drill-sample";

export const Route = createFileRoute("/grammar/modalverben")({
  component: ModalverbenDrillRoute,
});

/**
 * Set-independent modal-verb drill: the whole question pool is the fixed
 * 6-modal × 3-person table in `grammar-drills.ts` (können/müssen/dürfen/
 * wollen/sollen/möchten × ich/du/er) — no noun/verb dataset involved, so
 * this uses `numberSample` purely to size the round, and ignores its
 * contents (see `buildModalverbenQuestion`'s own doc comment).
 *
 * Deliberately NOT given a `userEntries` prop (unlike Plural/nicht-kein/
 * .../Trennbare Verben/Imperativ/Passiv/Konjunktiv): there is no card
 * property that identifies "this card is a modal verb" — können/müssen/
 * dürfen/wollen/sollen/möchten is a closed, fixed set of 6, already the
 * drill's entire pool, and a user's own vocabulary card has no field to
 * match against it.
 */
function ModalverbenDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner<number>
        mode="Modalverben"
        topic="modalverben"
        fetchSample={() => Promise.resolve(numberSample(12))}
        buildRound={(entries) => entries.map(() => buildModalverbenQuestion())}
      />
    </AuthGate>
  );
}
