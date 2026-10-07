import { ArrowUpRight, Circle } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/frame";
import { Cell, Grid } from "@/components/ui/grid";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { ToolLogo } from "@/components/ui/tool-logo";
import { INTEGRATIONS, type Integration } from "@/lib/content";


function Tool({ integration }: { integration: Integration }) {
  return (
    <div className="flex min-w-0 items-center gap-3.5">
      <ToolLogo name={integration.name} />
      <div className="min-w-0">
        <h3 className="text-h3 text-balance">{integration.name}</h3>
        <p className="text-faint text-small mt-0.5">{integration.kind}</p>
      </div>
    </div>
  );
}

const chip = "mono-label inline-flex shrink-0 items-center gap-1.5 rounded-sm border px-2 py-1";

/* Both states share one quiet label; only the dot is in the page's one
   colour, so green marks what can be connected now without a row of green
   boxes competing with the tools' own marks. */
function Status({ status }: { status: Integration["status"] }) {
  if (status === "live") {
    return (
      <span className={`${chip} border-line text-faint`}>
        <Circle aria-hidden="true" className="text-accent size-2 fill-current" />
        Live
      </span>
    );
  }
  return <span className={`${chip} border-line text-faint`}>Coming soon</span>;
}

export function Integrations() {
  return (
    <Section id="integrations" index="04" label="Integrations">
      <SectionHeader
        heading="Start with the orchestrator and warehouse you already run."
        body="Convalesce reads run metadata and schema shape. Connect one tool to begin and add more as you need them. Tell us which one you need next."
      />

      <Reveal className="mt-10 lg:mt-14">
        <Grid cols={3}>
          {INTEGRATIONS.map((integration) => (
            <Cell key={integration.name} className="flex items-center justify-between gap-4">
              <Tool integration={integration} />
              <Status status={integration.status} />
            </Cell>
          ))}
        </Grid>
        <Link
          href="/integrations"
          className="text-ink text-small mt-6 inline-flex min-h-11 items-center gap-1.5 underline underline-offset-4"
        >
          See every integration and its setup guide
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </Reveal>
    </Section>
  );
}
