/**
 * The mark is a cycle whose broken segment has been closed — a dependency
 * graph and a heal cycle in the same shape. The restored arc carries the
 * brand green; the rest of the ring rides on currentColor so it inverts
 * with the theme.
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
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeWidth="2.25"
        opacity="0.24"
      />
      <path
        d="M12 3.5A8.5 8.5 0 0 0 3.5 12"
        stroke="var(--accent)"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <circle cx="12" cy="3.5" r="2.4" fill="var(--accent)" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`text-ink inline-flex items-center gap-2.5 ${className}`}>
      <Mark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[17px] font-semibold tracking-[-0.03em]">
          heal
        </span>
        <span className="font-mono text-faint mt-0.5 text-[9px] tracking-[0.14em] uppercase">
          by convalesce
        </span>
      </span>
    </span>
  );
}
