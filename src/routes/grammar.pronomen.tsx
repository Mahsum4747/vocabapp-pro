import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildPronomenQuestion } from "@/lib/grammar-drills";
import { reviewedValencyQuestions } from "@/lib/german/reviewed-valency-practice";
import { sourceValencyPronounQuestions } from "@/lib/german/valency-practice";
import { shuffle } from "@/lib/utils";
import { numberSample } from "@/lib/german/grammar-drill-sample";

export const Route = createFileRoute("/grammar/pronomen")({
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    verb?: string;
    practice?: "reviewed";
    kind?: "personal_pronoun_case" | "determiner_case";
  } => ({
    practice: search.practice === "reviewed" ? "reviewed" : undefined,
    kind: search.kind === "determiner_case" ? "determiner_case" : "personal_pronoun_case",
    verb:
      typeof search.verb === "string" ? search.verb.trim().toLocaleLowerCase("de-DE") : undefined,
  }),
  component: PronomenDrillRoute,
});

/**
 * Personal-pronoun practice combines the existing pronoun table with already
 * accepted, sense-scoped source examples. A reference link can focus one verb.
 *
 * Deliberately NOT given a `userEntries` prop, same reasoning as
 * Modalverben's own doc comment: ich/du/er/sie/wir/ihr is a closed,
 * fixed set of 7 personal pronouns, already the drill's entire pool, with
 * no card property to match a user's own card against it.
 */
function PronomenDrillRoute() {
  const { verb, practice, kind } = Route.useSearch();
  return (
    <AuthGate>
      <GrammarDrillRunner<number>
        key={`${verb ?? "all"}|${practice ?? "original"}|${kind}`}
        mode={
          practice === "reviewed"
            ? kind === "determiner_case"
              ? "Verb patterns · Articles"
              : "Verb patterns · Pronouns"
            : "Pronomen"
        }
        trackProgress={practice !== "reviewed"}
        topic={practice === "reviewed" && kind === "determiner_case" ? undefined : "pronomen"}
        fetchSample={() => Promise.resolve(numberSample(12))}
        buildRound={(entries) => {
          if (practice === "reviewed")
            return shuffle(reviewedValencyQuestions(verb, kind)).map((question) => ({
              ...question,
              options: shuffle(question.options),
            }));
          const contextual = shuffle(sourceValencyPronounQuestions(verb)).map((question) => ({
            ...question,
            options: shuffle(question.options),
          }));
          if (verb && contextual.length) return contextual;
          return shuffle([
            ...contextual.slice(0, 6),
            ...entries.slice(0, 6).map(() => buildPronomenQuestion()),
          ]);
        }}
      />
    </AuthGate>
  );
}
