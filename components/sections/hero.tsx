import { Section } from "@/components/frame";
import { RunGrid } from "@/components/run-grid";
import { Button } from "@/components/ui/button";
import { Reveal, SplitText } from "@/components/ui/reveal";
import { CTA, HERO } from "@/lib/content";

export function Hero() {
  return (
    <Section id="top" index="01" label="Overview">
      <div className="pt-10 lg:pt-16">
        <Reveal>
          <p className="mono-label">{HERO.eyebrow}</p>
        </Reveal>

        {/* The split line: consequence thrown to the far right of its own row. */}
        <Reveal mode="words" className="mt-8 lg:mt-12">
          <h1 className="font-display text-display">
            <span className="block">
              <SplitText text={HERO.headLeft} />
            </span>
            <span className="mt-1 block lg:pl-[42%] lg:text-right">
              <span aria-hidden="true" className="text-faint mr-3 lg:mr-5">
                →
              </span>
              <SplitText text={HERO.headRight} from={3} />
            </span>
          </h1>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-12 lg:mt-[132px] lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal delay={120}>
            <p className="text-muted max-w-[46ch]">{HERO.body}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={CTA.primary.href} event="request_early_access" trailing="↗">
                {CTA.primary.label}
              </Button>
              <Button
                href={CTA.secondary.href}
                variant="secondary"
                event="see_how_it_works"
                trailing="↓"
              >
                {CTA.secondary.label}
              </Button>
            </div>

            <ul className="mt-10 space-y-2">
              {HERO.assurances.map((item) => (
                <li key={item} className="text-faint flex items-baseline gap-2.5 text-[13px]">
                  <span aria-hidden="true" className="text-accent-text">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={220}>
            <RunGrid />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
