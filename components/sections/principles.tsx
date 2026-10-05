import { Section } from "@/components/frame";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { PRINCIPLES } from "@/lib/content";

export function Principles() {
  return (
    <Section index="06" label="Principles">
      <SectionHeader heading="Three things we hold to." />

      {/* three ruled rows, read across: the commitment, what it means, and
          the fact that backs it */}
      <Reveal className="mt-10 lg:mt-14">
        <ul className="border-line border-t">
          {PRINCIPLES.map((principle) => (
            <li
              key={principle.name}
              className="border-line grid gap-x-6 gap-y-2 border-b py-6 lg:grid-cols-12 lg:items-baseline lg:py-7"
            >
              <h3 className="font-display text-h2 lg:col-span-4">{principle.name}</h3>
              <p className="text-muted max-w-[52ch] lg:col-span-5">{principle.body}</p>
              <p className="text-faint font-mono text-mono-sm lg:col-span-3 lg:text-right">{principle.proof}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
