import { Section } from "@/components/frame";
import { Button } from "@/components/ui/button";
import { Reveal, SplitText } from "@/components/ui/reveal";
import { CLOSER } from "@/lib/content";

export function Closer() {
  return (
    <Section index="09" label="Early access" pad="tight">
      <div className="grid gap-10 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-6 lg:pt-24">
        <div className="lg:col-span-7">
          <p className="mono-label mb-6">{CLOSER.eyebrow}</p>
          <Reveal mode="words">
            <h2 className="font-display text-h2 max-w-[16ch] text-balance">
              <SplitText text={CLOSER.head} />
            </h2>
          </Reveal>
        </div>

        <div className="lg:col-span-4 lg:col-start-9 lg:pt-[92px]">
          <Reveal delay={140}>
            <p className="text-muted max-w-[46ch]">{CLOSER.body}</p>
            <Button
              href={CLOSER.cta.href}
              event="request_early_access"
              trailing="↗"
              className="mt-7"
            >
              {CLOSER.cta.label}
            </Button>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
