import { ArrowUpRight } from "lucide-react";

import { Section } from "@/components/frame";
import { Button } from "@/components/ui/button";
import { LineageBackdrop } from "@/components/ui/lineage-backdrop";
import { Reveal, SplitText } from "@/components/ui/reveal";
import { CLOSER } from "@/lib/content";

export function Closer() {
  return (
    <Section index="07" label="Get started" pad="none">
      {/* the page ends the way it opened: one centred line and one action */}
      <div className="relative overflow-hidden px-5 pt-14 pb-20 text-center sm:px-8 sm:pt-20 sm:pb-24 lg:px-10 lg:pt-24 lg:pb-32">
        <LineageBackdrop
          className="[mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,transparent,black)] opacity-70"
        />
        <div className="relative">
          <Reveal mode="words">
            <h2 className="font-display text-display text-balance">
              <SplitText text={CLOSER.head} />
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-muted mx-auto mt-6 max-w-[48ch] text-pretty">
              {CLOSER.body}
            </p>
            <Button
              href={CLOSER.cta.href}
              event="open_app"
              trailing={<ArrowUpRight className="size-4" />}
              className="mt-8"
            >
              {CLOSER.cta.label}
            </Button>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
