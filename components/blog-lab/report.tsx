import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { formatDay } from "@/lib/blog";

import {
  clock,
  scheduled,
  span,
  toMinutes,
  type Block,
  type Facts,
  type Loaded,
} from "./content";
import {
  Actions,
  Back,
  CLOSER,
  LIST,
  LabFrame,
  Sample,
  measure,
  prose,
} from "./shell";
import { SAMPLES, listPath, postPath } from "./variants";

const SLUG = "incident-report";

/* The part of the morning each section is about, as minutes past midnight.
   A section left out is about no part of it. */
const windowOf = (
  id: string,
  f: Facts,
): { from: number; to: number } | "after" | null =>
  ({
    "what-it-looks-like-from-the-inside": { from: f.first, to: f.started },
    "where-the-time-goes": { from: f.started, to: f.found },
    "who-is-waiting": { from: f.first, to: f.fixed },
    "why-the-cost-stays-hidden": "after" as const,
  })[id] ?? null;

const pct = (minute: number, f: Facts) =>
  ((minute - f.first) / (f.fixed - f.first)) * 100;

/* The morning as one line, each section's share of it marked. */
export function Strip({
  id,
  data,
  className = "mt-4 max-w-60",
}: {
  id: string;
  data: Loaded;
  className?: string;
}) {
  const f = data.facts;
  const win = windowOf(id, f);
  if (!win) return null;
  const from = win === "after" ? 100 : pct(win.from, f);
  const to = win === "after" ? 100 : pct(win.to, f);
  return (
    <p className={className}>
      <span aria-hidden="true" className="bg-line relative block h-px">
        {data.timeline.events.map((e) => (
          <span
            key={e.time}
            className="bg-faint absolute -top-1 h-[9px] w-px"
            style={{ left: `${pct(toMinutes(e.time), f)}%` }}
          />
        ))}
        <span
          className="bg-ink absolute -top-px h-[3px]"
          style={{ left: `${from}%`, width: `${Math.max(to - from, 0)}%` }}
        />
        {win === "after" ? (
          <span className="bg-ink absolute -top-[3px] right-0 size-[7px] rounded-full" />
        ) : null}
      </span>
      <span className="text-muted text-mono-sm mt-3 block font-mono tabular-nums">
        {win === "after"
          ? `after ${clock(f.fixed)}`
          : `${clock(win.from)} to ${clock(win.to)}`}
      </span>
    </p>
  );
}

/* The morning drawn to scale: a minute is the same width everywhere on the
   line, so the long gap is seen and not read. Below the wide layout it is a list. */
