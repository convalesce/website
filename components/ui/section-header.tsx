import { Reveal, SplitText } from "@/components/ui/reveal";

/**
 * opal.dev's recurring move: display heading on the left, supporting paragraph
 * thrown to the far-right column *and* dropped below the heading's baseline.
 * This single asymmetry does more for the page's feel than anything else.
 */
export function SectionHeader({
  eyebrow,
  heading,
  body,
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
}) {
  return (
    <div className="grid gap-10 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-6 lg:pt-24">
      <div className="lg:col-span-7">
        {eyebrow ? <p className="mono-label mb-6">{eyebrow}</p> : null}
        <Reveal mode="words">
          <h2 className="font-display text-h2 text-balance">
            <SplitText text={heading} />
          </h2>
        </Reveal>
      </div>

      {body ? (
        <div className="lg:col-span-4 lg:col-start-9 lg:pt-[92px]">
          <Reveal delay={140}>
            <p className="text-muted max-w-[46ch]">{body}</p>
          </Reveal>
        </div>
      ) : null}
    </div>
  );
}
