import { cn } from "@/lib/utils";

/**
 * A circular progress indicator.
 *
 * SVG rather than a conic gradient: the ring has to read correctly at 14px on
 * a phone and scale to the account page without the edge stepping, and a
 * stroked circle stays crisp at both.
 */
export function ProgressRing({
  value,
  max,
  size = 56,
  label,
  className,
}: {
  value: number;
  max: number;
  size?: number;
  /** Rendered in the middle of the ring — usually the number itself. */
  label?: string;
  className?: string;
}) {
  const safeMax = max > 0 ? max : 1;
  const fraction = Math.max(0, Math.min(1, value / safeMax));
  const stroke = Math.max(4, Math.round(size / 10));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(fraction * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-surface-2"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
          className="stroke-primary transition-[stroke-dashoffset] duration-300 ease-[var(--ease-smooth-out)]"
        />
      </svg>
      {label ? (
        <span className="absolute inset-0 grid place-items-center text-xs font-medium tabular-nums">
          {label}
        </span>
      ) : null}
    </div>
  );
}
