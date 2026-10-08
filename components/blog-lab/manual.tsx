import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { formatDay } from "@/lib/blog";

import {
  clock,
  scheduled,
  span,
  toMinutes,
  type Block,
  type Loaded,
} from "./content";
import { Fact, Strip } from "./report";
import { Actions, Back, CLOSER, LIST, LabFrame, Sample } from "./shell";
import { ManualOutline } from "./manual-outline";
import {
  REAL_COVERS,
  SAMPLES,
  listPath,
  postPath,
  type Kind,
  type VariantSlug,
} from "./variants";

/* The two samples this file lays out: the manual, and the manual carrying the incident report's facts and its morning drawn to scale. */
type Shown = { data: Loaded; slug?: VariantSlug; report?: boolean };

/* The section whose list is a set of things to put in place, so it is drawn as one to tick. */
const CHECKLIST = "what-reduces-it-without-buying-anything";

const num = "font-mono text-mono-sm tabular-nums";
/* A manual's running text is a size under the other samples': 16px, held to the same count of characters. */
const text = "text-soft text-body text-pretty max-w-[31rem]";
/* Anything set apart from the running text sits in the site's own box: a hairline with the 12px corner. */
const box = "border-line max-w-[40rem] overflow-hidden rounded-lg border px-4";

/* The morning on one axis, a minute the same width everywhere, so the long
   gap is seen before the list under it is read. Only the times sit on the
   axis; what happened at each is the list's job, which keeps it legible in a
   pane of any width. */
