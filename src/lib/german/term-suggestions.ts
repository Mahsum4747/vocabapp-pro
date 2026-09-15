import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";

/**
 * Client-callable prefix search for the Term field's autocomplete dropdown —
 * shaped exactly like bundled-suggestions.ts: a thin server-fn wrapper
 * around a free, already-computed lookup, no AI call, no quota to protect.
 *
 * Deliberately has NO server-side language/profile gate, same reasoning as
 * lookupBundledSuggestions: this is a local prefix scan with nothing to
 * protect. The client-side `hasTermAutocomplete` check is what decides
 * whether the UI ever calls this at all.
 */

const inputSchema = z.object({ prefix: z.string().max(80) });

export const suggestTermPrefix = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<string[]> => {
    const { suggestTerms } = await import("./term-suggestions.server");
    return suggestTerms(data.prefix);
  });
