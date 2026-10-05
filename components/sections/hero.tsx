import { ArrowDown, ArrowUpRight } from "lucide-react";

import { Section } from "@/components/frame";
import { Button } from "@/components/ui/button";
import { LineageBackdrop } from "@/components/ui/lineage-backdrop";
import { Reveal, SplitText } from "@/components/ui/reveal";
import { RotatingWord } from "@/components/ui/rotating-word";
import { CTA, HERO } from "@/lib/content";

// The two actions are one width, set by the longer label.
const pair = "w-56 justify-center";

export function Hero() {
  const stemWords = HERO.headStem.split(" ").length;

  return (
    <Section id="top" index="01" label="Overview" pad="none">
      {/* one centred column over the graph the product watches; the graph
          thins out behind the words so they are read first */}
      <div className="relative overflow-hidden px-5 pt-20 pb-24 text-center sm:px-8 sm:pt-28 sm:pb-32 lg:px-10 lg:pt-40 lg:pb-48">
        <LineageBackdrop className="[mask-image:radial-gradient(ellipse_62%_58%_at_50%_44%,rgb(0_0_0/0.18),black)] max-sm:opacity-70" />

        <div className="relative">
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
            <p className="text-muted mx-auto mt-7 max-w-[56ch] text-pretty lg:mt-8">{HERO.body}</p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:mt-9">
              <Button
                href={CTA.primary.href}
                event="open_app"
                trailing={<ArrowUpRight className="size-4" />}
                className={pair}
              >
                {CTA.primary.label}
              </Button>
              <Button
                href={CTA.secondary.href}
                variant="secondary"
                event="see_how_it_works"
                trailing={<ArrowDown className="size-4" />}
                className={pair}
              >
                {CTA.secondary.label}
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
