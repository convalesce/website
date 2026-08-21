import { Section } from "@/components/frame";
import { Cell, Grid } from "@/components/ui/grid";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { PRINCIPLES } from "@/lib/content";

export function Principles() {
  return (
    <Section index="06" label="Principles">
      <SectionHeader eyebrow="Built with intent" heading="Less noise. More certainty." />

      <Reveal className="mt-14 lg:mt-24">
        <Grid cols={3}>
          {PRINCIPLES.map((principle) => (
            <Cell key={principle.name} className="flex flex-col">
              <h3 className="text-h3">{principle.name}</h3>
              <p className="text-muted text-small mt-3 mb-5">{principle.body}</p>
              {/* pinned, so the rule lines up across the row whatever the body's length */}
              <p className="text-faint font-mono text-mono-sm border-line mt-auto border-t pt-3">
                {principle.proof}
              </p>
            </Cell>
          ))}
        </Grid>
      </Reveal>
    </Section>
  );
}
