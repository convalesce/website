import { Section } from "@/components/frame";
import { STACK } from "@/lib/content";

export function Marquee() {
  return (
    <Section index="02" label="Your stack" pad="none">
      <div className="px-5 pb-14 sm:px-8 lg:px-10 lg:pb-20">
        <p className="mono-label mb-5">Context across the tools you already run</p>

        <div className="bg-panel overflow-hidden rounded-lg py-9">
          <div className="[mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
            <div className="marquee-track flex w-max items-center gap-20 pr-20">
              {[...STACK, ...STACK].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  aria-hidden={i >= STACK.length}
                  className="font-display text-faint text-[19px] font-semibold tracking-[-0.02em] whitespace-nowrap"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
