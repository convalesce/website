"use client";

import { useEffect, useRef, useState } from "react";

import { Section } from "@/components/frame";
import { SectionHeader } from "@/components/ui/section-header";
import { STEPS } from "@/lib/content";

export function Process() {
  const [active, setActive] = useState(0);
  const blocks = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = blocks.current.indexOf(entry.target as HTMLDivElement);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    const nodes = blocks.current.filter((n): n is HTMLDivElement => n !== null);
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <Section id="how-it-works" index="03" label="How it works">
      <SectionHeader
        eyebrow="The investigation layer"
        heading="From alert to fix, in one continuous thread."
        body="Heal gathers the evidence automatically, reasons over it, and hands your team a resolution they can verify."
      />

      <div className="mt-16 grid gap-10 lg:mt-28 lg:grid-cols-12">
        {/* sticky rail — the steps are a real sequence, so the numbering is earned */}
        {/* min-w-0 lets the rail actually scroll on narrow screens instead of
            widening the grid track */}
        <div className="min-w-0 lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <div className="mb-5 flex items-center justify-between lg:mb-6">
              <span className="mono-label">Stage</span>
              <span className="mono-label">
                {active + 1} of {STEPS.length}
              </span>
            </div>
            <ul className="flex gap-5 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-visible">
              {STEPS.map((step, i) => (
                <li
                  key={step.n}
                  className={`transition-colors lg:border-l-2 lg:py-2 lg:pl-4 ${
                    i === active ? "lg:border-accent" : "lg:border-line"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      blocks.current[i]?.scrollIntoView({ block: "center" })
                    }
                    className={`text-left text-[15px] whitespace-nowrap transition-colors ${
                      i === active ? "text-ink" : "text-faint hover:text-muted"
                    }`}
                  >
                    {step.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-8 lg:col-start-5">
          <div className="space-y-16 lg:space-y-[132px]">
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                ref={(node) => {
                  blocks.current[i] = node;
                }}
              >
                <div className="bg-brand text-on-brand font-mono mb-6 inline-flex h-10 w-10 items-center justify-center rounded-lg text-[12px]">
                  {step.n}
                </div>
                <h3 className="font-display text-h2 max-w-[18ch] text-balance">
                  {step.title}
                </h3>
                <p className="text-muted mt-4 max-w-[52ch]">{step.body}</p>
                <p className="border-line text-faint font-mono mt-6 border-t pt-4 text-[11px]">
                  {step.footnote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
