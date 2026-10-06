import { ArrowDown, ArrowUpRight } from "lucide-react";

import { Section } from "@/components/frame";
import { Button } from "@/components/ui/button";
import { Reveal, SplitText } from "@/components/ui/reveal";
import { RotatingWord } from "@/components/ui/rotating-word";
import { CTA, HERO } from "@/lib/content";

// The two actions are one width, set by the longer label.
const pair = "w-56 justify-center";

export function Hero() {
  const stemWords = HERO.headStem.split(" ").length;

  return (
    <Section id="top" index="01" label="Overview" pad="none">
      {/* one centred column, with nothing moving behind it: a low light on the
          horizon, so the words and the two actions are all there is to read */}
      {/* with the nav and the frame's label row above it, the hero ends
          exactly at the bottom of the first screen */}
      <div className="relative flex min-h-[calc(100svh-6.875rem)] flex-col justify-center overflow-hidden px-5 py-20 text-center sm:px-8 sm:py-24 lg:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_70%_60%_at_50%_118%,rgb(52_211_153/0.3),transparent_70%)]"
        />

        <div className="relative">
          <Reveal mode="words">
            {/* the rotating object always drops to its own line under the stem */}
            <h1 className="font-display text-hero">
              <SplitText text={HERO.headStem} />{" "}
              <span className="block">
                <RotatingWord
                  words={HERO.rotating}
                  from={stemWords}
                  className="text-accent-text"
                />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="text-muted mx-auto mt-7 max-w-[56ch] text-pretty lg:mt-8">
              {HERO.body}
            </p>
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
