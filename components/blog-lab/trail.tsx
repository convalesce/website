import Link from "next/link";
import type { ReactNode } from "react";

import { clock, scheduled, span, type Block, type Loaded } from "./content";
import { Actions, Back, CLOSER, Filed, LIST, LabFrame, Sample, measure, prose } from "./shell";
import { TrailContents } from "./trail-contents";
import { SAMPLES, listPath, postPath } from "./variants";

const SLUG = "evidence-trail";

/* The rail sits at the same place in every link, so stacked links draw one
   unbroken line. A link's number is a real position: each rests on the one before. */
const rail = "before:bg-line relative pl-11 before:absolute before:top-0 before:bottom-0 before:left-[0.9375rem] before:w-px sm:pl-16 sm:before:left-[1.1875rem]";

function Knot({ n, solid = false, dashed = false }: { n: number; solid?: boolean; dashed?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`bg-bg text-mono absolute left-0 flex size-8 items-center justify-center rounded-full border font-mono tabular-nums sm:size-10 ${
        solid ? "border-accent/70 text-accent-text" : dashed ? "border-ink/30 text-faint border-dashed" : "border-ink/40 text-ink"
      }`}
    >
      {n}
    </span>
  );
}

/* A smaller mark on the same rail, for a moment or a step inside a link. */
function Bead({ tone = "plain" }: { tone?: "plain" | "fail" | "ok" }) {
  const fill = { plain: "bg-bg border-ink/50", fail: "bg-fail border-fail", ok: "bg-accent border-accent" }[tone];
  return <span aria-hidden="true" className={`absolute top-[0.45rem] left-[calc(0.9375rem-4px)] size-[9px] rounded-full border sm:left-[calc(1.1875rem-4px)] ${fill}`} />;
}

function Blocks({ blocks, started }: { blocks: Block[]; started: number }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.kind === "p")
          return (
            <div key={i} className={`${rail} pb-5`}>
              <p className={`${prose} ${measure}`}>{b.children}</p>
            </div>
          );
        if (b.kind === "ul")
          return (
            <div key={i} className={`${rail} pb-5`}>
              <ul className={`${prose} ${measure} marker:text-faint list-disc space-y-2 pl-5`}>
                {b.items.map((item, j) => <li key={j} className="pl-1">{item.all}</li>)}
              </ul>
            </div>
          );
        if (b.kind === "timeline")
          return (
            <figure key={i} className="pb-5">
              <figcaption className="sr-only">{b.title}</figcaption>
              <ol>
                {b.events.map((e) => (
                  <li key={e.time} className={`${rail} pb-4`}>
                    <Bead tone={e.state ?? "plain"} />
                    <p className={`${measure} grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-x-3`}>
                      <time className="text-muted text-mono-sm font-mono tabular-nums">{e.time}</time>
                      <span className="text-ink text-small text-pretty">
                        {e.state ? <span className="sr-only">{e.state === "fail" ? "Failed: " : "Recovered: "}</span> : null}
                        {e.what}
                      </span>
                    </p>
                  </li>
                ))}
              </ol>
            </figure>
          );
        const at = started + b.steps.reduce((sum, s) => sum + s.minutes, 0);
        return (
          <figure key={i} className="pb-5">
            <figcaption className={`${rail} pt-3 pb-4`}>
              <span className="text-ink block font-medium">{b.title}</span>
              <span className="text-muted text-small block">{b.estimate}</span>
            </figcaption>
            <ol>
              {scheduled(b.steps, started).map((s) => {
                return (
                  <li key={s.step} className={`${rail} pb-4`}>
                    <Bead />
                    <div className={`${measure} grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4`}>
                      <p className="text-ink text-small text-pretty">
                        {s.step}
                        {s.note ? <span className="text-faint block">{s.note}</span> : null}
                      </p>
                      <p className="text-muted text-mono-sm font-mono whitespace-nowrap tabular-nums">
                        {s.minutes} min, by {clock(s.to)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className={`${rail} pb-1`}>
              <Bead tone="ok" />
              <span className={`${measure} flex items-baseline justify-between gap-4`}>
                <span className="text-ink font-medium">Total, estimated</span>
                <span className="font-display text-h2 text-ink whitespace-nowrap tabular-nums">
                  <span className="sr-only">about </span>
                  {span(at - started)}
                </span>
              </span>
            </p>
          </figure>
        );
      })}
    </>
  );
}

