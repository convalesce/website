import { ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Footer } from "@/components/footer";
import { Section } from "@/components/frame";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { formatDay, type Post } from "@/lib/blog";
import { CLOSER, CTA, SITE } from "@/lib/content";

import { Outline } from "./outline";
import { scheduled, type Block, type Facts, type Loaded, type Span } from "./post-content";
import { PostMeta } from "./post-list";
import { TagList } from "./tags";
import { ThemeToggle } from "./theme-toggle";
import { clock, span, toMinutes } from "./time";

/* A post as a manual: an outline that never leaves, each section's opening
   line and anything that can be scanned on the surface, the rest of its
   account folded under them. A post with a Timeline opens with its facts and
   has that morning drawn to scale. */

const num = "font-mono text-mono-sm tabular-nums";
/* A manual's running text is a size under the site's reading size, held to the same count of characters. */
const text = "text-soft text-body text-pretty max-w-[31rem]";
/* Anything set apart from the running text sits in the site's own box: a hairline with the 12px corner. */
const box = "border-line overflow-hidden rounded-lg border px-4";
const pane = "px-5 sm:px-8 lg:px-10";
const toggle = "border-line rounded-md border p-1";
const card = "border-line hover:bg-ink/[0.03] block h-full rounded-lg border p-5 transition-colors";
const secondary =
  "border-ink/25 bg-bg/60 text-ink hover:border-ink/40 hover:bg-ink/[0.06] inline-flex h-11 items-center gap-2 rounded-md border px-5 text-small font-medium whitespace-nowrap transition-colors";

const share = (minute: number, f: Facts) => ((minute - f.first) / (f.fixed - f.first)) * 100;

/* The morning on one axis, a minute the same width everywhere, so the long
   gap is seen before the list under it is read. Only the times sit on the
   axis; what happened at each is the list's job, which keeps it legible in a
   pane of any width. */
