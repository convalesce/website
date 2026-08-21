import { ArrowDown, ArrowUpRight } from "lucide-react";

import { Section } from "@/components/frame";
import { Button } from "@/components/ui/button";
import { Reveal, SplitText } from "@/components/ui/reveal";
import { RotatingWord } from "@/components/ui/rotating-word";
import { CTA, HERO } from "@/lib/content";

export function Hero() {
  const stemWords = HERO.headStem.split(" ").length;

  return (
    <Section id="top" index="01" label="Overview" top pad="none">
      {/* one centred column; the frame's own padding is made symmetric here
          because nothing follows the buttons */}
      <div className="px-5 pt-14 pb-20 text-center sm:px-8 sm:pt-20 sm:pb-28 lg:px-10 lg:pt-28 lg:pb-36">
        <Reveal mode="words">
          {/* the rotating object always drops to its own line under the stem */}
          <h1 className="font-display text-hero">
            <SplitText text={HERO.headStem} />{" "}
            <span className="block">
              <RotatingWord words={HERO.rotating} from={stemWords} className="text-accent-text" />
            </span>
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="text-muted mx-auto mt-8 max-w-[56ch] lg:mt-10">{HERO.body}</p>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:mt-11">
            <Button
              href={CTA.primary.href}
              event="request_early_access"
              trailing={<ArrowUpRight className="size-4" />}
            >
              {CTA.primary.label}
            </Button>
            <Button
              href={CTA.secondary.href}
              variant="secondary"
              event="see_how_it_works"
              trailing={<ArrowDown className="size-4" />}
            >
              {CTA.secondary.label}
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
