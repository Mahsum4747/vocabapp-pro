import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "./auth/middleware";

/**
 * Delete user account and all associated data (Firestore + Neon Postgres).
 *
 * This is irreversible: all study sets, cards, progress records, and the
 * Better Auth user account are deleted. User is signed out and redirected
 * to /login.
 */
export const deleteUserAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.userId;

    // Delete from Firestore
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();

    // Delete all study sets owned by this user
    const setsSnapshot = await db
      .collection("study_sets")
      .where("ownerId", "==", userId)
      .get();
    const deleteSetsBatch = db.batch();
    setsSnapshot.docs.forEach((doc) => {
      deleteSetsBatch.delete(doc.ref);
    });
    if (setsSnapshot.docs.length > 0) {
      await deleteSetsBatch.commit();
    }

    // Delete cardProgress records
    const progressSnapshot = await db
      .collection("cardProgress")
      .where("userId", "==", userId)
      .get();
    const deleteProgressBatch = db.batch();
    progressSnapshot.docs.forEach((doc) => {
      deleteProgressBatch.delete(doc.ref);
    });
    if (progressSnapshot.docs.length > 0) {
      await deleteProgressBatch.commit();
    }

    // Delete reviewEvents records
    const reviewsSnapshot = await db
      .collection("reviewEvents")
      .where("userId", "==", userId)
      .get();
    const deleteReviewsBatch = db.batch();
    reviewsSnapshot.docs.forEach((doc) => {
      deleteReviewsBatch.delete(doc.ref);
    });
    if (reviewsSnapshot.docs.length > 0) {
      await deleteReviewsBatch.commit();
    }

    // Delete dailyStats records (might be in a subcollection under users/{uid})
    // Try deleting the users/{uid} document which may contain nested data
    try {
      const userDocRef = db.collection("users").doc(userId);
      const userDoc = await userDocRef.get();
      if (userDoc.exists) {
        await userDocRef.delete();
      }
    } catch (error) {
      // If users collection doesn't exist, continue
      console.error("Error deleting user document:", error);
    }

    // Also try deleting dailyStats directly if they're a top-level collection
    try {
      const statsSnapshot = await db
        .collection("dailyStats")
        .where("userId", "==", userId)
        .get();
      const deleteStatsBatch = db.batch();
      statsSnapshot.docs.forEach((doc) => {
        deleteStatsBatch.delete(doc.ref);
      });
      if (statsSnapshot.docs.length > 0) {
        await deleteStatsBatch.commit();
      }
    } catch (error) {
      // If dailyStats don't exist as a collection, continue
      console.error("Error deleting daily stats:", error);
    }

    // Delete from Better Auth (Neon Postgres / PGLite)
    try {
      const { getSql } = await import("./db");
      const sql = await getSql();

      // Delete sessions first (foreign key constraint)
      await sql`DELETE FROM "session" WHERE user_id = ${userId}`;

      // Delete accounts
      await sql`DELETE FROM "account" WHERE user_id = ${userId}`;

      // Delete user
      await sql`DELETE FROM "user" WHERE id = ${userId}`;
    } catch (error) {
      console.error("Error deleting Better Auth user:", error);
      throw new Error("Failed to delete account from authentication system.");
    }

    return { ok: true };
  });
