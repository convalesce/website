import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { formatDay } from "@/lib/blog";

import { clock, scheduled, span, type Block, type Loaded } from "./content";
import { Actions, Back, CLOSER, LIST, LabFrame, Sample } from "./shell";
import { ManualOutline } from "./manual-outline";
import { REAL_COVERS, SAMPLES, listPath, postPath, type Kind } from "./variants";

const SLUG = "field-manual";

/* The section whose list is a set of things to put in place, so it is drawn as one to tick. */
const CHECKLIST = "what-reduces-it-without-buying-anything";

const num = "font-mono text-mono-sm tabular-nums";
/* A manual's running text is a size under the other samples': 16px, held to the same count of characters. */
const text = "text-soft text-body text-pretty max-w-[31rem]";

function Surface({ block, id, started }: { block: Block; id: string; started: number }) {
  if (block.kind === "p") return null;
  if (block.kind === "timeline")
    return (
      <table className="border-line mt-5 w-full max-w-[40rem] border-y text-left">
        <caption className="sr-only">{block.title}</caption>
        <tbody>
          {block.events.map((e) => (
            <tr key={e.time} className="border-line border-t align-baseline first:border-t-0">
              <td className={`${num} text-muted w-16 py-2`}>{e.time}</td>
              <td className="w-4 py-2">
                <span aria-hidden="true" className={`block size-1.5 -translate-y-0.5 rounded-full ${e.state === "fail" ? "bg-fail" : e.state === "ok" ? "bg-accent" : "bg-ink/30"}`} />
              </td>
              <td className="text-ink text-small py-2 text-pretty">
                {e.state ? <span className="sr-only">{e.state === "fail" ? "Failed: " : "Recovered: "}</span> : null}
                {e.what}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  if (block.kind === "byhand") {
    const at = started + block.steps.reduce((sum, s) => sum + s.minutes, 0);
    return (
      <table className="border-line mt-5 w-full max-w-[40rem] border-y text-left">
        <caption className="border-line border-b py-2 text-left">
          <span className="text-ink text-small font-medium">{block.title}</span>
          <span className="text-muted text-small">. {block.estimate}</span>
        </caption>
        <thead>
          <tr className="text-faint text-small">
            <th scope="col" className="py-2 font-normal">Step</th>
            <th scope="col" className="py-2 pl-3 text-right font-normal">Takes</th>
            <th scope="col" className="py-2 pl-3 text-right font-normal">By</th>
          </tr>
        </thead>
        <tbody>
          {scheduled(block.steps, started).map((s) => {
            return (
              <tr key={s.step} className="border-line border-t align-baseline">
                <td className="text-ink text-small py-2 text-pretty">
                  {s.step}
                  {s.note ? <span className="text-faint"> ({s.note.replace(/\.$/, "")})</span> : null}
                </td>
                <td className={`${num} text-muted py-2 pl-3 text-right whitespace-nowrap`}>{s.minutes} min</td>
                <td className={`${num} text-muted py-2 pl-3 text-right`}>{clock(s.to)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-line border-t align-baseline">
            <td className="text-ink text-small py-2 font-medium">Total, estimated</td>
            <td className={`${num} text-ink py-2 pl-3 text-right whitespace-nowrap`}>{span(at - started)}</td>
            <td className={`${num} text-ink py-2 pl-3 text-right`}>{clock(at)}</td>
          </tr>
        </tfoot>
      </table>
    );
  }
  if (id === CHECKLIST)
    return (
      <ul className="border-line mt-5 max-w-[40rem] border-y">
        {block.items.map((item) => (
          <li key={item.lead} className="border-line border-t first:border-t-0">
            <label className="hover:bg-ink/[0.03] grid cursor-pointer grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-x-3 py-3 transition-colors">
              <input type="checkbox" className="accent-accent mt-1 size-4" />
              <span>
                <span className="text-ink text-small block font-medium">{item.lead}</span>
                <span className="text-muted text-small block text-pretty">{item.rest}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    );
  return (
    <dl className="border-line mt-5 grid max-w-[40rem] gap-x-8 border-t sm:grid-cols-2">
      {block.items.map((item) => (
        <div key={item.lead} className="border-line border-b py-3">
          <dt className="text-ink text-small font-medium">{item.lead.replace(/\.$/, "")}</dt>
          <dd className="text-muted text-small text-pretty">{item.rest}</dd>
        </div>
      ))}
    </dl>
  );
}

/* A section shows its opening line and anything that can be scanned; the rest of its account is folded under them. */
function Entry({ id, blocks, started }: { id: string; blocks: Block[]; started: number }) {
  const paragraphs = blocks.filter((b) => b.kind === "p");
  const [lead, ...rest] = paragraphs;
  return (
    <>
      {lead ? <p className="text-ink text-body max-w-[31rem] text-pretty">{lead.children}</p> : null}
      {blocks.map((b, i) => <Surface key={i} block={b} id={id} started={started} />)}
      {rest.length > 0 ? (
        <details className="group mt-4">
          <summary className="text-muted hover:text-ink text-small inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 transition-colors [&::-webkit-details-marker]:hidden">
            <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
            <span className="group-open:hidden">The full account, {rest.length} more {rest.length === 1 ? "paragraph" : "paragraphs"}</span>
            <span className="hidden group-open:inline">Fold the account</span>
          </summary>
          <div className="space-y-4 pt-1 pb-2">
            {rest.map((b, i) => <p key={i} className={text}>{b.children}</p>)}
          </div>
        </details>
      ) : null}
    </>
  );
}

const pane = "px-5 sm:px-8 lg:px-10";

export function ManualPost({ data }: { data: Loaded }) {
  const { post, facts: f } = data;
  const parts = [{ id: "example", title: data.timeline.title, blocks: data.intro }, ...data.sections];
  const outline = parts.map((p) => ({
    id: p.id,
    title: p.title,
    points: p.blocks.flatMap((b) => (b.kind === "ul" ? b.items.map((i) => i.lead.replace(/\.$/, "")) : [])),
  }));
  return (
    <LabFrame pad="none">
      <div className="border-line border-t lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        {/* the outline never leaves: a column on a wide screen, a strip that scrolls sideways inside itself on a small one */}
        <aside className="border-line bg-bg max-lg:sticky max-lg:top-16 max-lg:z-10 max-lg:border-b lg:border-r">
          <nav aria-label="Outline" className="max-lg:overflow-x-auto max-lg:px-5 sm:max-lg:px-8 lg:sticky lg:top-16 lg:max-h-[calc(100svh-4rem)] lg:overflow-y-auto lg:px-6 lg:py-6">
            <Back href={listPath(SLUG)} className="max-lg:hidden" />
            <div className="lg:mt-3">
              <ManualOutline entries={outline} />
            </div>
          </nav>
        </aside>

        <article className="min-w-0">
          <header className={`${pane} border-line border-b py-8 lg:py-10`}>
            <Back href={listPath(SLUG)} className="-mt-3 lg:hidden" />
            <h1 className="font-display text-h2 max-w-[30ch] text-balance">{post.title}</h1>
            <p className="text-muted mt-3 max-w-[31rem] text-pretty">{post.description}</p>
            <dl className="text-small mt-5 flex flex-wrap gap-x-8 gap-y-2">
              {[
                ["Published", <time key="d" dateTime={post.date}>{formatDay(post.date)}</time>],
                ["Reading", `${post.minutes} min in full`],
                ["Traced by hand", span(f.handTotal)],
                ["First sign to fix", span(f.fixed - f.first)],
              ].map(([term, value]) => (
                <div key={String(term)} className="flex gap-2">
                  <dt className="text-faint">{term}</dt>
                  <dd className="text-ink tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </header>
          {parts.map((p, i) => (
            <section key={p.id} id={p.id} aria-labelledby={`${p.id}-head`} className={`${pane} border-line scroll-mt-28 border-b py-7 lg:scroll-mt-16 lg:py-8`}>
              <h2 id={`${p.id}-head`} className="font-display text-h3 mb-2.5 flex items-baseline gap-3">
                <span aria-hidden="true" className={`${num} text-faint font-normal`}>{i + 1}</span>
                {p.title}
              </h2>
              <div className="lg:pl-[1.375rem]">
                <Entry id={p.id} blocks={p.blocks} started={f.started} />
              </div>
            </section>
          ))}
          <section aria-labelledby="start" className={`${pane} py-8 lg:py-10`}>
            <h2 id="start" className="font-display text-h3">{CLOSER.head}</h2>
            <p className={`${text} mt-2`}>{CLOSER.body}</p>
            <Actions className="mt-5" />
          </section>
        </article>
      </div>
    </LabFrame>
  );
}

const KIND: Record<Kind, string> = { table: "Tables", job: "Jobs", check: "Checks", dashboard: "Dashboards" };
const cols = "sm:grid sm:grid-cols-[2rem_minmax(0,1fr)_11rem_6.5rem_4rem] sm:gap-x-5";

export function ManualList({ data }: { data: Loaded }) {
  const { post } = data;
  const rows = [{ title: post.title, covers: REAL_COVERS, real: true }, ...SAMPLES.map((s) => ({ ...s, real: false }))];
  const kinds = Object.keys(KIND) as Kind[];
  return (
    <LabFrame list pad="none">
      <div className="border-line border-t lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="border-line max-lg:border-b lg:border-r">
          <div className={`${pane} py-8 lg:sticky lg:top-16 lg:px-6`}>
            <h1 className="font-display text-h2 text-balance">{LIST.title}</h1>
            <p className="text-muted text-small mt-3 text-pretty">{LIST.intro}</p>
            <dl className="border-line text-small mt-6 border-t">
              {kinds.map((k) => (
                <div key={k} className="border-line flex justify-between border-b py-2">
                  <dt className="text-muted">{KIND[k]}</dt>
                  <dd className={`${num} text-ink`}>{rows.filter((r) => r.covers.includes(k)).length}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
        <div className={`${pane} min-w-0 pt-2 pb-16 lg:pb-24`}>
          <div aria-hidden="true" className={`${cols} text-faint text-small border-line border-b py-3 max-sm:hidden`}>
            <span>No.</span>
            <span>Post</span>
            <span>Covers</span>
            <span>Published</span>
            <span className="text-right">Read</span>
          </div>
          <ol>
            {rows.map((row, i) => (
              <li key={row.title} className={`${cols} border-line items-baseline border-b py-3.5 max-sm:space-y-1.5`}>
                <span aria-hidden="true" className={`${num} text-faint max-sm:hidden`}>{i + 1}</span>
                <h2 className={`text-body text-pretty ${row.real ? "text-ink font-medium" : "text-muted"}`}>
                  {row.real ? (
                    <Link href={postPath(SLUG)} className="hover:text-accent-text underline decoration-ink/30 underline-offset-4 transition-colors">{row.title}</Link>
                  ) : (
                    row.title
                  )}
                </h2>
                <p className="text-muted text-small">{row.covers.map((k) => KIND[k]).join(", ")}</p>
                {row.real ? (
                  <>
                    <p className="text-muted text-small tabular-nums"><time dateTime={post.date}>{formatDay(post.date)}</time></p>
                    <p className="text-muted text-small tabular-nums sm:text-right">{post.minutes} min</p>
                  </>
                ) : (
                  <p className="sm:col-span-2"><Sample /></p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </LabFrame>
  );
}
