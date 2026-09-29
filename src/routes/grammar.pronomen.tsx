import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildPronomenQuestion } from "@/lib/grammar-drills";
import { numberSample } from "@/lib/german/grammar-drill-sample";

export const Route = createFileRoute("/grammar/pronomen")({
  component: PronomenDrillRoute,
});

/**
 * Set-independent personal-pronoun (Akkusativ/Dativ) drill: fixed table in
 * grammar-drills.ts, same "ignore the sample contents" pattern as
 * Modalverben — see `buildPronomenQuestion`'s doc comment.
 *
 * Deliberately NOT given a `userEntries` prop, same reasoning as
 * Modalverben's own doc comment: ich/du/er/sie/wir/ihr is a closed,
 * fixed set of 7 personal pronouns, already the drill's entire pool, with
 * no card property to match a user's own card against it.
 */
function PronomenDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner<number>
        mode="Pronomen"
        topic="pronomen"
        fetchSample={() => Promise.resolve(numberSample(12))}
        buildRound={(entries) => entries.map(() => buildPronomenQuestion())}
      />
    </AuthGate>
  );
}
