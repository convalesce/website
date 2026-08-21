import { Section } from "@/components/frame";
import { Cell, Grid } from "@/components/ui/grid";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { CONTEXT_SOURCES, TICKER_ITEMS } from "@/lib/content";

export function WhyConvalesce() {
  return (
    <Section id="context" index="04" label="Context">
      <SectionHeader
        eyebrow="What the agent can see"
        heading="Your agent is only as good as what it can see."
        body="A generic copilot sees an error message. Convalesce sees the execution that produced it, the data it touched, and the systems around it."
      />

      <Reveal className="mt-14 lg:mt-24">
        <Grid cols={3}>
          {CONTEXT_SOURCES.map((source) => (
            <Cell key={source.name} className="flex flex-col">
              <h3 className="text-h3">{source.name}</h3>
              <p className="text-muted text-small mt-2 mb-5">{source.question}</p>
              <p className="text-faint font-mono text-mono-sm border-line mt-auto border-t pt-3">
                {source.reads}
              </p>
            </Cell>
          ))}

          {/* the sixth cell is the product running, not another card */}
          <Cell tone="brand" className="relative">
            <span className="mono-label">Currently healing</span>
            <div className="relative mt-4 h-[104px] overflow-hidden [mask-image:linear-gradient(180deg,transparent,black_28%,black_72%,transparent)]">
              <div className="ticker-track flex flex-col gap-2.5">
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                  <span
                    key={`${item}-${i}`}
                    aria-hidden={i >= TICKER_ITEMS.length}
                    className="font-mono text-ink text-mono whitespace-nowrap"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Cell>
        </Grid>
      </Reveal>
    </Section>
  );
}
