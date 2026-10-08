import Link from "next/link";

import { ClockMeter } from "./clock-meter";
import { clock, scheduled, span, toMinutes, type Block, type Loaded } from "./content";
import { Actions, Back, CLOSER, Filed, LIST, LabFrame, Sample, prose } from "./shell";
import { SAMPLES, listPath, postPath } from "./variants";

const SLUG = "running-clock";

/* The section whose opening the fix is pinned to: it is the one that begins
   after the job is green again. */
const AFTER = "why-the-cost-stays-hidden";

const stamp = "text-muted text-mono-sm font-mono tabular-nums";

function Blocks({ blocks, data }: { blocks: Block[]; data: Loaded }) {
  const f = data.facts;
  return (
    <>
      {blocks.map((b, i) => {
        if (b.kind === "p") return <p key={i} className={`${prose} mt-5`}>{b.children}</p>;
        if (b.kind === "ul")
          return (
            <ul key={i} className={`${prose} marker:text-faint mt-5 list-disc space-y-2 pl-5`}>
              {b.items.map((item, j) => <li key={j} className="pl-1">{item.all}</li>)}
            </ul>
          );
        if (b.kind === "timeline")
          return (
            <figure key={i} className="my-10">
              <figcaption className="text-ink font-medium">{b.title}</figcaption>
              <ol className="mt-3">
                {b.events.map((e) => {
                  const minute = toMinutes(e.time);
                  return (
                    // the clock runs through the first three, then waits for the steps to carry it on
                    <li key={e.time} data-minute={minute <= f.started ? minute : undefined} data-label={e.what} className="grid grid-cols-[4rem_minmax(0,1fr)] items-baseline gap-x-4 py-2">
                      <time className={`text-mono font-mono tabular-nums ${e.state === "fail" ? "text-fail" : e.state === "ok" ? "text-accent-text" : "text-ink"}`}>{e.time}</time>
                      <span className="text-soft text-small text-pretty">
                        {e.state ? <span className="sr-only">{e.state === "fail" ? "Failed: " : "Recovered: "}</span> : null}
                        {e.what}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </figure>
          );
        const at = f.started + b.steps.reduce((sum, s) => sum + s.minutes, 0);
        return (
          <figure key={i} className="mt-10">
            <figcaption>
              <span className="text-ink block font-medium">{b.title}</span>
              <span className="text-muted text-small block">{b.estimate}</span>
            </figcaption>
            {/* each step stands alone with room around it, so reading it takes a moment and the clock moves */}
            <ol>
              {scheduled(b.steps, f.started).map((s) => {
                return (
                  <li key={s.step} data-minute={s.from} data-label={s.step} className="border-line border-b py-9 last:border-b-0 sm:py-12">
                    <p className={stamp}>
                      {clock(s.from)} to {clock(s.to)}, <span className="sr-only">about </span>{s.minutes} min
                    </p>
                    <p className="font-display text-ink text-lead mt-2 font-medium text-balance">{s.step}</p>
                    {s.note ? <p className="text-muted text-small mt-1.5">{s.note}</p> : null}
                  </li>
                );
              })}
            </ol>
            <p data-minute={at} data-label={data.timeline.events.find((e) => toMinutes(e.time) === at)?.what} className="border-line flex items-baseline justify-between gap-4 border-y py-4">
              <span className="text-ink font-medium">Total, estimated</span>
              <span className="font-display text-h2 text-ink whitespace-nowrap tabular-nums">
                <span className="sr-only">about </span>
                {span(at - f.started)}
              </span>
            </p>
          </figure>
        );
      })}
    </>
  );
}

export function ClockPost({ data }: { data: Loaded }) {
  const { post, facts: f } = data;
  const last = data.timeline.events[data.timeline.events.length - 1];
  return (
    <LabFrame pad="none">
      {/* on a small screen the clock is a bar that stays under the nav; on a wide one it stands in the left margin */}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_33rem_minmax(0,1fr)] lg:px-10 lg:pb-24">
        <div className="lg:col-span-2 lg:col-start-2">
          <div className="px-5 sm:px-8 lg:px-0">
            <Back href={listPath(SLUG)} />
            <h1 className="font-display text-display mt-6 max-w-[19ch] text-balance lg:mt-10">{post.title}</h1>
            <p className="text-ink text-lead mt-6 max-w-[40ch] text-pretty">{post.description}</p>
            <Filed post={post} className="mt-6" />
          </div>
        </div>
        <aside className="border-line bg-bg sticky top-16 z-10 mt-8 border-y px-5 py-2.5 sm:px-8 lg:static lg:col-start-1 lg:row-start-2 lg:mt-16 lg:border-0 lg:px-0 lg:py-0 lg:pr-12">
          <ClockMeter
            first={f.first}
            rest={{ minute: f.fixed, label: last.what }}
            className="grid grid-cols-[auto_auto_minmax(0,1fr)] items-baseline gap-x-3 lg:sticky lg:top-28 lg:ml-auto lg:block lg:w-48 lg:text-right"
          />
        </aside>
        <article className="px-5 pt-10 pb-16 sm:px-8 sm:pb-20 lg:col-start-2 lg:row-start-2 lg:px-0 lg:pt-16 lg:pb-0">
          <div className="-mt-5">
            <Blocks blocks={data.intro} data={data} />
          </div>
          {data.sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-head`} className="mt-16 scroll-mt-32">
              <h2 id={`${s.id}-head`} data-minute={s.id === AFTER ? f.fixed : undefined} data-label={last.what} className="font-display text-h2 text-balance">{s.title}</h2>
              <Blocks blocks={s.blocks} data={data} />
            </section>
          ))}
          <section aria-labelledby="start" className="border-line mt-16 border-t pt-10">
            <h2 id="start" className="font-display text-h2 text-balance">{CLOSER.head}</h2>
            <p className={`${prose} mt-4`}>{CLOSER.body}</p>
            <Actions className="mt-7" />
          </section>
        </article>
      </div>
    </LabFrame>
  );
}

export function ClockList({ data }: { data: Loaded }) {
  const { post, facts: f } = data;
  return (
    <LabFrame list>
      <header className="pt-12 sm:pt-16 lg:pt-24">
        <h1 className="font-display text-display max-w-[20ch] text-balance">{LIST.title}</h1>
        <p className="text-muted mt-6 max-w-[62ch] text-pretty">{LIST.intro}</p>
      </header>
      {/* every post is led by the time its failure took: that figure is the series' argument */}
      <ol className="border-line mt-12 border-t lg:mt-16">
        <li className="border-line grid gap-x-12 gap-y-4 border-b py-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <div>
            <p className="font-display text-ink text-[2.5rem] leading-none font-medium tracking-[-0.02em] tabular-nums">{span(f.fixed - f.first)}</p>
            <p className={`${stamp} mt-3`}>{clock(f.first)} to {clock(f.fixed)}</p>
            <p className="text-muted text-small mt-1">{span(f.handTotal)} of it finding the cause</p>
          </div>
          <div>
            <h2 className="font-display text-h2 max-w-[30ch] text-balance">
              <Link href={postPath(SLUG)} className="hover:text-accent-text transition-colors">{post.title}</Link>
            </h2>
            <p className="text-muted mt-3 max-w-[60ch] text-pretty">{post.description}</p>
            <Filed post={post} className="mt-4" />
          </div>
        </li>
        {SAMPLES.map((sample) => (
          <li key={sample.title} className="border-line grid gap-x-12 gap-y-3 border-b py-7 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <div className="flex items-baseline gap-3 lg:block">
              <Sample />
              <p className="text-faint text-small lg:mt-3">Not yet timed</p>
            </div>
            <h2 className="font-display text-h3 text-muted max-w-[44ch] text-balance">{sample.title}</h2>
          </li>
        ))}
      </ol>
    </LabFrame>
  );
}
