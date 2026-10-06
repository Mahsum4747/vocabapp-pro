import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../auth/middleware";
import { challengeScopeSchema, challengeStartSchema, challengeSubmitSchema } from "./challenge";
export const getUnitChallenge = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => challengeScopeSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { requireCourseAuthentication } = await import("./course-progress.server");
    await requireCourseAuthentication();
    const { getAdminFirestore } = await import("../firebase-admin.server");
    const { readUnitChallenge } = await import("./challenge.server");
    return readUnitChallenge(getAdminFirestore(), context.userId, data);
  });
export const startUnitChallenge = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => challengeStartSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { requireCourseAuthentication } = await import("./course-progress.server");
    await requireCourseAuthentication();
    const { getAdminFirestore } = await import("../firebase-admin.server");
    const { startChallenge } = await import("./challenge.server");
    return startChallenge(getAdminFirestore(), context.userId, data);
  });
export const finishUnitChallenge = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => challengeSubmitSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { requireCourseAuthentication } = await import("./course-progress.server");
    await requireCourseAuthentication();
    const { getAdminFirestore } = await import("../firebase-admin.server");
    const { submitChallenge } = await import("./challenge.server");
    return submitChallenge(getAdminFirestore(), context.userId, data);
  });
