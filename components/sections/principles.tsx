import { Section } from "@/components/frame";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { PRINCIPLES } from "@/lib/content";

export function Principles() {
  return (
    <Section index="07" label="Principles">
      <SectionHeader eyebrow="Built with intent" heading="Less noise. More certainty." />

      <Reveal className="mt-14 lg:mt-24">
        <div className="border-line grid border-t border-l md:grid-cols-3">
          {PRINCIPLES.map((principle) => (
            <div key={principle.name} className="border-line border-r border-b p-6 lg:p-8">
              <h3 className="text-h3">{principle.name}</h3>
              <p className="text-muted mt-3 text-[14px]">{principle.body}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
