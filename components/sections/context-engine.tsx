import { Section } from "@/components/frame";
import { Mark } from "@/components/logo";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { PILLARS } from "@/lib/content";

/* Four sources converging into one bundle. Drawn rather than implied — the
   whole claim of the section is that these arrive together. */
function Converge() {
  return (
    <svg
      viewBox="0 0 1000 64"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="hidden h-16 w-full lg:block"
    >
      {[125, 375, 625, 875].map((x) => (
        <path
          key={x}
          d={`M${x} 0 C${x} 40 500 24 500 64`}
          fill="none"
          stroke="var(--line)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <circle cx="500" cy="60" r="3" fill="var(--accent)" />
    </svg>
  );
}

export function ContextEngine() {
  return (
    <Section index="05" label="Context engine">
      <SectionHeader
        eyebrow="What Heal assembles"
        heading="Four signals, one incident bundle."
        body="Each source answers a different question about the failure. Together they are enough to act on."
      />

      <Reveal className="mt-14 lg:mt-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.name}
              className="border-line bg-surface rounded-lg border p-5"
            >
              <h3 className="text-h3">{pillar.name}</h3>
              <p className="text-muted mt-1.5 text-[13.5px]">{pillar.detail}</p>
            </div>
          ))}
        </div>

        <Converge />

        <div className="on-brand mt-4 flex flex-col items-center gap-1.5 rounded-lg px-6 py-5 lg:mt-0">
          <div className="flex items-center gap-2.5">
            <Mark size={18} />
            <span className="font-display text-[16px] font-semibold tracking-[-0.02em]">
              Heal context engine
            </span>
          </div>
          <span className="mono-label">Scoped to the incident, not your warehouse</span>
        </div>
      </Reveal>
    </Section>
  );
}
