import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control text-sm font-medium button-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 motion-safe:active:not-disabled:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-fg shadow-[var(--elevation-1)] hover:bg-primary-hover",
        secondary:
          "bg-surface-2 text-fg hover:bg-border",
        outline:
          "bg-surface text-fg shadow-[var(--elevation-1)] hover:shadow-[var(--elevation-2)]",
        ghost: "text-fg hover:bg-surface-2",
        danger: "bg-danger text-primary-fg hover:bg-danger/90",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 px-3 text-sm pointer-coarse:h-11",
        lg: "h-12 px-5",
        icon: "size-11",
        "icon-sm": "size-9 pointer-coarse:size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };
