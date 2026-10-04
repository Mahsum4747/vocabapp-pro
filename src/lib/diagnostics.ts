/** Fixed operation labels only. Never log error messages, payloads, user IDs or tokens. */
export function logOperationFailure(operation: string, error: unknown): void {
  console.error("[karta.operation.failed]", {
    operation,
    kind:
      error instanceof Error &&
      ["Error", "TypeError", "ZodError", "FirebaseError", "UnauthorizedError"].includes(error.name)
        ? error.name
        : "UnknownError",
  });
}
export async function observeOperation<T>(operation: string, action: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error) {
    logOperationFailure(operation, error);
    throw error;
  }
}
