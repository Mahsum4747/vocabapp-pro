import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../auth/middleware";
import { courseScopeSchema, progressCommandSchema } from "./course-progress";

export const getCourseProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => courseScopeSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { readCourseProgress, requireCourseAuthentication } =
      await import("./course-progress.server");
    await requireCourseAuthentication();
    const { getAdminFirestore } = await import("../firebase-admin.server");
    const { readChallengeClearances } = await import("./challenge.server");
    const db = getAdminFirestore();
    const [progress, challengeClearances] = await Promise.all([
      readCourseProgress(db, context.userId, data),
      readChallengeClearances(db, context.userId, data),
    ]);
    return { ...progress, challengeClearances };
  });
export const acknowledgeCourseProgress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => progressCommandSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { saveCourseProgress, requireCourseAuthentication } =
      await import("./course-progress.server");
    await requireCourseAuthentication();
    const { getAdminFirestore } = await import("../firebase-admin.server");
    return saveCourseProgress(getAdminFirestore(), context.userId, data);
  });
