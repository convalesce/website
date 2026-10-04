import type { ReactNode } from "react";

import { Reveal, SplitText } from "@/components/ui/reveal";

/**
 * The page's recurring move: display heading on the left, supporting paragraph
 * thrown to the far-right column *and* dropped below the heading's first line.
 * The frame's corner already names the section, so the heading stands alone.
 */
export function SectionHeader({
  heading,
  body,
  action,
}: {
  heading: string;
  body?: string;
  /** rendered under the body in the right column, for a closing CTA */
  action?: ReactNode;
}) {
  return (
    <div className="grid gap-6 pt-10 sm:pt-12 lg:grid-cols-12 lg:gap-6 lg:pt-16">
      <div className="lg:col-span-7">
        <Reveal mode="words">
          <h2 className="font-display text-h2 max-w-[22ch] text-balance">
            <SplitText text={heading} />
          </h2>
        </Reveal>
      </div>

      {body || action ? (
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-12">
          <Reveal delay={140}>
            {body ? <p className="text-muted max-w-[52ch]">{body}</p> : null}
            {action}
          </Reveal>
        </div>
      ) : null}
    </div>
  );
}