function ChainLink({ id, n, title, solid, children }: { id: string; n: number; title: string; solid?: boolean; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-head`} className="scroll-mt-24">
      <div className={`${rail} pb-5 ${n > 1 ? "pt-9" : ""}`}>
        <Knot n={n} solid={solid} />
        <h2 id={`${id}-head`} className="font-display text-h2 max-w-[24ch] pt-px text-balance sm:pt-1">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function TrailPost({ data }: { data: Loaded }) {
  const { post } = data;
  const links = [{ id: "first-sign", title: data.timeline.title, blocks: data.intro }, ...data.sections];
  const last = links.length + 1;
  return (
    <LabFrame>
      <Back href={listPath(SLUG)} />
      <header className="pt-6 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-x-12 lg:pt-10">
        <div className="lg:col-start-2">
          <h1 className="font-display text-display max-w-[20ch] text-balance">{post.title}</h1>
          <p className="text-ink text-lead mt-6 max-w-[46ch] text-pretty">{post.description}</p>
          <Filed post={post} className="mt-6" />
        </div>
      </header>

      <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-x-12">
        <aside className="max-lg:hidden">
          <nav aria-label="The chain" className="sticky top-24">
            <TrailContents links={[...links.map(({ id, title }) => ({ id, title })), { id: "start", title: CLOSER.head }]} />
          </nav>
        </aside>
        <article>
          {links.map((link, i) => (
            <ChainLink key={link.id} id={link.id} n={i + 1} title={link.title}>
              <Blocks blocks={link.blocks} started={data.facts.started} />
            </ChainLink>
          ))}
          <section id="start" aria-labelledby="start-head" className="scroll-mt-24">
            {/* the rail ends at the last knot: nothing hangs below the conclusion */}
            <div className="relative pt-9 pl-11 before:bg-line before:absolute before:top-0 before:left-[0.9375rem] before:h-9 before:w-px sm:pl-16 sm:before:left-[1.1875rem]">
              <Knot n={last} solid />
              <h2 id="start-head" className="font-display text-h2 max-w-[24ch] pt-px text-balance sm:pt-1">{CLOSER.head}</h2>
              <p className={`${prose} ${measure} mt-5`}>{CLOSER.body}</p>
              <Actions className="mt-7" />
            </div>
          </section>
        </article>
      </div>
    </LabFrame>
  );
}

export function TrailList({ data }: { data: Loaded }) {
  const { post } = data;
  return (
    <LabFrame list>
      <header className="pt-12 sm:pt-16 lg:pt-24">
        <h1 className="font-display text-display max-w-[20ch] text-balance">{LIST.title}</h1>
        <p className="text-muted mt-6 max-w-[62ch] text-pretty">{LIST.intro}</p>
      </header>
      <ol className="mt-12 lg:mt-16 lg:ml-[17rem]">
        <li className={`${rail} pb-12`}>
          <Knot n={1} solid />
          <h2 className="font-display text-h2 max-w-[30ch] pt-px text-balance sm:pt-1">
            <Link href={postPath(SLUG)} className="hover:text-accent-text transition-colors">{post.title}</Link>
          </h2>
          <p className="text-muted mt-3 max-w-[60ch] text-pretty">{post.description}</p>
          <Filed post={post} className="mt-4" />
        </li>
        {SAMPLES.map((sample, i) => (
          <li
            key={sample.title}
            className={`relative pb-10 pl-11 last:pb-0 sm:pl-16 ${
              i < SAMPLES.length - 1
                ? "before:border-line before:absolute before:top-0 before:bottom-0 before:left-[0.9375rem] before:border-l before:border-dashed sm:before:left-[1.1875rem]"
                : ""
            }`}
          >
            <Knot n={i + 2} dashed />
            <h2 className="font-display text-h3 text-muted max-w-[44ch] pt-1 text-balance sm:pt-2">{sample.title}</h2>
            <Sample className="mt-3" />
          </li>
        ))}
      </ol>
    </LabFrame>
  );
}
