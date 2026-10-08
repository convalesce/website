import Link from "next/link";

import { TAGS, tagPath } from "@/lib/blog";

const chip = "mono-label inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-2 transition-colors";
const idle = "border-line hover:border-ink/40 hover:text-ink";
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

/** Every tag in use, as a row of links; `active` is the tag being shown, or none for the full list. */
export function TagFilter({ active }: { active?: string }) {
  return (
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
              <span className="tabular-nums opacity-70">
                <span className="sr-only">, </span>
                {count}
                <span className="sr-only">{count === 1 ? " post" : " posts"}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