function Scale({ data }: { data: Loaded }) {
  const f = data.facts;
  const at = (minute: number) =>
    ((minute - f.first) / (f.fixed - f.first)) * 100;
  const dot = { fail: "bg-fail", ok: "bg-accent", plain: "bg-ink" } as const;
  return (
    <div aria-hidden="true" className="border-line border-b pt-4 pb-5">
      <p className="text-muted text-small flex flex-wrap items-baseline justify-between gap-x-6">
        <span>
          Drawn to scale: {span(f.fixed - f.first)} from the first sign to the
          fix
        </span>
        <span>
          <span className="bg-ink mr-2 inline-block h-[3px] w-6 align-middle" />
          {span(f.found - f.started)} finding the cause
        </span>
      </p>
      <div className="relative mx-5 mt-4 h-16">
        <span className="bg-line absolute inset-x-0 top-1/2 h-px" />
        <span
          className="bg-ink absolute top-1/2 -mt-px h-[3px]"
          style={{
            left: `${at(f.started)}%`,
            width: `${at(f.found) - at(f.started)}%`,
          }}
        />
        {data.timeline.events.map((e, i) => (
          <span
            key={e.time}
            className="absolute inset-y-0 w-0"
            style={{ left: `${at(toMinutes(e.time))}%` }}
          >
            <span
              className={`absolute top-1/2 -mt-1 -ml-1 size-2 rounded-full ${dot[e.state ?? "plain"]}`}
            />
            <span
              className={`${num} text-muted absolute -translate-x-1/2 ${i % 2 === 0 ? "top-0" : "bottom-0"}`}
            >
              {e.time}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Surface({
  block,
  id,
  started,
  morning,
}: {
  block: Block;
  id: string;
  started: number;
  morning?: ReactNode;
}) {
  if (block.kind === "p") return null;
  if (block.kind === "timeline")
    return (
      (
        <div className={`${box} mt-5 ${morning ? "!max-w-none" : ""}`}>
          {morning}
          <table className="w-full text-left">
            <caption className="sr-only">{block.title}</caption>
            <tbody>
              {block.events.map((e) => (
                <tr
                  key={e.time}
                  className="border-line border-t align-baseline first:border-t-0"
                >
                  <td className={`${num} text-muted w-16 py-2`}>{e.time}</td>
                  <td className="w-4 py-2">
                    <span
                      aria-hidden="true"
                      className={`block size-1.5 -translate-y-0.5 rounded-full ${e.state === "fail" ? "bg-fail" : e.state === "ok" ? "bg-accent" : "bg-ink/30"}`}
                    />
                  </td>
                  <td className="text-ink text-small py-2 text-pretty">
                    {e.state ? (
                      <span className="sr-only">
                        {e.state === "fail" ? "Failed: " : "Recovered: "}
                      </span>
                    ) : null}
                    {e.what}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    );
  if (block.kind === "byhand") {
    const at = started + block.steps.reduce((sum, s) => sum + s.minutes, 0);
    return (
      <div className={`${box} mt-5`}>
        <table className="w-full text-left">
          <caption className="border-line border-b py-2.5 text-left">
            <span className="text-ink text-small font-medium">
              {block.title}
            </span>
            <span className="text-muted text-small">. {block.estimate}</span>
          </caption>
          <thead>
            <tr className="text-faint text-small">
              <th scope="col" className="py-2 font-normal">
                Step
              </th>
              <th scope="col" className="py-2 pl-3 text-right font-normal">
                Takes
              </th>
              <th scope="col" className="py-2 pl-3 text-right font-normal">
                By
              </th>
            </tr>
          </thead>
          <tbody>
            {scheduled(block.steps, started).map((s) => {
              return (
                <tr
                  key={s.step}
                  className="border-line border-t align-baseline"
                >
                  <td className="text-ink text-small py-2 text-pretty">
                    {s.step}
                    {s.note ? (
                      <span className="text-faint">
                        {" "}
                        ({s.note.replace(/\.$/, "")})
                      </span>
                    ) : null}
                  </td>
                  <td
                    className={`${num} text-muted py-2 pl-3 text-right whitespace-nowrap`}
                  >
                    {s.minutes} min
                  </td>
                  <td className={`${num} text-muted py-2 pl-3 text-right`}>
                    {clock(s.to)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-line border-t align-baseline">
              <td className="text-ink text-small py-2 font-medium">
                Total, estimated
              </td>
              <td
                className={`${num} text-ink py-2 pl-3 text-right whitespace-nowrap`}
              >
                {span(at - started)}
              </td>
              <td className={`${num} text-ink py-2 pl-3 text-right`}>
                {clock(at)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
  if (id === CHECKLIST)
    return (
      <ul className={`${box} mt-5`}>
        {block.items.map((item) => (
          <li key={item.lead} className="border-line border-t first:border-t-0">
            <label className="hover:bg-ink/[0.03] -mx-4 grid cursor-pointer grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-x-3 px-4 py-3 transition-colors">
              <input type="checkbox" className="accent-accent mt-1 size-4" />
              <span>
                <span className="text-ink text-small block font-medium">
                  {item.lead}
                </span>
                <span className="text-muted text-small block text-pretty">
                  {item.rest}
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    );
  return (
    <div className={`${box} mt-5`}>
      <dl className="-mb-px grid gap-x-8 sm:grid-cols-2">
        {block.items.map((item) => (
          <div key={item.lead} className="border-line border-b py-3">
            <dt className="text-ink text-small font-medium">
              {item.lead.replace(/\.$/, "")}
            </dt>
            <dd className="text-muted text-small text-pretty">{item.rest}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* A section shows its opening line and anything that can be scanned; the rest of its account is folded under them. */
function Entry({
  id,
  blocks,
  started,
  morning,
}: {
  id: string;
  blocks: Block[];
  started: number;
  morning?: ReactNode;
}) {
  const paragraphs = blocks.filter((b) => b.kind === "p");
  const [lead, ...rest] = paragraphs;
  return (
    <>
      {lead ? (
        <p className="text-ink text-body max-w-[31rem] text-pretty">
          {lead.children}
        </p>
      ) : null}
      {blocks.map((b, i) => (
        <Surface
          key={i}
          block={b}
          id={id}
          started={started}
          morning={morning}
        />
      ))}
      {rest.length > 0 ? (
        <details className="group mt-4">
          <summary className="text-muted hover:text-ink text-small inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 transition-colors [&::-webkit-details-marker]:hidden">
            <ChevronDown
              aria-hidden="true"
              className="size-4 transition-transform group-open:rotate-180"
            />
            <span className="group-open:hidden">
              The full account, {rest.length} more{" "}
              {rest.length === 1 ? "paragraph" : "paragraphs"}
            </span>
            <span className="hidden group-open:inline">Fold the account</span>
          </summary>
          <div className="space-y-4 pt-1 pb-2">
            {rest.map((b, i) => (
              <p key={i} className={text}>
                {b.children}
              </p>
            ))}
          </div>
        </details>
      ) : null}
    </>
  );
}

const pane = "px-5 sm:px-8 lg:px-10";

export function ManualPost({
  data,
  slug = "field-manual",
  report = false,
}: Shown) {
  const { post, facts: f } = data;
  const parts = [
    { id: "example", title: data.timeline.title, blocks: data.intro },
    ...data.sections,
  ];
  const outline = parts.map((p) => ({
    id: p.id,
    title: p.title,
    points: p.blocks.flatMap((b) =>
      b.kind === "ul" ? b.items.map((i) => i.lead.replace(/\.$/, "")) : [],
    ),
  }));
  return (
    <LabFrame pad="none">
      <div className="border-line border-t lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        {/* the outline never leaves: a column on a wide screen, a strip that scrolls sideways inside itself on a small one */}
        <aside className="border-line bg-bg max-lg:sticky max-lg:top-16 max-lg:z-10 max-lg:border-b lg:border-r">
          <nav
            aria-label="Outline"
            className="max-lg:overflow-x-auto max-lg:px-5 sm:max-lg:px-8 lg:sticky lg:top-16 lg:max-h-[calc(100svh-4rem)] lg:overflow-y-auto lg:px-6 lg:py-6"
          >
            <Back href={listPath(slug)} className="max-lg:hidden" />
            <div className="lg:mt-3">
              <ManualOutline entries={outline} />
            </div>
          </nav>
        </aside>

        <article className="min-w-0">
          <header className={`${pane} border-line border-b py-8 lg:py-10`}>
            <Back href={listPath(slug)} className="-mt-3 lg:hidden" />
            <h1 className="font-display text-h2 max-w-[30ch] text-balance">
              {post.title}
            </h1>
            <p className="text-muted mt-3 max-w-[31rem] text-pretty">
              {post.description}
            </p>
            {report ? (
              <div className={`${box} mt-6 !max-w-none`}>
                <dl className="-mb-px grid gap-x-10 xl:grid-cols-2">
                  <Fact term="What failed">{f.whatFailed}</Fact>
                  <Fact term="Who waited">
                    {f.waiting
                      .map((who, i) =>
                        i ? who[0].toLowerCase() + who.slice(1) : who,
                      )
                      .join(", ")}
                  </Fact>
                  <Fact term="First sign">
                    <span className={num}>{clock(f.first)}</span>
                  </Fact>
                  <Fact term="Cause found">
                    <span className={num}>{clock(f.found)}</span>,{" "}
                    {span(f.found - f.started)} after the engineer started
                  </Fact>
                  <Fact term="Fixed">
                    <span className={num}>{clock(f.fixed)}</span>
                  </Fact>
                  <Fact term="Wrong for">{span(f.fixed - f.first)}</Fact>
                  <Fact term="Published">
                    <time dateTime={post.date}>{formatDay(post.date)}</time>
                  </Fact>
                  <Fact term="Reading time">{post.minutes} min in full</Fact>
                </dl>
              </div>
            ) : (
              <dl className="text-small mt-5 flex flex-wrap gap-x-8 gap-y-2">
                {[
                  [
                    "Published",
                    <time key="d" dateTime={post.date}>
                      {formatDay(post.date)}
                    </time>,
                  ],
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
            )}
          </header>
          {parts.map((p, i) => (
            <section
              key={p.id}
              id={p.id}
              aria-labelledby={`${p.id}-head`}
              className={`${pane} border-line scroll-mt-28 border-b py-7 lg:scroll-mt-16 lg:py-8`}
            >
              <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
                <h2
                  id={`${p.id}-head`}
                  className="font-display text-h3 flex items-baseline gap-3"
                >
                  <span
                    aria-hidden="true"
                    className={`${num} text-faint font-normal`}
                  >
                    {i + 1}
                  </span>
                  {p.title}
                </h2>
                {report ? (
                  <Strip
                    id={p.id}
                    data={data}
                    className="w-44 max-lg:ml-[1.375rem] max-lg:mb-2"
                  />
                ) : null}
              </div>
              <div className="lg:pl-[1.375rem]">
                <Entry
                  id={p.id}
                  blocks={p.blocks}
                  started={f.started}
                  morning={report ? <Scale data={data} /> : undefined}
                />
              </div>
            </section>
          ))}
          <section aria-labelledby="start" className={`${pane} py-8 lg:py-10`}>
            <h2 id="start" className="font-display text-h3">
              {CLOSER.head}
            </h2>
            <p className={`${text} mt-2`}>{CLOSER.body}</p>
            <Actions className="mt-5" />
          </section>
        </article>
      </div>
    </LabFrame>
  );
}

const KIND: Record<Kind, string> = {
  table: "Tables",
  job: "Jobs",
  check: "Checks",
  dashboard: "Dashboards",
};
const cols =
  "sm:grid sm:grid-cols-[2rem_minmax(0,1fr)_11rem_6.5rem_4rem] sm:gap-x-5";

export function ManualList({
  data,
  slug = "field-manual",
  report = false,
}: Shown) {
  const { post, facts: f } = data;
  const rows = [
    { title: post.title, covers: REAL_COVERS, real: true },
    ...SAMPLES.map((s) => ({ ...s, real: false })),
  ];
  const kinds = Object.keys(KIND) as Kind[];
  return (
    <LabFrame list pad="none">
      <div className="border-line border-t lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="border-line max-lg:border-b lg:border-r">
          <div className={`${pane} py-8 lg:sticky lg:top-16 lg:px-6`}>
            <h1 className="font-display text-h2 text-balance">{LIST.title}</h1>
            <p className="text-muted text-small mt-3 text-pretty">
              {LIST.intro}
            </p>
            <div className={`${box} mt-6`}>
              <dl className="text-small -mb-px">
                {kinds.map((k) => (
                  <div
                    key={k}
                    className="border-line flex justify-between border-b py-2"
                  >
                    <dt className="text-muted">{KIND[k]}</dt>
                    <dd className={`${num} text-ink`}>
                      {rows.filter((r) => r.covers.includes(k)).length}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </aside>
        <div className={`${pane} min-w-0 py-8 pb-16 lg:pb-24`}>
          <div className="border-line overflow-hidden rounded-lg border px-4">
            <div
              aria-hidden="true"
              className={`${cols} text-faint text-small border-line border-b py-3 max-sm:hidden`}
            >
              <span>No.</span>
              <span>Post</span>
              <span>Covers</span>
              <span>Published</span>
              <span className="text-right">Read</span>
            </div>
            <ol className="-mb-px">
              {rows.map((row, i) => (
                <li
                  key={row.title}
                  className={`${cols} border-line items-baseline border-b py-3.5 max-sm:space-y-1.5`}
                >
                  <span
                    aria-hidden="true"
                    className={`${num} text-faint max-sm:hidden`}
                  >
                    {i + 1}
                  </span>
                  <h2
                    className={`text-body text-pretty ${row.real ? "text-ink font-medium" : "text-muted"}`}
                  >
                    {row.real ? (
                      <Link
                        href={postPath(slug)}
                        className="hover:text-accent-text underline decoration-ink/30 underline-offset-4 transition-colors"
                      >
                        {row.title}
                      </Link>
                    ) : (
                      row.title
                    )}
                    {report && row.real ? (
                      <span className="text-muted text-small mt-1 block font-normal text-pretty">
                        {f.whatFailed} Wrong for {span(f.fixed - f.first)},
                        fixed at <span className={num}>{clock(f.fixed)}</span>.
                      </span>
                    ) : null}
                  </h2>
                  <p className="text-muted text-small">
                    {row.covers.map((k) => KIND[k]).join(", ")}
                  </p>
                  {row.real ? (
                    <>
                      <p className="text-muted text-small tabular-nums">
                        <time dateTime={post.date}>{formatDay(post.date)}</time>
                      </p>
                      <p className="text-muted text-small tabular-nums sm:text-right">
                        {post.minutes} min
                      </p>
                    </>
                  ) : (
                    <p className="sm:col-span-2">
                      <Sample />
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </LabFrame>
  );
}
