import type { Firestore } from "firebase-admin/firestore";
import { userDocumentPaths } from "./user-data-inventory";

/** Missing documents/subtrees are harmless; a failed recursive delete is
 * propagated so the login identity remains available for an explicit retry. */
export async function deleteLearningData(db: Firestore, userId: string): Promise<void> {
  const paths = userDocumentPaths(userId);
  const sets = await db.collection("study_sets").where("ownerId", "==", userId).get();
  for (const doc of sets.docs) await db.recursiveDelete(doc.ref);
  for (const path of paths) await db.recursiveDelete(db.doc(path));
}

/** Enforce cleanup ordering on the server, even if the final endpoint is called
 * directly. This is deliberately not a cross-database transaction. */
export async function deleteLearningThenIdentity(
  db: Firestore,
  userId: string,
  deleteIdentity: () => Promise<void>,
) {
  await deleteLearningData(db, userId);
  await deleteIdentity();
  return { ok: true };
}
