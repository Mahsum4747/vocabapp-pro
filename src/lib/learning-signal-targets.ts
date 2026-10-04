import {
  hasArticleDrillCards,
  hasCaseDrillCards,
  hasClozeCards,
  hasConjugationCards,
  hasSatzbauCards,
  isGermanSet,
} from "./german/grammar-hub";
import { isStudiableSet } from "./srs/queue";
import { isCardActive, type StudySet } from "./types";
export type SetPracticeMode = "articles" | "cases" | "conjugation" | "satzbau" | "cloze" | "write";
export type SignalPracticeTargets = Partial<Record<SetPracticeMode, string>>;
/** Routing capability, not learner level or a weakness score. No additional reads. */
export function buildSignalPracticeTargets(sets: StudySet[]): SignalPracticeTargets {
  const pool = sets
    .filter(isStudiableSet)
    .map((s) => ({ ...s, cards: s.cards.filter(isCardActive) }))
    .filter((s) => s.cards.length > 0)
    .sort((a, b) => a.id.localeCompare(b.id));
  const targets: SignalPracticeTargets = {};
  const checks = {
    articles: hasArticleDrillCards,
    cases: hasCaseDrillCards,
    conjugation: hasConjugationCards,
    satzbau: hasSatzbauCards,
    cloze: hasClozeCards,
  };
  if (pool[0]) targets.write = pool[0].id;
  for (const [mode, eligible] of Object.entries(checks)) {
    const set = pool.find((s) => isGermanSet(s) && eligible(s));
    if (set) targets[mode as SetPracticeMode] = set.id;
  }
  return targets;
}
