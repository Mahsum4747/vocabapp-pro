import type { CardProgress, StudySet } from "./types.ts";

/**
 * Progress rows whose card is provably gone, judged against the owner's sets as
 * they are right now.
 *
 * A row is an orphan when either:
 *   - its `setId` is one of the owner's sets, and that set no longer has a card
 *     with this row's id (card removed, or a term edit that minted a new id); or
 *   - its `setId` is not the owner's, and that set no longer exists at all
 *     (a set deleted before row cleanup existed).
 *
 * Rows for someone else's set that still exists are NEVER orphans — a learner
 * studies other people's public sets and keeps progress on them. Archived and
 * excluded cards are still cards of their set, so they are kept: those states
 * are reversible.
 *
 * `existingForeignSetIds` is the subset of the row set-ids outside the owner's
 * library that the caller confirmed still exist; anything not in it is treated
 * as deleted, so the caller must only ask about ids it actually looked up.
 */
export function findOrphanProgressIds(input: {
  ownerSets: StudySet[];
  rows: Record<string, Pick<CardProgress, "setId">>;
  existingForeignSetIds: ReadonlySet<string>;
}): string[] {
  const cardsBySet = new Map(
    input.ownerSets.map((set) => [set.id, new Set(set.cards.map((card) => card.id))]),
  );
  const orphans: string[] = [];
  for (const [cardId, row] of Object.entries(input.rows)) {
    const cards = cardsBySet.get(row.setId);
    if (cards) {
      if (!cards.has(cardId)) orphans.push(cardId);
    } else if (!input.existingForeignSetIds.has(row.setId)) {
      orphans.push(cardId);
    }
  }
  return orphans;
}

/** Set ids referenced by progress rows that aren't the owner's — the ones worth an existence check. */
export function foreignSetIds(
  ownerSets: StudySet[],
  rows: Record<string, Pick<CardProgress, "setId">>,
): string[] {
  const own = new Set(ownerSets.map((set) => set.id));
  return [...new Set(Object.values(rows).map((row) => row.setId))].filter(
    (id) => typeof id === "string" && id && !own.has(id),
  );
}
