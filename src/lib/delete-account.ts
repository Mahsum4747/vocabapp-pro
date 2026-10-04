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

    const { deleteLearningData } = await import("./account-deletion.server");
    await deleteLearningData(db, userId);

    return { ok: true };
  });
