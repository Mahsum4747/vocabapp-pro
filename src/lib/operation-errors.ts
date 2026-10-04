import { logOperationFailure } from "./diagnostics";
import { toast } from "sonner";
/** Never log exception messages/payloads: they can contain learner text or tokens. */
export function reportOperationFailure(operation: string, error: unknown, message: string): void {
  logOperationFailure(operation, error);
  toast.error(message);
}
