import { Plus } from "lucide-react";

import { Section } from "@/components/frame";
import { Reveal, SplitText } from "@/components/ui/reveal";
import { FAQ as ITEMS } from "@/lib/content";

export function Faq() {
  return (
    <Section index="07" label="Questions" pad="tight">
      {/* the heading stays beside the list as it scrolls, so the questions
          start at the top of the section instead of a screen below it */}
      <div className="grid gap-8 pt-10 sm:pt-12 lg:grid-cols-12 lg:gap-6 lg:pt-16">
        <div className="lg:col-span-4">
          <Reveal mode="words" className="lg:sticky lg:top-28">
            <h2 className="font-display text-h2 max-w-[14ch] text-balance">
              <SplitText text="Questions teams ask first." />
            </h2>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-8">
          <div className="border-line border-t">
            {ITEMS.map((item) => (
              <details key={item.q} className="border-line group border-b">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="text-h3">{item.q}</span>
                  <Plus
                    aria-hidden="true"
                    className="text-faint size-5 shrink-0 transition-transform duration-200 group-open:rotate-45"
                  />
                </summary>
                <p className="text-muted max-w-[62ch] pb-6">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
