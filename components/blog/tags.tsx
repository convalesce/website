import { Rss } from "lucide-react";
import Link from "next/link";

import { TAGS, tagPath } from "@/lib/blog";

/* On a touch screen a chip is tall enough for a finger; with a mouse it stays slim. */
const chip = "mono-label inline-flex items-center gap-1.5 rounded-sm border px-3 py-2 transition-colors pointer-coarse:min-h-10";
const idle = "border-line !text-muted hover:border-ink/40 hover:!text-ink";
const current = "border-ink/40 !text-ink";

/** The tags a post carries, each a link to the posts that share it. */
export function TagList({ tags }: { tags: readonly string[] }) {
  return (
    <ul aria-label="Tags" className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag}>
          <Link href={tagPath(tag)} className={`${chip} ${idle}`}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Every tag in use, as a row of links, with the feed beside it; `active` is the tag being shown, or none for the full list. */
export function TagFilter({ active }: { active?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
      <nav aria-label="Filter posts by tag">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link href="/blog" aria-current={active ? undefined : "page"} className={`${chip} ${active ? idle : current}`}>
              All posts
            </Link>
          </li>
          {TAGS.map(({ tag, count }) => (
            <li key={tag}>
              <Link
                href={tagPath(tag)}
                aria-current={active === tag ? "page" : undefined}
                className={`${chip} ${active === tag ? current : idle}`}
              >
                {tag}
                <span className="tabular-nums">
                  <span className="sr-only">, </span>
                  {count}
                  <span className="sr-only">{count === 1 ? " post" : " posts"}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <a
        href="/blog/rss.xml"
        className="text-muted hover:text-ink text-small inline-flex min-h-11 items-center gap-1.5 transition-colors"
      >
        <Rss aria-hidden="true" className="size-4" />
        RSS
      </a>
    </div>
  );
}
