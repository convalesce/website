import { Section } from "@/components/frame";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { FAQ as ITEMS } from "@/lib/content";

export function Faq() {
  return (
    <Section index="08" label="Questions">
      <SectionHeader eyebrow="Before you ask" heading="Questions data teams open with." />

      <Reveal className="mt-14 lg:mt-24">
        <div className="space-y-2">
          {ITEMS.map((item) => (
            <details
              key={item.q}
              className="border-line bg-surface group rounded-md border px-5 py-4 sm:px-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 [&::-webkit-details-marker]:hidden">
                <span className="text-[15px]">{item.q}</span>
                <span
                  aria-hidden="true"
                  className="text-faint shrink-0 text-[18px] leading-none transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-muted mt-3 max-w-[62ch] text-[14px]">{item.a}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
