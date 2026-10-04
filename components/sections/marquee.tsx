import { Section } from "@/components/frame";
import { Reveal } from "@/components/ui/reveal";
import { ToolLogo } from "@/components/ui/tool-logo";
import { STACK } from "@/lib/content";

/* The track wraps by shifting exactly half its width, so each half has to be
   wider than the frame or the tail runs dry before the loop comes round. */
const GROUP = [...STACK, ...STACK];

export function Marquee() {
  return (
    <Section index="02" label="Your stack" pad="none">
      <div className="px-5 pb-14 sm:px-8 lg:px-10 lg:pb-20">
        <p className="mono-label mono-eyebrow mb-5">Context across the tools you already run</p>

        <Reveal className="bg-panel overflow-hidden rounded-lg py-9">
          <div className="[mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
            <div className="marquee-track flex w-max">
              {[0, 1].map((half) => (
                <div
                  key={half}
                  aria-hidden={half === 1}
                  className="flex shrink-0 items-center gap-16 pr-16 lg:gap-20 lg:pr-20"
                >
                  {GROUP.map((name, i) => {
                    return (
                      <span
                        key={`${name}-${i}`}
                        className="text-faint flex items-center gap-3 whitespace-nowrap"
                      >
                        <ToolLogo name={name} />
                        <span className="font-display text-h3">
                          {name}
                        </span>
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
