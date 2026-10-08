import {
  Boxes,
  ChartColumn,
  Database,
  FileCode2,
  GitCommitHorizontal,
  LayoutDashboard,
  Layers,
  MessagesSquare,
  Radio,
  ScrollText,
  ShieldCheck,
  Sheet,
  Table2,
  Waypoints,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { LineageBackdrop } from "@/components/ui/lineage-backdrop";

import { span, type Block, type Loaded } from "./content";
import { Actions, Back, CLOSER, Filed, LIST, LabFrame, Sample, measure, prose } from "./shell";
import { REAL_COVERS, SAMPLES, listPath, postPath, type Kind } from "./variants";

const SLUG = "lineage";

/* The same drawing as the backdrop behind the home page: a small square tile
   with the asset's mark, joined by hairline curves that leave one tile's right
   side and enter the next one's left. Here it is in the foreground, so the
   tile is larger and the ink stronger. */
type Tone = "plain" | "fail" | "wait" | "ok" | "ghost";

const tiles: Record<Tone, string> = {
  plain: "border-ink/30 text-ink/80",
  fail: "border-fail text-fail bg-fail-soft",
  wait: "border-ink/30 text-ink/80",
  ok: "border-accent/60 text-accent-text",
  ghost: "border-ink/25 text-faint border-dashed",
};

function Tile({ mark: Mark, tone = "plain", className = "" }: { mark: LucideIcon; tone?: Tone; className?: string }) {
  return (
    <span aria-hidden="true" className={`bg-bg flex size-7 shrink-0 items-center justify-center rounded-[4px] border ${tiles[tone]} ${className}`}>
      <Mark className="size-3.5" strokeWidth={1.4} />
    </span>
  );
}

/* A curve between two points given as shares of the sheet, the backdrop's own. */
const curve = (ax: number, ay: number, bx: number, by: number) => {
  const mid = (ax + bx) / 2;
  return `M${ax} ${ay} C${mid} ${ay} ${mid} ${by} ${bx} ${by}`;
};

/* The sheet is stretched to fit, so every line is held at one pixel; colours are the theme's own. */
const wire = "stroke-1 [vector-effect:non-scaling-stroke]";
const wires = {
  plain: `${wire} stroke-ink/25`,
  hit: `${wire} stroke-fail [stroke-dasharray:4_5]`,
  ok: `${wire} stroke-accent/70`,
  tap: `${wire} stroke-ink/30 [stroke-dasharray:3_5]`,
} as const;

/* The pipeline this failure sits in, as the post tells it: a number is wrong
   where people read it, and two other things read the same model. */
const PIPE: readonly { id: string; x: number; y: number; mark: LucideIcon; name: string; tone?: Tone; says?: string }[] = [
  { id: "a1", x: 4, y: 26, mark: Database, name: "Source" },
  { id: "a2", x: 4, y: 74, mark: Radio, name: "Source" },
  { id: "b1", x: 21, y: 26, mark: Workflow, name: "Job" },
  { id: "b2", x: 21, y: 74, mark: Workflow, name: "Job" },
  { id: "c1", x: 39, y: 26, mark: Table2, name: "Table" },
  { id: "c2", x: 39, y: 74, mark: Sheet, name: "Table" },
  { id: "d", x: 57, y: 50, mark: FileCode2, name: "Transform" },
  { id: "e", x: 75, y: 50, mark: Layers, name: "Model" },
  { id: "f1", x: 96, y: 18, mark: LayoutDashboard, name: "Dashboard", tone: "fail", says: "The number looks low" },
  { id: "f2", x: 96, y: 50, mark: ChartColumn, name: "Weekly report", tone: "wait" },
  { id: "f3", x: 96, y: 82, mark: Boxes, name: "Export", tone: "wait" },
];

const PIPE_WIRES: readonly (readonly [string, string, keyof typeof wires])[] = [
  ["a1", "b1", "plain"],
  ["b1", "c1", "plain"],
  ["a2", "b2", "plain"],
  ["b2", "c2", "plain"],
  ["c1", "d", "plain"],
  ["c2", "d", "plain"],
  ["d", "e", "plain"],
  ["e", "f1", "hit"],
  ["e", "f2", "tap"],
  ["e", "f3", "tap"],
];

function Pipeline({ first }: { first: string }) {
  const at = (id: string) => PIPE.find((n) => n.id === id)!;
  return (
    <figure className="mt-10 lg:mt-14">
      <div className="relative h-52 sm:h-60">
        <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" className="absolute inset-0 size-full">
          {PIPE_WIRES.map(([from, to, kind]) => (
            <path key={from + to} d={curve(at(from).x, at(from).y, at(to).x, at(to).y)} className={wires[kind]} />
          ))}
        </svg>
        {PIPE.map((n) => (
          <div key={n.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
            <Tile mark={n.mark} tone={n.tone} />
            <p
              className={`text-small absolute top-full mt-1.5 whitespace-nowrap ${n.tone === "fail" ? "text-ink" : "text-muted max-sm:hidden"} ${
                n.x < 10 ? "left-0" : n.x > 90 ? "right-0" : "left-1/2 -translate-x-1/2"
              }`}
            >
              {n.name}
            </p>
          </div>
        ))}
      </div>
      <figcaption className="text-muted text-small mt-8 flex flex-wrap gap-x-8 gap-y-2 sm:mt-10">
        <span className="flex items-baseline gap-2">
          <span aria-hidden="true" className="bg-fail size-1.5 -translate-y-0.5 rounded-full" />
          <span><span className="text-ink tabular-nums">{first}</span> on the dashboard, where the wrong number is seen</span>
        </span>
        <span>The cause is somewhere to its left. The report and the export read the same model, and wait.</span>
      </figcaption>
    </figure>
  );
}

/* The tool each step of the trace is done in, drawn as the product draws that kind of thing. */
const STEP_MARKS: readonly LucideIcon[] = [Workflow, ScrollText, Table2, Waypoints, GitCommitHorizontal, MessagesSquare];

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.kind === "p") return <p key={i} className={`${prose} ${measure} mt-5`}>{b.children}</p>;
        if (b.kind === "ul")
          return (
            <ul key={i} className={`${prose} ${measure} marker:text-faint mt-5 list-disc space-y-2 pl-5`}>
              {b.items.map((item, j) => <li key={j} className="pl-1">{item.all}</li>)}
            </ul>
          );
        if (b.kind === "timeline")
          return (
            <figure key={i} className={`${measure} my-10`}>
              <figcaption className="text-ink font-medium">{b.title}</figcaption>
              <ol className="mt-4">
                {b.events.map((e, j) => (
                  <li key={e.time} className="relative grid grid-cols-[1.75rem_3.5rem_minmax(0,1fr)] items-start gap-x-3 pb-4 last:pb-0">
                    {j < b.events.length - 1 ? <span aria-hidden="true" className="bg-ink/15 absolute top-7 bottom-0 left-[0.84rem] w-px" /> : null}
                    <Tile mark={e.state === "fail" ? LayoutDashboard : e.state === "ok" ? ShieldCheck : j === 1 ? MessagesSquare : j === 2 ? Workflow : Waypoints} tone={e.state ?? "plain"} />
                    <time className="text-muted text-mono-sm pt-1 font-mono tabular-nums">{e.time}</time>
                    <span className="text-ink text-small pt-0.5 text-pretty">
                      {e.state ? <span className="sr-only">{e.state === "fail" ? "Failed: " : "Recovered: "}</span> : null}
                      {e.what}
                    </span>
                  </li>
                ))}
              </ol>
            </figure>
          );
        const total = b.steps.reduce((sum, s) => sum + s.minutes, 0);
        return (
          /* the trace as a walk from tool to tool: on a wide screen it breaks out of the column and runs left to right */
          <figure key={i} className="my-12 lg:-ml-[17rem]">
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <span className="text-ink font-medium">{b.title}</span>
              <span className="text-muted text-small">{b.estimate}</span>
            </figcaption>
            <ol className="mt-6 lg:grid lg:grid-cols-6">
              {b.steps.map((s, j) => (
                <li key={s.step} className="relative grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-start gap-x-3 pb-5 lg:block lg:pr-5 lg:pb-0">
                  {j < b.steps.length - 1 ? (
                    <span aria-hidden="true" className="bg-ink/15 absolute top-7 bottom-0 left-[0.84rem] w-px lg:top-[0.84rem] lg:right-0 lg:bottom-auto lg:left-7 lg:h-px lg:w-auto" />
                  ) : null}
                  <Tile mark={STEP_MARKS[j % STEP_MARKS.length]} />
                  <p className="text-ink text-small pt-0.5 text-pretty lg:mt-4 lg:pt-0">
                    {s.step}
                    {s.note ? <span className="text-faint block">{s.note}</span> : null}
                  </p>
                  <p className="text-muted text-mono-sm pt-1 font-mono whitespace-nowrap tabular-nums lg:mt-2 lg:pt-0">
                    <span className="sr-only">about </span>
                    {s.minutes} min
                  </p>
                </li>
              ))}
            </ol>
            <p className="border-line mt-6 flex items-baseline justify-between gap-4 border-t pt-4">
              <span className="text-ink font-medium">Total, estimated</span>
              <span className="font-display text-h2 text-ink whitespace-nowrap tabular-nums">
                <span className="sr-only">about </span>
                {span(total)}
              </span>
            </p>
          </figure>
        );
      })}
    </>
  );
}

