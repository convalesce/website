import type { ReactNode } from "react";

import { Reveal, SplitText } from "@/components/ui/reveal";

/**
 * The page's recurring move: display heading on the left, supporting paragraph
 * thrown to the far-right column *and* dropped below the heading's baseline.
 * This single asymmetry does more for the page's feel than anything else.
 */
export function SectionHeader({
  eyebrow,
  heading,
  body,
  action,
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  /** rendered under the body in the right column, for a closing CTA */
  action?: ReactNode;
}) {
  return (
    <div className="grid gap-10 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-6 lg:pt-24">
      <div className="lg:col-span-7">
        {eyebrow ? <p className="mono-label mono-eyebrow mb-6">{eyebrow}</p> : null}
        <Reveal mode="words">
          <h2 className="font-display text-h2 max-w-[22ch] text-balance">
            <SplitText text={heading} />
          </h2>
        </Reveal>
      </div>

      {body || action ? (
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-[92px]">
          <Reveal delay={140}>
            {body ? <p className="text-muted max-w-[52ch]">{body}</p> : null}
            {action}
          </Reveal>
        </div>
      ) : null}
    </div>
  );
}
