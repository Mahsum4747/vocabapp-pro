import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "./auth/middleware";
import type { LearningSignals } from "./learning-signals";

/** No input/validator: caller cannot select another user's identity or date. */
export const getLearningSignals = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<LearningSignals> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const { readSignalsForSession } = await import("./learning-signals.server");
    const { getSessionUser } = await import("./auth/verify.server");
    const session = await getSessionUser(context.bearerToken);
    if (!session || session.id !== context.userId) {
      const { UnauthorizedError } = await import("./auth/verify.server");
      throw new UnauthorizedError();
    }
    return readSignalsForSession(getAdminFirestore(), context.userId, session, Date.now());
  });
