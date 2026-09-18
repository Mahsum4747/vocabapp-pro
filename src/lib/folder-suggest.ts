/**
 * Suggests an existing folder for a new set from its title — a plain word-
 * overlap match, no AI call. A folder qualifies when every one of its words
 * appears as a substring somewhere in the title (case-insensitive), e.g.
 * folder "German A1" matches title "CEFR A1 German Verbs" (both "german"
 * and "a1" are present, in either order). Among qualifying folders, the one
 * with the most words wins — a more specific folder name beats a shorter,
 * looser one. Ties keep the first folder in `folders`' own order.
 *
 * Returns `undefined` when nothing matches — this never invents a new
 * folder name, only picks among the ones the caller already has.
 */
export function suggestFolder(title: string, folders: string[]): string | undefined {
  const haystack = title.trim().toLowerCase();
  if (!haystack) return undefined;

  let best: string | undefined;
  let bestScore = 0;
  for (const folder of folders) {
    const words = folder
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    if (words.length === 0) continue;
    if (!words.every((word) => haystack.includes(word))) continue;
    if (words.length > bestScore) {
      best = folder;
      bestScore = words.length;
    }
  }
  return best;
}
