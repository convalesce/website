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
  top = false,
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
  /** closes the frame's top edge; only the first section has nothing above it */
  top?: boolean;
}) {
  const padding = {
    default: "px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10 lg:pb-[156px]",
    tight: "px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24",
    none: "",
  }[pad];

  return (
    <section id={id} className={`px-4 sm:px-6 lg:px-0 ${top ? "pt-3" : ""}`}>
      {/* the frame closes with rounded bottom corners, so each section reads as
          its own panel and the next section's rails start beneath it */}
      <div
        className={`border-line mx-auto w-full max-w-[1230px] rounded-b-lg border-x border-b ${
          top ? "rounded-t-lg border-t" : ""
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <span className="mono-label">{index}</span>
          <span className="mono-label">{label}</span>
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
