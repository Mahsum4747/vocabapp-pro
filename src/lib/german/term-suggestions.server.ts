import { EXAMPLES_TSV } from "./examples-data.ts";

/**
 * Server-only prefix search over the bundled examples dataset's lemmas —
 * the "Smart Suggestions" autocomplete source for the card editor's Term
 * field. Same lazy-singleton shape as nouns.server.ts/examples.server.ts,
 * and independent of examples.server.ts's own index: this only ever needs
 * bare lemma strings, none of that module's ambiguity-resolution or
 * per-row parsing.
 *
 * Deliberately sourced from the ~2,885-lemma examples dataset, not the
 * ~102k-entry noun dictionary — see LanguageProfile.hasTermAutocomplete's
 * doc comment (lang/profiles.ts) for why: the noun dictionary has no
 * frequency signal at all, so prefix-matching against it would surface
 * obscure words ahead of common ones with no way to tell the difference.
 * The examples dataset is frequency-*bounded* (built from a top-N
 * frequency list), even though it isn't frequency-*ranked* within itself —
 * results below are alphabetical, not a fabricated ranking.
 */

type Entry = { lemma: string; folded: string };

let index: Entry[] | null = null;

/** Lowercase + strip accents — same per-character fold as cloze.ts, for the
 *  same reason: case/accent-insensitive matching with nothing fancier. */
function fold(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function build(): Entry[] {
  const rows = EXAMPLES_TSV.length > 0 ? EXAMPLES_TSV.split("\n") : [];
  const seen = new Set<string>();
  const entries: Entry[] = [];
  for (const line of rows) {
    const firstTab = line.indexOf("\t");
    if (firstTab < 0) continue;
    const lemma = line.slice(0, firstTab);
    if (!lemma || seen.has(lemma)) continue;
    seen.add(lemma);
    entries.push({ lemma, folded: fold(lemma) });
  }
  entries.sort((a, b) => a.lemma.localeCompare(b.lemma, "de"));
  return entries;
}

function idx(): Entry[] {
  index ??= build();
  return index;
}

const DEFAULT_LIMIT = 8;

/**
 * Every bundled lemma starting with `prefix`, case/accent-insensitive,
 * alphabetical, capped at `limit`. `[]` for an empty or all-whitespace
 * prefix — never "every lemma", which a mistakenly-empty call would
 * otherwise return.
 */
export function suggestTerms(prefix: string, limit = DEFAULT_LIMIT): string[] {
  const key = fold(prefix.trim());
  if (!key) return [];
  const out: string[] = [];
  for (const entry of idx()) {
    if (entry.folded.startsWith(key)) {
      out.push(entry.lemma);
      if (out.length >= limit) break;
    }
  }
  return out;
}

/** Unique lemmas in the loaded index. Forces the build; used by tests. */
export function termSuggestionDatasetSize(): number {
  return idx().length;
}
