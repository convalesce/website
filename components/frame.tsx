import type { ReactNode } from "react";

/**
 * The page's backbone: every section sits inside a
 * hairline frame inset from the viewport, with mono furniture at its top
 * corners. Sections are delimited by this frame, not by background colour.
 */
export function Section({
  id,
  index,
  label,
  children,
  className = "",
  pad = "default",
}: {
  id?: string;
  /** zero-padded section number shown at the frame's top-left */
  index: string;
  /** section name shown at the frame's top-right */
  label: string;
  children: ReactNode;
  className?: string;
  /** "none" lets a section own its own padding; "tight" trims the deep tail */
  pad?: "default" | "tight" | "none";
}) {
  const padding = {
    default: "px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-28",
    tight: "px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24",
    none: "",
  }[pad];

  return (
    <section id={id} className="px-4 sm:px-6 lg:px-0">
      {/* the frame closes with rounded bottom corners, so each section reads as
          its own panel and the next section's rails start beneath it; the first
          one's start beneath the nav, which is a panel of the same kind */}
      <div className="border-line mx-auto w-full max-w-[1230px] rounded-b-lg border-x border-b">
        <div className="flex items-baseline justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          {/* a long path wraps on a phone and is never cut */}
          <span className="mono-label min-w-0 wrap-anywhere">{index}</span>
          <span className="mono-label shrink-0">{label}</span>
        </div>
        <div className={`${padding} ${className}`}>{children}</div>
      </div>
    </section>
  );
}

/** Matches the Section frame width for elements that live outside a Section. */
export function FrameWidth({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="px-4 sm:px-6 lg:px-0">
      <div className={`mx-auto w-full max-w-[1230px] ${className}`}>{children}</div>
    </div>
  );
}
