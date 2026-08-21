import { Section } from "@/components/frame";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { FAQ as ITEMS } from "@/lib/content";

export function Faq() {
  return (
    <Section index="07" label="Questions">
      <SectionHeader eyebrow="Before you ask" heading="Questions data teams open with." />

      {/* one-column hairline grid: each question is its own box, sharing
          lines with its neighbours like every other grid on the page */}
      <Reveal className="mt-14 lg:mt-24">
        <div className="border-line border-t border-l">
          {ITEMS.map((item) => (
            <details key={item.q} className="border-line group border-r border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-5 sm:px-6 [&::-webkit-details-marker]:hidden">
                <span className="text-h3">{item.q}</span>
                <span
                  aria-hidden="true"
                  className="text-faint font-mono text-h3 shrink-0 leading-none transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-muted max-w-[62ch] px-5 pb-6 sm:px-6">{item.a}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
