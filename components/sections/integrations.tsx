import { Circle } from "lucide-react";
import { Section } from "@/components/frame";
import { Cell, Grid } from "@/components/ui/grid";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { ToolLogo } from "@/components/ui/tool-logo";
import { INTEGRATIONS, type Integration } from "@/lib/content";

const LIVE = INTEGRATIONS.filter((integration) => integration.status === "live");
const SOON = INTEGRATIONS.filter((integration) => integration.status === "soon");

function Tool({ integration }: { integration: Integration }) {
  return (
    <div className="flex min-w-0 items-center gap-3.5">
      <ToolLogo name={integration.name} />
      <div className="min-w-0">
        <h3 className="text-h3 truncate">{integration.name}</h3>
        <p className="text-faint text-small mt-0.5">{integration.kind}</p>
      </div>
    </div>
  );
}

const chip = "mono-label border-line inline-flex items-center gap-1.5 rounded-sm border px-2 py-1";

export function Integrations() {
  return (
    <Section id="integrations" index="05" label="Integrations">
      <SectionHeader
        heading="Start with the orchestrator and warehouse you already run."
        body="Convalesce reads run metadata and schema shape. Connect one tool to begin and add more as you need them. Tell us which one you need next."
      />

      <Reveal className="mt-10 lg:mt-14">
        <Grid cols={3}>
          {LIVE.map((integration) => (
            <Cell key={integration.name} className="flex items-center justify-between gap-4">
              <Tool integration={integration} />
              <span className={`${chip} text-accent-text border-accent/30 shrink-0`}>
                <Circle aria-hidden="true" className="size-2 fill-current" />
                Live
              </span>
            </Cell>
          ))}
        </Grid>
      </Reveal>

      {/* what is not here yet is said once, as a line, not as a row of dimmed
          cells that look half-available */}
      <Reveal className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <h3 className="mono-label">On the way</h3>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {SOON.map((integration) => (
            <li key={integration.name} className="text-muted text-small flex items-center gap-2">
              <ToolLogo name={integration.name} className="size-4 grayscale" />
              {integration.name}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
