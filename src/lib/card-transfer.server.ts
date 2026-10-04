import type { Firestore, FieldValue } from "firebase-admin/firestore";
import { planCardTransfer } from "./card-identity";
import { freshCardCopy, type CardProgress, type StudySet } from "./types";
import { readSetSession, type SetSession } from "./session-pass";
import { transferSchema } from "./input-schemas";

/** Content, memory and pass references commit together. Firestore removed the
 * old write-count ceiling in 2023; splitting this commit would lose atomicity.
 * Read only the three known current rows per selected ID, in bounded groups.
 * The backend's document/request byte limits still reject an oversized commit
 * atomically. IDs and cardinality are bounded before any reads. */
export async function transferCardDocuments(
  db: Firestore,
  userId: string,
  input: unknown,
  move: boolean,
  deletedField: FieldValue,
  createId: () => string = () => crypto.randomUUID(),
) {
  const data = transferSchema.parse(input);
  const sourceRef = db.collection("study_sets").doc(data.sourceSetId);
  const targetRef = db.collection("study_sets").doc(data.targetSetId);
  const userRef = db.collection("users").doc(userId);
  return db.runTransaction(async (tx) => {
    const [sourceDoc, targetDoc, userDoc] = await tx.getAll(sourceRef, targetRef, userRef);
    if (!sourceDoc.exists || !targetDoc.exists) throw new Error("Set not found.");
    const source = sourceDoc.data() as StudySet;
    const target = targetDoc.data() as StudySet;
    if (
      target.ownerId !== userId ||
      (move ? source.ownerId !== userId : source.ownerId !== userId && !source.isPublic)
    )
      throw new Error("Transfer not permitted.");
    const plan = planCardTransfer(
      source.cards,
      target.cards,
      data.cardIds,
      move,
      createId,
      freshCardCopy,
    );
    const refs = move
      ? data.cardIds.flatMap((id) => [
          userRef.collection("cardProgress").doc(id),
          userRef.collection("articleDrillProgress").doc(id),
          userRef.collection("articleDrillProgress").doc(`${id}:case`),
        ])
      : [];
    const rows = [];
    for (let i = 0; i < refs.length; i += 300)
      rows.push(...(await tx.getAll(...refs.slice(i, i + 300))));
    // All reads precede every write. Never overwrite counters/scheduler fields.
    const movedProgress: CardProgress[] = [];
    const sessions: Record<string, SetSession> = {};
    if (move) {
      const moved = new Set(data.cardIds);
      for (const [setId, cards] of [
        [data.sourceSetId, plan.sourceCards],
        [data.targetSetId, plan.targetCards],
      ] as const) {
        const stored = userDoc.data()?.setSessions?.[setId];
        if (stored) {
          const session = readSetSession(stored);
          const current = new Set(cards.map((c) => c.id));
          sessions[setId] = {
            ...session,
            served: session.served.filter((id) => current.has(id) && !moved.has(id)),
          };
        }
      }
      for (const row of rows) {
        if (!row.exists || row.data()?.setId !== data.sourceSetId) continue;
        tx.update(row.ref, { setId: data.targetSetId });
        if (row.ref.parent.id === "cardProgress")
          movedProgress.push({ ...row.data(), setId: data.targetSetId } as CardProgress);
      }
    }
    const updatedAt = Date.now();
    tx.update(targetRef, { cards: plan.targetCards, updatedAt });
    if (move) tx.update(sourceRef, { cards: plan.sourceCards, updatedAt });
    tx.set(
      userRef,
      {
        todaySummary: deletedField,
        ...(Object.keys(sessions).length ? { setSessions: sessions } : {}),
      },
      { merge: true },
    );
    return { ...plan, source, target, movedProgress, sessions, updatedAt };
  });
}

/** A late request from an old round cannot reinsert moved/deleted IDs. */
export async function saveCurrentSetSession(
  db: Firestore,
  userId: string,
  data: { setId: string; cap: number | null; served: string[] },
) {
  const userRef = db.collection("users").doc(userId);
  const setRef = db.collection("study_sets").doc(data.setId);
  return db.runTransaction(async (tx) => {
    const [setDoc, userDoc] = await tx.getAll(setRef, userRef);
    if (!setDoc.exists) throw new Error("Set not found.");
    const studySet = setDoc.data() as StudySet;
    if (studySet.ownerId !== userId && !studySet.isPublic) throw new Error("Set not accessible.");
    const ids = new Set(studySet.cards.map((card) => card.id));
    const session = {
      cap: data.cap,
      served: [...new Set(data.served)].filter((id) => ids.has(id)),
    };
    const now = Date.now();
    tx.set(
      userRef,
      {
        id: userId,
        setSessions: { [data.setId]: session },
        updatedAt: now,
        ...(!userDoc.exists ? { createdAt: now } : {}),
      },
      { merge: true },
    );
    return { ok: true };
  });
}
