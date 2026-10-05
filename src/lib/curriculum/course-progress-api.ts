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
    return readCourseProgress(getAdminFirestore(), context.userId, data);
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
