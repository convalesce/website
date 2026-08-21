import type { ReactNode } from "react";

/**
 * The contiguous hairline grid: one top rail, one left rail, and every cell
 * closes its own right and bottom. Shared lines, no floating cards. Sections
 * compose this rather than re-deriving the borders and the breakpoint ladder.
 */
const ladder = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function Grid({
  cols = 3,
  className = "",
  children,
}: {
  cols?: keyof typeof ladder;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`border-line grid border-t border-l ${ladder[cols]} ${className}`}>
      {children}
    </div>
  );
}

export function Cell({
  tone,
  className = "",
  children,
}: {
  /** "brand" puts the cell on the matte green with the ink scale re-derived */
  tone?: "brand";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`border-line border-r border-b p-6 lg:p-8 ${
        tone === "brand" ? "on-brand" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