const KINDS: Record<Kind, { name: string; mark: LucideIcon }> = {
  table: { name: "Tables", mark: Table2 },
  job: { name: "Jobs", mark: Workflow },
  check: { name: "Checks", mark: ShieldCheck },
  dashboard: { name: "Dashboards", mark: LayoutDashboard },
};
const KIND_ORDER = Object.keys(KINDS) as Kind[];

/* Rows are a fixed height on a wide screen so a wire can be drawn to each
   without measuring anything in the browser. */
const ROW = { post: 196, sample: 112 } as const;

type Entry = { title: string; covers: readonly Kind[]; real?: Loaded["post"] };

/** Posts wired to the kinds of asset their failure touches. */
function Wiring({ entries, href, as: Title = "h2" }: { entries: readonly Entry[]; href: string; as?: "h2" | "h3" }) {
  const heights = entries.map((entry) => (entry.real ? ROW.post : ROW.sample));
  const height = heights.reduce((sum, h) => sum + h, 0);
  const kindY = (k: Kind) => ((KIND_ORDER.indexOf(k) + 0.5) / KIND_ORDER.length) * height * 0.7 + height * 0.15;
  const rowY = (i: number) => heights.slice(0, i).reduce((sum, h) => sum + h, 0) + heights[i] / 2;
  return (
    <div className="lg:grid lg:grid-cols-[9rem_minmax(8rem,16rem)_minmax(0,1fr)]">
      <ul aria-label="What the failures touch" className="relative max-lg:hidden" style={{ height }}>
        {KIND_ORDER.map((k) => (
          <li key={k} className="absolute right-0 flex -translate-y-1/2 items-center gap-3" style={{ top: kindY(k) }}>
            <span className="text-muted text-small">{KINDS[k].name}</span>
            <Tile mark={KINDS[k].mark} />
          </li>
        ))}
      </ul>
      <svg aria-hidden="true" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" fill="none" className="max-lg:hidden" style={{ height }} width="100%">
        {entries.flatMap((entry, i) =>
          entry.covers.map((k) => <path key={`${i}${k}`} d={curve(0, kindY(k), 100, rowY(i))} className={entry.real ? wires.ok : wires.tap} />),
        )}
      </svg>
      <ol>
        {entries.map((entry) => (
          <li key={entry.title} className={`border-line flex items-center gap-4 max-lg:border-b max-lg:py-7 ${entry.real ? "lg:h-[196px]" : "lg:h-[112px]"}`}>
            <Tile mark={ScrollText} tone={entry.real ? "ok" : "ghost"} className="max-lg:hidden" />
            <div className="min-w-0">
              {entry.real ? (
                <>
                  <Title className="font-display text-h2 max-w-[34ch] text-balance">
                    <Link href={href} className="hover:text-accent-text transition-colors">{entry.title}</Link>
                  </Title>
                  <p className="text-muted text-small mt-2 max-w-[64ch] text-pretty lg:line-clamp-2">{entry.real.description}</p>
                </>
              ) : (
                <Title className="font-display text-h3 text-muted max-w-[48ch] text-balance">{entry.title}</Title>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                {entry.real ? <Filed post={entry.real} /> : <Sample />}
                {/* below the wide layout there are no wires, so each row names what it touches */}
                <ul aria-label="Touches" className="flex items-center gap-3 lg:sr-only">
                  {entry.covers.map((k) => {
                    const Mark = KINDS[k].mark;
                    return (
                      <li key={k} className="text-muted text-small flex items-center gap-1.5">
                        <Mark aria-hidden="true" className="size-3.5" strokeWidth={1.4} />
                        {KINDS[k].name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Head({ title, intro, lead = false }: { title: string; intro: string; lead?: boolean }) {
  return (
    <>
      <h1 className="font-display text-display max-w-[20ch] text-balance">{title}</h1>
      <p className={`mt-6 text-pretty ${lead ? "text-ink text-lead max-w-[46ch]" : "text-muted max-w-[62ch]"}`}>{intro}</p>
    </>
  );
}

export function LineagePost({ data }: { data: Loaded }) {
  const { post } = data;
  return (
    <LabFrame pad="none">
      <header className="border-line relative overflow-hidden border-b px-5 pb-10 sm:px-8 lg:px-10 lg:pb-12">
        {/* the estate, faint, behind the one pipeline this post is about */}
        <LineageBackdrop className="opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
        <div className="relative">
          <Back href={listPath(SLUG)} />
          <div className="pt-6 lg:pt-10">
            <Head title={post.title} intro={post.description} lead />
            <Filed post={post} className="mt-6" />
          </div>
          <Pipeline first={data.timeline.events[0].time} />
        </div>
      </header>

      <div className="px-5 pt-12 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pt-16 lg:pb-24">
        {/* the text hangs under the model and the dashboard, on the right of the graph it explains */}
        <article className="lg:ml-[17rem]">
          <div className="-mt-5">
            <Blocks blocks={data.intro} />
          </div>
          {data.sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-head`} className="mt-16 scroll-mt-24">
              <h2 id={`${s.id}-head`} className="font-display text-h2 max-w-[26ch] text-balance">{s.title}</h2>
              <Blocks blocks={s.blocks} />
            </section>
          ))}
        </article>

        <section aria-labelledby="downstream" className="border-line mt-16 border-t pt-10 lg:mt-20">
          <h2 id="downstream" className="font-display text-h2">Downstream of this post</h2>
          <p className="text-muted mt-3 max-w-[56ch] text-pretty">The next posts in the series, and what each failure touches.</p>
          <div className="mt-8">
            <Wiring entries={SAMPLES} href="" as="h3" />
          </div>
        </section>

        <section aria-labelledby="start" className="border-line mt-16 border-t pt-10">
          <h2 id="start" className="font-display text-h2 max-w-[22ch] text-balance">{CLOSER.head}</h2>
          <p className={`${prose} ${measure} mt-4`}>{CLOSER.body}</p>
          <Actions className="mt-7" />
        </section>
      </div>
    </LabFrame>
  );
}

export function LineageList({ data }: { data: Loaded }) {
  const entries: Entry[] = [{ title: data.post.title, covers: REAL_COVERS, real: data.post }, ...SAMPLES];
  return (
    <LabFrame list pad="none">
      <header className="relative overflow-hidden px-5 pt-12 pb-12 sm:px-8 sm:pt-16 lg:px-10 lg:pt-24 lg:pb-16">
        <LineageBackdrop className="opacity-60 [mask-image:linear-gradient(to_right,transparent_35%,black)]" />
        <div className="relative">
          <Head title={LIST.title} intro={LIST.intro} />
        </div>
      </header>
      <div className="border-line border-t px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pt-10 lg:pb-24">
        <Wiring entries={entries} href={postPath(SLUG)} />
      </div>
    </LabFrame>
  );
}
