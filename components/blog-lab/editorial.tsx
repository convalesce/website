import Link from "next/link";
import type { ReactNode } from "react";

import { clock, span, type Block, type Loaded } from "./content";
import { Actions, Back, CLOSER, Filed, LIST, LabFrame, Sample, measure, prose } from "./shell";
import { SAMPLES, listPath, postPath } from "./variants";

const SLUG = "editorial";

/* A note set in the margin. On a wide screen it floats out of the column to
   the right and the text runs on beside it; two notes close together stack and
   never overlap. Below that it sits in the column between two rules. */
function Margin({ children }: { children: ReactNode }) {
  return (
    <aside className="border-line my-9 border-y py-6 lg:float-right lg:clear-right lg:my-0 lg:mt-1.5 lg:-mr-[22rem] lg:mb-10 lg:w-72 lg:border-y-0 lg:border-t lg:py-0 lg:pt-4">
      {children}
    </aside>
  );
}

/* A figure lifted out of the text and set large, with the words that say what it counts. */
function Pulled({ figure, children }: { figure: string; children: ReactNode }) {
  return (
    <>
      <p className="font-display text-ink text-[3.25rem] leading-none font-medium tracking-[-0.035em] tabular-nums">{figure}</p>
      <p className="text-muted text-small mt-3 max-w-[30ch] text-pretty">{children}</p>
    </>
  );
}

function Blocks({ blocks, opening = false, pull }: { blocks: Block[]; opening?: boolean; pull?: ReactNode }) {
  return (
    <>
      {pull}
      {blocks.map((b, i) => {
        if (b.kind === "p")
          return opening && i === 0 ? (
            <p key={i} className="font-display text-ink text-[1.5rem] leading-[1.3] font-medium tracking-[-0.02em] text-balance">{b.children}</p>
          ) : (
            <p key={i} className={`${prose} mt-5`}>{b.children}</p>
          );
        if (b.kind === "ul")
          return (
            <ul key={i} className={`${prose} marker:text-faint mt-5 list-disc space-y-2 pl-5`}>
              {b.items.map((item, j) => <li key={j} className="pl-1">{item.all}</li>)}
            </ul>
          );
        if (b.kind === "timeline")
          return (
            <Margin key={i}>
              <figure>
                <figcaption className="text-ink text-small font-medium">{b.title}</figcaption>
                <ol className="mt-3 space-y-2.5">
                  {b.events.map((e) => (
                    <li key={e.time} className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-x-2">
                      <time className={`text-mono-sm font-mono tabular-nums ${e.state === "fail" ? "text-fail" : e.state === "ok" ? "text-accent-text" : "text-muted"}`}>{e.time}</time>
                      <span className="text-muted text-small text-pretty">
                        {e.state ? <span className="sr-only">{e.state === "fail" ? "Failed: " : "Recovered: "}</span> : null}
                        {e.what}
                      </span>
                    </li>
                  ))}
                </ol>
              </figure>
            </Margin>
          );
        const total = b.steps.reduce((sum, s) => sum + s.minutes, 0);
        return (
          <Margin key={i}>
            <figure>
              <p className="font-display text-ink text-[3.25rem] leading-none font-medium tracking-[-0.035em] tabular-nums">
                <span className="sr-only">about </span>
                {span(total)}
              </p>
              <figcaption className="mt-3">
                <span className="text-ink text-small block font-medium">{b.title}</span>
                <span className="text-muted text-small block">{b.estimate}</span>
              </figcaption>
              <ol className="mt-4 space-y-2.5">
                {b.steps.map((s) => (
                  <li key={s.step} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3">
                    <span className="text-muted text-small text-pretty">
                      {s.step}
                      {s.note ? <span className="text-faint block">{s.note}</span> : null}
                    </span>
                    <span className="text-muted text-mono-sm font-mono whitespace-nowrap tabular-nums">{s.minutes} min</span>
                  </li>
                ))}
              </ol>
            </figure>
          </Margin>
        );
      })}
    </>
  );
}

const title = "font-display font-medium tracking-[-0.035em] text-balance";

export function EditorialPost({ data }: { data: Loaded }) {
  const { post, facts: f } = data;
  return (
    <LabFrame>
      <Back href={listPath(SLUG)} />
      <header className="pt-8 lg:pt-14">
        <h1 className={`${title} max-w-[17ch] text-[clamp(2.375rem,7.6vw,5.75rem)] leading-[0.98]`}>{post.title}</h1>
        <div className="mt-10 lg:mt-14 lg:pl-[14%]">
          <p className="text-ink max-w-[36ch] text-[clamp(1.25rem,2.2vw,1.625rem)] leading-[1.35] tracking-[-0.02em] text-pretty">{post.description}</p>
          <Filed post={post} className="mt-6" />
        </div>
      </header>

      <article className={`mt-14 lg:mt-24 lg:ml-[14%] ${measure}`}>
        <Blocks blocks={data.intro} opening />
        {data.sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-head`} className="mt-16 scroll-mt-24 lg:mt-20">
            <h2 id={`${s.id}-head`} className="font-display text-h2 mb-6 text-balance">{s.title}</h2>
            <Blocks
              blocks={s.blocks}
              pull={
                s.id === "who-is-waiting" ? (
                  <Margin>
                    <Pulled figure={span(f.fixed - f.first)}>
                      From the first sign at {clock(f.first)} to the fix at {clock(f.fixed)}, in the example morning.
                    </Pulled>
                  </Margin>
                ) : null
              }
            />
          </section>
        ))}
      </article>

      <section aria-labelledby="start" className="clear-both mt-20 lg:mt-28 lg:ml-[14%]">
        <h2 id="start" className={`${title} max-w-[16ch] text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.02]`}>{CLOSER.head}</h2>
        <p className={`${prose} ${measure} mt-5`}>{CLOSER.body}</p>
        <Actions className="mt-8" />
      </section>
    </LabFrame>
  );
}

export function EditorialList({ data }: { data: Loaded }) {
  const { post } = data;
  return (
    <LabFrame list>
      <header className="pt-12 sm:pt-16 lg:pt-20">
        <h1 className="font-display text-h2 text-balance">{LIST.title}</h1>
        <p className="text-muted mt-3 max-w-[62ch] text-pretty">{LIST.intro}</p>
      </header>

      {/* the newest post is the cover story; the list page's own heading steps back for it */}
      <article className="border-line mt-12 border-t pt-10 lg:mt-16 lg:pt-14">
        <h2 className={`${title} max-w-[17ch] text-[clamp(2.25rem,6.4vw,4.75rem)] leading-none`}>
          <Link href={postPath(SLUG)} className="hover:text-accent-text transition-colors">{post.title}</Link>
        </h2>
        <div className="mt-8 lg:mt-10 lg:pl-[14%]">
          <p className="text-ink max-w-[38ch] text-[clamp(1.125rem,1.9vw,1.375rem)] leading-[1.4] tracking-[-0.02em] text-pretty">{post.description}</p>
          <Filed post={post} className="mt-5" />
        </div>
      </article>

      <section aria-labelledby="coming" className="border-line mt-16 border-t pt-8 lg:mt-24 lg:pl-[14%]">
        <h2 id="coming" className="text-muted text-small">Coming in this series</h2>
        <ol className="mt-6 grid gap-x-16 gap-y-10 sm:grid-cols-2">
          {SAMPLES.map((sample) => (
            <li key={sample.title}>
              <h3 className="font-display text-h2 text-soft max-w-[22ch] font-medium text-balance">{sample.title}</h3>
              <Sample className="mt-4" />
            </li>
          ))}
        </ol>
      </section>
    </LabFrame>
  );
}
