import { markPaths } from "@/lib/mark";

const { c, closure } = markPaths(8.5);

/**
 * A C with its opening closed in brand green. The C rides on currentColor so
 * it inverts with the theme; the closure is always the accent, because it is
 * the part that carries the meaning.
 */
export function Mark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d={c}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d={closure}
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`text-ink inline-flex items-center gap-2.5 ${className}`}>
      <Mark />
      <span className="font-display text-h3 tracking-[-0.03em] leading-none">
        convalesce
      </span>
    </span>
  );
}
