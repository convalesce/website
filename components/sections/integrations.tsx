import { Circle } from "lucide-react";
import { Section } from "@/components/frame";
import { Cell, Grid } from "@/components/ui/grid";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { ToolLogo } from "@/components/ui/tool-logo";
import { INTEGRATIONS } from "@/lib/content";

const chip = "mono-label border-line inline-flex items-center gap-1.5 rounded-sm border px-2 py-1";

export function Integrations() {
  return (
    <Section id="integrations" index="05" label="Integrations">
      <SectionHeader
        eyebrow="Connected surface"
        heading="Start with the orchestrator and warehouse you already run."
        body="Convalesce reads run metadata and schema shape. Connect one tool to begin and add more as you need them. Tell us which one you need next."
      />

      <Reveal className="mt-14 lg:mt-24">
        <Grid cols={3}>
          {INTEGRATIONS.map((integration) => {
            const live = integration.status === "live";
            return (
              <Cell
                key={integration.name}
                className={`flex items-center justify-between gap-4 ${live ? "" : "opacity-60"}`}
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <ToolLogo name={integration.name} />
                  <div className="min-w-0">
                    <h3 className="text-h3 truncate">{integration.name}</h3>
                    <p className="text-faint text-small mt-0.5">{integration.kind}</p>
                  </div>
                </div>
                {live ? (
                  <span className={`${chip} text-accent-text border-accent/30 shrink-0`}>
                    <Circle aria-hidden="true" className="size-2 fill-current" />
                    Live
                  </span>
                ) : (
                  <span className={`${chip} shrink-0`}>Soon</span>
                )}
              </Cell>
            );
          })}
        </Grid>
      </Reveal>
    </Section>
  );
}
