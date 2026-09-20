import type { InputHTMLAttributes, Ref, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ref,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-control bg-surface px-3 text-base text-fg shadow-[var(--elevation-1)] outline-none transition-[box-shadow] duration-[var(--duration-fast)] placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring/30 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-control bg-surface px-3 text-base text-fg shadow-[var(--elevation-1)] outline-none transition-[box-shadow] duration-[var(--duration-fast)] focus-visible:ring-2 focus-visible:ring-ring/30 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ref,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: Ref<HTMLTextAreaElement> }) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-24 w-full rounded-control bg-surface px-3 py-3 text-base text-fg shadow-[var(--elevation-1)] outline-none transition-[box-shadow] duration-[var(--duration-fast)] placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring/30 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}