export function Morning({
  data,
  className = "border-line mt-12 border-t pt-6 lg:mt-16",
}: {
  data: Loaded;
  className?: string;
}) {
  const f = data.facts;
  const dot = { fail: "bg-fail", ok: "bg-accent", plain: "bg-ink" } as const;
  return (
    <figure className={className}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="text-ink font-medium">{data.timeline.title}</span>
        <span className="text-muted text-small">
          Drawn to scale: {span(f.fixed - f.first)} from the first sign to the
          fix
        </span>
      </figcaption>
      <ol className="mt-4 lg:relative lg:mt-6 lg:h-64">
        <li
          aria-hidden="true"
          className="bg-line absolute inset-x-0 top-1/2 h-px max-lg:hidden"
        />
        <li
          aria-hidden="true"
          className="bg-ink absolute top-1/2 -mt-px h-[3px] max-lg:hidden"
          style={{
            left: `${pct(f.started, f)}%`,
            width: `${pct(f.found, f) - pct(f.started, f)}%`,
          }}
        />
        {data.timeline.events.map((e, i) => {
          const at = pct(toMinutes(e.time), f);
          const end = at > 60;
          const above = i % 2 === 0;
          const place: CSSProperties = end
            ? { right: `${100 - at}%` }
            : { left: `${at}%` };
          return (
            <li
              key={e.time}
              style={place}
              className={`border-line grid grid-cols-[4.5rem_auto_minmax(0,1fr)] items-baseline gap-x-3 border-t py-3 first:border-t-0 lg:absolute lg:inset-y-0 lg:block lg:w-48 lg:border-0 lg:py-0 ${end ? "lg:text-right" : ""}`}
            >
              <span
                aria-hidden="true"
                className={`bg-faint absolute top-[calc(50%-1.25rem)] h-10 w-px max-lg:hidden ${end ? "right-0" : "left-0"}`}
              />
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full max-lg:order-2 max-lg:-translate-y-0.5 lg:absolute lg:top-[calc(50%-4px)] lg:size-[9px] ${dot[e.state ?? "plain"]} ${end ? "lg:-right-1" : "lg:-left-1"}`}
              />
              <div
                className={`contents lg:absolute lg:block ${end ? "lg:right-3" : "lg:left-3"} ${above ? "lg:bottom-[calc(50%+0.75rem)]" : "lg:top-[calc(50%+0.75rem)]"}`}
              >
                <time className="text-ink text-mono block font-mono tabular-nums max-lg:order-1">
                  {e.time}
                </time>
                <span className="text-muted text-small block text-pretty max-lg:order-3 lg:mt-1">
                  {e.state ? (
                    <span className="sr-only">
                      {e.state === "fail" ? "Failed: " : "Recovered: "}
                    </span>
                  ) : null}
                  {e.what}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="text-muted text-small max-lg:border-line max-lg:mt-1 max-lg:border-t max-lg:pt-3">
        <span
          aria-hidden="true"
          className="bg-ink mr-2 inline-block h-[3px] w-6 align-middle"
        />
        {span(f.found - f.started)} of it spent finding the cause
      </p>
    </figure>
  );
}

function Blocks({ blocks, data }: { blocks: Block[]; data: Loaded }) {
  return (
    <div className={`${measure} space-y-5`}>
      {blocks.map((b, i) => {
        if (b.kind === "p")
          return (
            <p key={i} className={prose}>
              {b.children}
            </p>
          );
        if (b.kind === "ul")
          return (
            <ul
              key={i}
              className={`${prose} marker:text-faint list-disc space-y-2 pl-5`}
            >
              {b.items.map((item, j) => (
                <li key={j} className="pl-1">
                  {item.all}
                </li>
              ))}
            </ul>
          );
        if (b.kind === "timeline") return null;
        const at =
          data.facts.started + b.steps.reduce((sum, s) => sum + s.minutes, 0);
        return (
          <table
            key={i}
            className="border-line !my-9 w-full border-y text-left"
          >
            <caption className="border-line border-b py-3 text-left">
              <span className="text-ink block font-medium">{b.title}</span>
              <span className="text-muted text-small block">{b.estimate}</span>
            </caption>
            <thead>
              <tr className="text-faint text-small">
                <th scope="col" className="py-2.5 pr-3 font-normal">
                  Starts
                </th>
                <th scope="col" className="py-2.5 font-normal">
                  Step
                </th>
                <th scope="col" className="py-2.5 pl-3 text-right font-normal">
                  Takes
                </th>
              </tr>
            </thead>
            <tbody>
              {scheduled(b.steps, data.facts.started).map((s) => {
                return (
                  <tr
                    key={s.step}
                    className="border-line border-t align-baseline"
                  >
                    <td className="text-muted text-mono-sm py-3 pr-3 font-mono tabular-nums">
                      {clock(s.from)}
                    </td>
                    <td className="text-ink text-small py-3 text-pretty">
                      {s.step}
                      {s.note ? (
                        <span className="text-faint block">{s.note}</span>
                      ) : null}
                    </td>
                    <td className="text-muted text-mono-sm py-3 pl-3 text-right font-mono whitespace-nowrap tabular-nums">
                      {s.minutes} min
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-line border-t align-baseline">
                <td className="text-ink text-mono-sm py-3.5 pr-3 font-mono tabular-nums">
                  {clock(at)}
                </td>
                <td className="text-ink py-3.5 font-medium">Cause found</td>
                <td className="text-ink text-mono py-3.5 pl-3 text-right font-mono whitespace-nowrap tabular-nums">
                  {span(at - data.facts.started)}
                </td>
              </tr>
            </tfoot>
          </table>
        );
      })}
    </div>
  );
}

/* A report's section: the heading and its place in the morning held in the
   margin, the account beside it, a rule across both. */
function Row({
  id,
  head,
  children,
}: {
  id?: string;
  head: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-line grid scroll-mt-24 gap-x-16 gap-y-6 border-t py-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:py-14"
    >
      <div className="lg:sticky lg:top-24 lg:self-start">{head}</div>
      {children}
    </section>
  );
}

export function Fact({
  term,
  children,
}: {
  term: string;
  children: ReactNode;
}) {
  return (
    <div className="border-line grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-4 border-b py-3 sm:grid-cols-[9.5rem_minmax(0,1fr)]">
      <dt className="text-faint text-small">{term}</dt>
      <dd className="text-ink text-small text-pretty">{children}</dd>
    </div>
  );
}

const time = "font-mono text-mono-sm tabular-nums";

export function ReportPost({ data }: { data: Loaded }) {
  const { post, facts: f } = data;
  return (
    <LabFrame>
      <Back href={listPath(SLUG)} />
      <header className="pt-6 lg:pt-10">
        <h1 className="font-display text-display max-w-[21ch] text-balance">
          {post.title}
        </h1>
        <p className="text-ink text-lead mt-6 max-w-[46ch] text-pretty">
          {post.description}
        </p>
        <dl className="border-line mt-10 grid gap-x-16 border-t lg:grid-cols-2">
          <Fact term="What failed">{f.whatFailed}</Fact>
          <Fact term="Who waited">
            {f.waiting
              .map((who, i) => (i ? who[0].toLowerCase() + who.slice(1) : who))
              .join(", ")}
          </Fact>
          <Fact term="First sign">
            <span className={time}>{clock(f.first)}</span>
          </Fact>
          <Fact term="Cause found">
            <span className={time}>{clock(f.found)}</span>,{" "}
            {span(f.found - f.started)} after the engineer started
          </Fact>
          <Fact term="Fixed">
            <span className={time}>{clock(f.fixed)}</span>
          </Fact>
          <Fact term="Wrong for">{span(f.fixed - f.first)}</Fact>
          <Fact term="Filed">
            <time dateTime={post.date}>{formatDay(post.date)}</time>
          </Fact>
          <Fact term="Reading time">{post.minutes} min</Fact>
        </dl>
      </header>

      <Morning data={data} />

      <article className="mt-12 lg:mt-16">
        <Row
          head={
            <p className="text-muted text-small max-w-60 text-pretty">
              The first in a series. Each later post is the report of one
              failure.
            </p>
          }
        >
          <Blocks blocks={data.intro} data={data} />
        </Row>
        {data.sections.map((s) => (
          <Row
            key={s.id}
            id={s.id}
            head={
              <>
                <h2 className="font-display text-h2 max-w-60 text-balance">
                  {s.title}
                </h2>
                <Strip id={s.id} data={data} />
              </>
            }
          >
            <Blocks blocks={s.blocks} data={data} />
          </Row>
        ))}
        <Row
          head={
            <h2 className="font-display text-h2 max-w-60 text-balance">
              {CLOSER.head}
            </h2>
          }
        >
          <div>
            <p className={`${prose} ${measure}`}>{CLOSER.body}</p>
            <Actions className="mt-7" />
          </div>
        </Row>
      </article>
    </LabFrame>
  );
}

const cols =
  "lg:grid lg:grid-cols-[7rem_minmax(0,1fr)_15rem_7rem_7.5rem] lg:gap-x-8";

export function ReportList({ data }: { data: Loaded }) {
  const { post, facts: f } = data;
  return (
    <LabFrame list>
      <header className="pt-12 sm:pt-16 lg:pt-24">
        <h1 className="font-display text-display max-w-[20ch] text-balance">
          {LIST.title}
        </h1>
        <p className="text-muted mt-6 max-w-[62ch] text-pretty">{LIST.intro}</p>
      </header>
      <div className="mt-12 lg:mt-16">
        <div
          aria-hidden="true"
          className={`text-faint text-small border-line border-b pb-3 max-lg:hidden ${cols}`}
        >
          <span>Filed</span>
          <span>Report</span>
          <span>What failed</span>
          <span>Wrong for</span>
          <span>Outcome</span>
        </div>
        <ol>
          <li className={`border-line border-b py-7 ${cols} max-lg:space-y-3`}>
            <time
              dateTime={post.date}
              className="text-muted text-small block tabular-nums lg:pt-1.5"
            >
              {formatDay(post.date)}
            </time>
            <div>
              <h2 className="font-display text-h2 text-balance">
                <Link
                  href={postPath(SLUG)}
                  className="hover:text-accent-text transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-muted mt-3 max-w-[60ch] text-pretty">
                {post.description}
              </p>
            </div>
            <p className="text-soft text-small text-pretty lg:pt-1.5">
              <span className="text-faint lg:hidden">What failed: </span>
              {f.whatFailed}
            </p>
            <p className="text-soft text-small tabular-nums lg:pt-1.5">
              <span className="text-faint lg:hidden">Wrong for: </span>
              {span(f.fixed - f.first)}
            </p>
            <p className="text-soft text-small flex items-baseline gap-2 lg:pt-1.5">
              <span
                aria-hidden="true"
                className="bg-accent size-1.5 -translate-y-0.5 rounded-full"
              />
              Fixed at <span className={time}>{clock(f.fixed)}</span>
            </p>
          </li>
          {SAMPLES.map((sample) => (
            <li
              key={sample.title}
              className={`border-line border-b py-6 ${cols} max-lg:space-y-3`}
            >
              <div className="lg:pt-1">
                <Sample />
              </div>
              <h2 className="font-display text-h3 text-muted max-w-[44ch] text-balance">
                {sample.title}
              </h2>
              <p className="text-faint text-small lg:col-span-3 lg:pt-1">
                Report not yet filed
              </p>
            </li>
          ))}
        </ol>
      </div>
    </LabFrame>
  );
}
