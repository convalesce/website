import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { formatDay, type Post } from "@/lib/blog";

import type { Facts } from "./post-content";
import { clock, span } from "./time";

/** When it was published and how long it takes to read, as one quiet line. */
export function PostMeta({ post, className = "" }: { post: Post; className?: string }) {
  return (
    <p className={`text-faint text-small tabular-nums ${className}`}>
      <time dateTime={post.date}>{formatDay(post.date)}</time>
      <span aria-hidden="true" className="mx-2">·</span>
      {post.minutes} min read
    </p>
  );
}

const cell = "bg-bg hover:bg-surface relative flex h-full flex-col gap-3 transition-colors";
/* the link covers its cell, so the whole cell is the target */
const cover = "after:absolute after:inset-0";

function Label({ post, lead }: { post: Post; lead?: string }) {
  return (
    <p className="mono-label">
      {lead ? `${lead} · ` : null}
      <time dateTime={post.date}>{formatDay(post.date)}</time> · {post.minutes} min
    </p>
  );
}

function Read() {
  return (
    <p aria-hidden="true" className="text-muted text-small mt-auto inline-flex items-center gap-1 pt-2">
      Read the post
      <ArrowUpRight className="size-4" />
    </p>
  );
}

/* Posts as cells in one rounded box, a hairline between them, in the order
   given: the first across the full width, the rest two abreast. `facts` are
   the first post's, when it has a Timeline to take them from. */
export function PostList({ posts, lead, facts }: { posts: readonly Post[]; lead?: string; facts?: Facts }) {
  const [first, ...rest] = posts;
  if (!first) return null;
  return (
    <ol className="border-line bg-line grid gap-px overflow-hidden rounded-lg border sm:grid-cols-2">
      <li className="sm:col-span-2">
        <article className={`${cell} p-6 sm:p-8`}>
          <Label post={first} lead={lead} />
          <h2 className="font-display text-h2 max-w-[28ch] text-balance">
            <Link href={first.path} className={cover}>{first.title}</Link>
          </h2>
          <p className="text-muted max-w-[62ch] text-pretty">{first.description}</p>
          {facts ? (
            <dl className="text-small flex flex-wrap gap-x-8 gap-y-1 pt-1">
              <div className="flex gap-2">
                <dt className="text-faint shrink-0">What failed</dt>
                <dd className="text-soft">{facts.whatFailed}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-faint">Wrong for</dt>
                <dd className="text-soft tabular-nums">{span(facts.fixed - facts.first)}</dd>
              </div>
              <div>
                <dt className="sr-only">Outcome</dt>
                <dd className="text-soft flex items-baseline gap-2">
                  <span aria-hidden="true" className="bg-accent size-1.5 -translate-y-0.5 rounded-full" />
                  Fixed at <span className="text-mono-sm font-mono tabular-nums">{clock(facts.fixed)}</span>
                </dd>
              </div>
            </dl>
          ) : null}
          <Read />
        </article>
      </li>
      {rest.map((post, i) => (
        // an odd one out at the end takes the full width, so the box has no empty cell
        <li key={post.slug} className={i === rest.length - 1 && rest.length % 2 === 1 ? "sm:col-span-2" : ""}>
          <article className={`${cell} p-6`}>
            <Label post={post} />
            <h2 className="font-display text-h3 max-w-[30ch] text-balance">
              <Link href={post.path} className={cover}>{post.title}</Link>
            </h2>
            <p className="text-muted text-small line-clamp-3 text-pretty">{post.description}</p>
            <Read />
          </article>
        </li>
      ))}
    </ol>
  );
}
