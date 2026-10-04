import { ArrowDown, ArrowUpRight } from "lucide-react";

import { Section } from "@/components/frame";
import { HeroIncident } from "@/components/sections/hero-incident";
import { Button } from "@/components/ui/button";
import { Reveal, SplitText } from "@/components/ui/reveal";
import { RotatingWord } from "@/components/ui/rotating-word";
import { CTA, HERO } from "@/lib/content";

export function Hero() {
  const stemWords = HERO.headStem.split(" ").length;

  return (
    <Section id="top" index="01" label="Overview" top pad="none">
      {/* one centred column that ends on the incident itself: the claim, then
          the thing claimed */}
      <div className="px-5 pt-14 pb-10 text-center sm:px-8 sm:pt-20 sm:pb-12 lg:px-10 lg:pt-24 lg:pb-14">
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
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-3 lg:mt-9">
            <Button
              href={CTA.primary.href}
              event="open_app"
              trailing={<ArrowUpRight className="size-4" />}
            >
              {CTA.primary.label}
            </Button>
            <Button
              href={CTA.secondary.href}
              variant="ghost"
              event="see_how_it_works"
              trailing={<ArrowDown className="size-4" />}
            >
              {CTA.secondary.label}
            </Button>
          </div>
        </Reveal>

        <Reveal delay={280}>
          <HeroIncident />
        </Reveal>
      </div>
    </Section>
  );
}
