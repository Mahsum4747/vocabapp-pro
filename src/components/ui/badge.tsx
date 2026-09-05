import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "muted",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "muted" | "primary" | "success" | "danger" | "accent";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "muted" && "bg-surface-2 text-muted",
        tone === "primary" && "bg-primary text-primary-fg",
        tone === "success" && "bg-success-soft text-success",
        tone === "danger" && "bg-danger-soft text-danger",
        tone === "accent" && "bg-slate text-primary-fg",
        className,
      )}
      {...props}
    />
  );
}
