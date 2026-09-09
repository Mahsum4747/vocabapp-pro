import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "./auth/middleware";

/**
 * Delete the caller's Better Auth identity (sessions, linked accounts, the
 * user row) from Postgres.
 *
 * Deliberately its own server function/file, and deliberately talks to `pg`
 * directly rather than through `@/lib/db`'s shared `getSql()`: importing
 * `@/lib/db` from this module — alone or combined with the Firestore
 * (`firebase-admin.server`) access in `deleteUserAccount` — broke Nitro/
 * rolldown's SSR chunk splitting ("Export 'ssr_exports' is not defined in
 * module", the same class of bug already documented in auth-gate.tsx /
 * gates.tsx for better-auth/react). `db.ts`'s own complexity (import.meta.glob
 * migrations, a globalThis-memoized pool/PGLite singleton) is presumably what
 * rolldown's chunking trips on when it gains a new reachable edge; a plain
 * `pg` Pool sidesteps it since `pg` is already part of the server bundle via
 * `auth/server.ts`.
 *
 * Only runs against real Postgres (`DATABASE_URL` set — Vercel always sets
 * it, per CLAUDE.md). In the local/live-preview PGLite fallback (no
 * `DATABASE_URL`) there is no separate server to connect to here, so this
 * is a no-op; the app already treats "no DATABASE_URL" as dev/preview-only.
 */
export const deleteAuthAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.userId;
    const connectionString = process.env.DATABASE_URL?.trim();
    if (!connectionString) {
      // PGLite fallback (no real Postgres to connect to) — Firestore data is
      // still deleted by `deleteUserAccount`; nothing further to do here.
      return { ok: true };
    }

    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString });
    try {
      // `session."userId"` and `account."userId"` both reference `user.id` with
      // ON DELETE CASCADE (migrations/auth/0001_auth.sql) — deleting the user
      // row alone removes their sessions and accounts too.
      await pool.query('DELETE FROM "user" WHERE id = $1', [userId]);
    } finally {
      await pool.end();
    }

    return { ok: true };
  });
