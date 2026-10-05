"use client";

import { Fragment, useEffect, useRef, useState } from "react";

import { Section } from "@/components/frame";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { STEPS, type Artifact } from "@/lib/content";

const line = {
  same: { mark: " ", row: "", code: "text-muted" },
  cut: { mark: "-", row: "bg-fail-soft", code: "text-fail" },
  add: { mark: "+", row: "bg-accent-soft", code: "text-accent-text" },
} as const;

/* What the product holds at this stage, as the product would print it: a
   panel of its own, so each step is a claim and the thing that backs it. */
function ArtifactPanel({ artifact, last }: { artifact: Artifact; last: boolean }) {
  return (
    <figure className="border-line bg-surface overflow-hidden rounded-lg border">
      <figcaption className="border-line mono-label flex items-center justify-between gap-4 border-b px-5 py-3">
        {artifact.caption}
        <span>Example</span>
      </figcaption>

      <dl className="font-mono text-mono grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 px-5 py-4">
        {artifact.rows.map(([key, value]) => (
          <Fragment key={`${key}-${value}`}>
            <dt className="text-faint">{key}</dt>
            <dd className="text-ink/85 break-words">{value}</dd>
          </Fragment>
        ))}
      </dl>

      {artifact.diff ? (
        <div className="border-line border-t">
          <p className="text-faint font-mono text-mono-sm px-5 pt-3">{artifact.diff.file}</p>
          <pre className="font-mono text-mono overflow-x-auto py-3">
            {artifact.diff.lines.map((entry) => {
              const look = line[entry.kind];
              return (
                <div key={`${entry.kind}-${entry.code}`} className={`flex min-w-max px-5 ${look.row}`}>
                  <span aria-hidden="true" className={`w-5 shrink-0 select-none ${look.code}`}>
                    {look.mark}
                  </span>
                  <code className={look.code}>{entry.code}</code>
                </div>
              );
            })}
          </pre>
        </div>
      ) : null}

      <p className="border-line text-small flex items-center gap-2.5 border-t px-5 py-3">
        <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${last ? "bg-accent" : "bg-faint"}`} />
        <span className={last ? "text-accent-text" : "text-muted"}>{artifact.outcome}</span>
      </p>
    </figure>
  );
}

export function Process() {
  const [active, setActive] = useState(0);
  const blocks = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = blocks.current.indexOf(entry.target as HTMLLIElement);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    const nodes = blocks.current.filter((n): n is HTMLLIElement => n !== null);
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <Section id="how-it-works" index="03" label="How it works">
      <SectionHeader
        heading="How a failed run becomes a pull request."
        body="Convalesce collects the evidence, works out the cause, and sends your team a fix they can check."
      />

      <div className="mt-10 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-6">
        {/* sticky rail: the steps are a real sequence, so the numbering is earned.
            min-w-0 lets the rail scroll on narrow screens instead of widening
            the grid track. */}
        <div className="min-w-0 lg:col-span-3">
          <ul className="flex gap-5 overflow-x-auto lg:sticky lg:top-28 lg:flex-col lg:gap-0 lg:overflow-visible">
            {STEPS.map((step, i) => (
              <li
                key={step.n}
                className={`transition-colors lg:border-l-2 lg:pl-4 ${
                  i === active ? "lg:border-accent" : "lg:border-line"
                }`}
              >
                <button
                  type="button"
                  aria-current={i === active ? "step" : undefined}
                  onClick={() => blocks.current[i]?.scrollIntoView({ block: "center" })}
                  className={`text-small flex items-baseline gap-3 py-2 text-left whitespace-nowrap transition-colors lg:py-2.5 ${
                    i === active ? "text-ink" : "text-faint hover:text-muted"
                  }`}
                >
                  <span className="font-mono text-mono-sm tabular-nums">{step.n}</span>
                  {step.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <ol className="lg:col-span-9">
          {STEPS.map((step, i) => (
            <li
              key={step.n}
              ref={(node) => {
                blocks.current[i] = node;
              }}
              className={`border-line ${i > 0 ? "mt-12 border-t pt-12 lg:mt-16 lg:pt-16" : ""}`}
            >
              <Reveal className="grid items-start gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] lg:gap-10">
                <div>
                  <p className="text-faint font-mono text-mono-sm tabular-nums">{step.n}</p>
                  <h3 className="font-display text-h2 mt-3 text-balance">{step.title}</h3>
                  <p className="text-muted mt-4 max-w-[44ch]">{step.body}</p>
                </div>
                <ArtifactPanel artifact={step.artifact} last={i === STEPS.length - 1} />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