function Scale({ facts: f }: { facts: Facts }) {
  const dot = { fail: "bg-fail", ok: "bg-accent", plain: "bg-ink" } as const;
  const traced = f.started !== undefined && f.found !== undefined ? { from: f.started, to: f.found } : null;
  return (
    <div aria-hidden="true" className="border-line border-b pt-4 pb-5">
      <p className="text-muted text-small flex flex-wrap items-baseline justify-between gap-x-6">
        <span>Drawn to scale: {span(f.fixed - f.first)} from the first sign to the fix</span>
        {traced ? (
          <span>
            <span className="bg-ink mr-2 inline-block h-[3px] w-6 align-middle" />
            {span(traced.to - traced.from)} finding the cause
          </span>
        ) : null}
      </p>
      <div className="relative mx-5 mt-4 h-16">
        <span className="bg-line absolute inset-x-0 top-1/2 h-px" />
        {traced ? (
          <span
            className="bg-ink absolute top-1/2 -mt-px h-[3px]"
            style={{ left: `${share(traced.from, f)}%`, width: `${share(traced.to, f) - share(traced.from, f)}%` }}
          />
        ) : null}
        {f.events.map((e, i) => (
          <span key={e.time} className="absolute inset-y-0 w-0" style={{ left: `${share(toMinutes(e.time), f)}%` }}>
            <span className={`absolute top-1/2 -mt-1 -ml-1 size-2 rounded-full ${dot[e.state ?? "plain"]}`} />
            <span className={`${num} text-muted absolute -translate-x-1/2 ${i % 2 === 0 ? "top-0" : "bottom-0"}`}>{e.time}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* The morning as one line beside a heading, that section's share of it marked. */
function Strip({ window: win, facts: f }: { window: Span; facts: Facts }) {
  const from = win === "after" ? 100 : share(win.from, f);
  const to = win === "after" ? 100 : share(win.to, f);
  return (
    <p className="w-44 max-lg:mb-2 max-lg:ml-[1.375rem]">
      <span aria-hidden="true" className="bg-line relative block h-px">
        {f.events.map((e) => (
          <span key={e.time} className="bg-faint absolute -top-1 h-[9px] w-px" style={{ left: `${share(toMinutes(e.time), f)}%` }} />
        ))}
        <span className="bg-ink absolute -top-px h-[3px]" style={{ left: `${from}%`, width: `${Math.max(to - from, 0)}%` }} />
        {win === "after" ? <span className="bg-ink absolute -top-[3px] right-0 size-[7px] rounded-full" /> : null}
      </span>
      <span className={`${num} text-muted mt-3 block`}>
        {win === "after" ? `after ${clock(f.fixed)}` : `${clock(win.from)} to ${clock(win.to)}`}
      </span>
    </p>
  );
}

function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="border-line grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-4 border-b py-3 sm:grid-cols-[9.5rem_minmax(0,1fr)]">
      <dt className="text-faint text-small">{term}</dt>
      <dd className="text-ink text-small text-pretty">{children}</dd>
    </div>
  );
}

function Surface({ block, facts }: { block: Block; facts?: Facts }) {
  if (block.kind === "p") return null;
  if (block.kind === "other") return <div className="max-w-[40rem]">{block.node}</div>;
  if (block.kind === "timeline")
    return (
      <div className={`${box} mt-5 ${facts ? "" : "max-w-[40rem]"}`}>
        {facts ? <Scale facts={facts} /> : null}
        <table className="w-full text-left">
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
      </div>
    );
  if (block.kind === "byhand") {
    /* with a start on the Timeline, each step also shows the time it is done by */
    const started = facts?.started;
    const total = block.steps.reduce((sum, s) => sum + s.minutes, 0);
    return (
      <div className={`${box} mt-5 max-w-[40rem]`}>
        <table className="w-full text-left">
          <caption className="border-line border-b py-2.5 text-left">
            <span className="text-ink text-small font-medium">{block.title}</span>
            <span className="text-muted text-small">. {block.estimate}</span>
          </caption>
          <thead>
            <tr className="text-faint text-small">
              <th scope="col" className="py-2 font-normal">Step</th>
              <th scope="col" className="py-2 pl-3 text-right font-normal">Takes</th>
              {started !== undefined ? <th scope="col" className="py-2 pl-3 text-right font-normal">By</th> : null}
            </tr>
          </thead>
          <tbody>
            {scheduled(block.steps, started ?? 0).map((s) => (
              <tr key={s.step} className="border-line border-t align-baseline">
                <td className="text-ink text-small py-2 text-pretty">
                  {s.step}
                  {s.note ? <span className="text-faint"> ({s.note.replace(/\.$/, "")})</span> : null}
                </td>
                <td className={`${num} text-muted py-2 pl-3 text-right whitespace-nowrap`}>{s.minutes} min</td>
                {started !== undefined ? <td className={`${num} text-muted py-2 pl-3 text-right`}>{clock(s.to)}</td> : null}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-line border-t align-baseline">
              <td className="text-ink text-small py-2 font-medium">Total, estimated</td>
              <td className={`${num} text-ink py-2 pl-3 text-right whitespace-nowrap`}>{span(total)}</td>
              {started !== undefined ? <td className={`${num} text-ink py-2 pl-3 text-right`}>{clock(started + total)}</td> : null}
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
  if (block.tick)
    return (
      <ul className={`${box} mt-5 max-w-[40rem]`}>
        {block.items.map((item) => (
          <li key={item.lead} className="border-line border-t first:border-t-0">
            <label className="hover:bg-ink/[0.03] -mx-4 grid cursor-pointer grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-x-3 px-4 py-3 transition-colors">
              <input type="checkbox" className="accent-accent mt-1 size-4" />
              <span>
                <span className="text-ink text-small block font-medium">{item.lead}.</span>
                <span className="text-muted text-small block text-pretty">{item.rest}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    );
  return (
    <div className={`${box} mt-5 max-w-[40rem]`}>
      <dl className="-mb-px grid gap-x-8 sm:grid-cols-2">
        {block.items.map((item) => (
          <div key={item.lead} className="border-line border-b py-3">
            <dt className="text-ink text-small font-medium">{item.lead}</dt>
            <dd className="text-muted text-small text-pretty">{item.rest}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* A section shows its opening line and anything that can be scanned; the rest of its account is folded under them. */
function Entry({ blocks, facts }: { blocks: Block[]; facts?: Facts }) {
  const [lead, ...rest] = blocks.filter((b) => b.kind === "p");
  return (
    <>
      {lead ? <p className="text-ink text-body max-w-[31rem] text-pretty">{lead.children}</p> : null}
      {blocks.map((b, i) => <Surface key={i} block={b} facts={facts} />)}
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

function Back({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <Link href="/blog" className="text-muted hover:text-ink text-small inline-flex min-h-11 items-center gap-1.5 transition-colors">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Blog
      </Link>
    </nav>
  );
}

export function PostView({
  post,
  data,
  newer,
  older,
  others,
}: {
  post: Post;
  data: Loaded;
  newer?: Post;
  older?: Post;
  others: readonly Post[];
}) {
  const f = data.facts;
  const outline = data.parts.map((p) => ({
    id: p.id,
    title: p.title,
    points: p.blocks.flatMap((b) => (b.kind === "points" ? b.items.map((i) => i.lead) : [])),
  }));
  const updated = post.updated && post.updated !== post.date ? post.updated : null;
  return (
    <>
      <Nav home={SITE.domain} current={post.path} />
      <main id="main">
        <Section index={post.path} label="Blog" pad="none">
          <div className="border-line border-t lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
            {/* the outline never leaves: a column on a wide screen, a strip that scrolls sideways inside itself on a small one */}
            <aside className="border-line bg-bg max-lg:sticky max-lg:top-16 max-lg:z-10 max-lg:border-b lg:border-r">
              <div className="max-lg:overflow-x-auto max-lg:px-5 sm:max-lg:px-8 lg:sticky lg:top-16 lg:max-h-[calc(100svh-4rem)] lg:overflow-y-auto lg:px-6 lg:py-6">
                <div className="flex items-center justify-between gap-3 max-lg:hidden">
                  <Back />
                  <ThemeToggle className={toggle} />
                </div>
                <nav aria-label="Outline" className="lg:mt-3">
                  <Outline entries={outline} />
                </nav>
              </div>
            </aside>

            <article className="min-w-0">
              <header className={`${pane} border-line border-b py-8 lg:py-10`}>
                <div className="-mt-3 mb-2 flex items-center justify-between gap-3 lg:hidden">
                  <Back />
                  <ThemeToggle className={toggle} />
                </div>
                <h1 className="font-display text-h2 max-w-[30ch] text-balance">{post.title}</h1>
                <p className="text-muted mt-3 max-w-[31rem] text-pretty">{post.description}</p>
                {f ? (
                  <div className={`${box} mt-6`}>
                    <dl className="-mb-px grid gap-x-10 xl:grid-cols-2">
                      <Fact term="What failed">{f.whatFailed}</Fact>
                      {post.waited ? <Fact term="Who waited">{post.waited.join(", ")}</Fact> : null}
                      <Fact term="First sign"><span className={num}>{clock(f.first)}</span></Fact>
                      {f.found !== undefined ? (
                        <Fact term="Cause found">
                          <span className={num}>{clock(f.found)}</span>
                          {f.started !== undefined ? `, ${span(f.found - f.started)} after the engineer started` : null}
                        </Fact>
                      ) : null}
                      <Fact term="Fixed"><span className={num}>{clock(f.fixed)}</span></Fact>
                      <Fact term="Wrong for">{span(f.fixed - f.first)}</Fact>
                      <Fact term="Published"><time dateTime={post.date}>{formatDay(post.date)}</time></Fact>
                      <Fact term="Reading time">{post.minutes} min in full</Fact>
                    </dl>
                  </div>
                ) : (
                  <PostMeta post={post} className="mt-5" />
                )}
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <TagList tags={post.tags} />
                  {updated ? (
                    <p className="text-faint text-small">
                      Updated <time dateTime={updated}>{formatDay(updated)}</time>
                    </p>
                  ) : null}
                </div>
              </header>

              {data.parts.map((p, i) => (
                <section key={p.id} id={p.id} aria-labelledby={`${p.id}-head`} className={`${pane} border-line scroll-mt-28 border-b py-7 lg:scroll-mt-16 lg:py-8`}>
                  <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
                    <h2 id={`${p.id}-head`} className="font-display text-h3 flex items-baseline gap-3">
                      <span aria-hidden="true" className={`${num} text-faint font-normal`}>{i + 1}</span>
                      {p.title}
                    </h2>
                    {f && p.window ? <Strip window={p.window} facts={f} /> : null}
                  </div>
                  <div className="lg:pl-[1.375rem]">
                    <Entry blocks={p.blocks} facts={f} />
                  </div>
                </section>
              ))}

              {newer || older ? (
                <nav aria-label="Previous and next posts" className={`${pane} border-line grid gap-3 border-b py-8 sm:grid-cols-2`}>
                  {older ? (
                    <Link href={older.path} className={card}>
                      <span className="mono-label block">Previous post</span>
                      <span className="text-h3 mt-2 block text-balance">{older.title}</span>
                    </Link>
                  ) : null}
                  {newer ? (
                    <Link href={newer.path} className={`${card} sm:col-start-2 sm:text-right`}>
                      <span className="mono-label block">Next post</span>
                      <span className="text-h3 mt-2 block text-balance">{newer.title}</span>
                    </Link>
                  ) : null}
                </nav>
              ) : null}

              {others.length > 0 ? (
                <section aria-labelledby="related" className={`${pane} border-line border-b py-8`}>
                  <h2 id="related" className="font-display text-h3">Related posts</h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {others.map((other) => (
                      <li key={other.slug}>
                        <Link href={other.path} className={card}>
                          <span className="text-h3 block text-balance">{other.title}</span>
                          <span className="text-muted text-small mt-2 block text-pretty">{other.description}</span>
                          <PostMeta post={other} className="mt-4" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section aria-labelledby="start" className={`${pane} py-8 lg:py-10`}>
                <h2 id="start" className="font-display text-h3">{CLOSER.head}</h2>
                <p className={`${text} mt-2`}>{CLOSER.body}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button href={CTA.primary.href} event="open_app" label={CTA.primary.label}>
                    {CTA.primary.label}
                  </Button>
                  <a href={`${SITE.domain}/${CTA.secondary.href}`} className={secondary}>
                    {CTA.secondary.label}
                  </a>
                </div>
              </section>
            </article>
          </div>
        </Section>
      </main>
      <Footer home={SITE.domain} />
    </>
  );
}
