import { Section } from "@/components/frame";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { CONTEXT_SOURCES, TICKER_ITEMS } from "@/lib/content";

export function WhyHeal() {
  return (
    <Section id="context" index="04" label="Why Heal">
      <SectionHeader
        eyebrow="Better context. Better answers."
        heading="Your agent is only as good as what it can see."
        body="A generic copilot sees an error message. Heal sees the execution that produced it, the data it touched, and the systems around it."
      />

      {/* A contiguous bordered grid — shared hairlines, no floating cards. */}
      <Reveal className="mt-14 lg:mt-24">
        <div className="border-line grid border-t border-l sm:grid-cols-2 lg:grid-cols-3">
          {CONTEXT_SOURCES.map((source) => (
            <div
              key={source.name}
              className="border-line border-r border-b p-6 lg:p-8"
            >
              <span className="bg-brand text-on-brand font-mono inline-flex h-10 w-10 items-center justify-center rounded-lg text-[12px]">
                {source.n}
              </span>
              <h3 className="text-h3 mt-5">{source.name}</h3>
              <p className="text-muted mt-2 text-[14px]">{source.question}</p>
            </div>
          ))}

          {/* the sixth cell is the product, not another card */}
          <div className="on-brand relative border-r border-b p-6 lg:p-8">
            <span className="mono-label">Currently healing</span>
            <div className="relative mt-4 h-[104px] overflow-hidden [mask-image:linear-gradient(180deg,transparent,black_28%,black_72%,transparent)]">
              <div className="ticker-track flex flex-col gap-2.5">
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                  <span
                    key={`${item}-${i}`}
                    aria-hidden={i >= TICKER_ITEMS.length}
                    className="font-mono text-ink text-[13px] whitespace-nowrap"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
