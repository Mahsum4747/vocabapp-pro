import { createFileRoute } from "@tanstack/react-router";
import { readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

export const Route = createFileRoute("/api/debug-fs")({
  server: {
    handlers: {
      GET: async () => {
        const info: Record<string, unknown> = {};
        info.cwd = process.cwd();
        info.moduleUrl = import.meta.url;
        try {
          const here = dirname(new URL(import.meta.url).pathname);
          info.here = here;
          const candidates = [here, dirname(here), dirname(dirname(here)), dirname(dirname(dirname(here)))];
          info.dirListings = candidates.map((dir) => {
            try {
              return { dir, entries: readdirSync(dir) };
            } catch (e) {
              return { dir, error: String(e) };
            }
          });
          info.nodeModulesChecks = candidates.map((dir) => {
            const nm = join(dir, "node_modules");
            return {
              nm,
              exists: existsSync(nm),
              firebaseAdmin: existsSync(join(nm, "firebase-admin")),
            };
          });
        } catch (e) {
          info.walkError = String(e);
        }
        try {
          const mod = await import("firebase-admin/app");
          info.firebaseAdminImport = "ok";
          info.firebaseAdminKeys = Object.keys(mod);
        } catch (e) {
          info.firebaseAdminImport = "failed";
          info.firebaseAdminError = e instanceof Error ? { message: e.message, stack: e.stack } : String(e);
        }
        return new Response(JSON.stringify(info, null, 2), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
