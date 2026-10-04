import { userDocumentPaths } from "./user-data-inventory";
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "./auth/middleware";

/**
 * Delete all of the caller's Firestore data: study sets, cards, per-card
 * progress, reviews, daily stats, grammar/Lesen progress, streak, Paste
 * histories/receipts, drill data, settings and feedback (canonical inventory).
 *
 * The Better Auth (Postgres) side lives in `deleteAuthAccount`
 * (delete-auth-account.ts) — a separate server function on purpose, see that
 * file's docstring for why combining the two broke SSR bundling. The caller
 * (account.tsx) invokes both, then signs out.
 */
export const deleteUserAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.userId;

    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();

    // Delete every study set this user owns (public sets included — a
    // deleted owner leaves nothing to keep public around; see study-sets.ts's
    // `deleteSet` for the same top-level `study_sets` + `ownerId` shape).
    const setsSnapshot = await db.collection("study_sets").where("ownerId", "==", userId).get();
    for (const doc of setsSnapshot.docs) await db.recursiveDelete(doc.ref);

    // `cardProgress`, `reviewEvents` and `dailyStats` are subcollections under
    // `users/{uid}` (see getAllProgress/resetSetProgress/getDailyStatsRange in
    // study-sets.ts), not top-level collections — recursiveDelete removes the
    // profile document and all of them in one pass.
    for (const path of userDocumentPaths(userId)) {
      await db.recursiveDelete(db.doc(path));
    }

    return { ok: true };
  });
