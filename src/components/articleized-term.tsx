import { articleParts, type LanguageProfile } from "@/lib/lang/profiles";
import type { CardEnrichment } from "@/lib/types";

/**
 * der/die/das color-coding mnemonic (Phase 3C). Keyed on the article word
 * itself, not gender — there is only one language with articles today, and
 * keying on the word matches how a learner reads it — "der" is always blue.
 */
const ARTICLE_COLOR_CLASS: Record<string, string> = {
  der: "text-article-der",
  die: "text-article-die",
  das: "text-article-das",
};

/**
 * "der Tisch" with the article colored, or the bare term when there's
 * nothing to color — same conditions as `articleizedTerm`, split into JSX so
 * the article can carry its own className. A RENDERING-only component, same
 * rule as `articleizedTerm` itself: never derive `term`, grading input, or
 * anything written back to storage from this.
 */
export function ArticleizedTerm({
  term,
  enrichment,
  profile,
}: {
  term: string;
  enrichment: CardEnrichment | null | undefined;
  profile: LanguageProfile;
}) {
  const { article, rest } = articleParts(term, enrichment, profile);
  if (!article) return <>{rest}</>;
  return (
    <>
      <span className={ARTICLE_COLOR_CLASS[article] ?? ""}>{article}</span> {rest}
    </>
  );
}
