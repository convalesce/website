import { problems, readSources, reservedSlugs, type FrontMatter, type Heading } from "@/lib/blog-source";
import { BLOG } from "@/lib/content";

/* The posts, read once from content/blog. A post that breaks a rule stops the
   build here with the same messages `npm run check:blog` prints, so a bad
   post cannot ship by skipping the check. */

export type Post = FrontMatter & {
  slug: string;
  /** where it lives inside the app */
  path: string;
  /** its public address, on the blog's own host */
  url: string;
  /** reading time, in whole minutes */
  minutes: number;
  /** the h2s, for the table of contents */
  headings: readonly Heading[];
};

const sources = readSources();
const found = problems(sources, new Date().toISOString().slice(0, 10), reservedSlugs());
if (found.length > 0) throw new Error(`content/blog has problems:\n${found.map((f) => `  ${f}`).join("\n")}`);

export const postUrl = (slug: string) => `${BLOG.url}/${slug}`;
export const tagPath = (tag: string) => `/blog/tags/${tag}`;
export const tagUrl = (tag: string) => `${BLOG.url}/tags/${tag}`;

/** Newest first; two posts from one day keep their file order. */
export const POSTS: readonly Post[] = sources
  .map((source) => ({
    ...(source.data as FrontMatter),
    slug: source.slug,
    path: `/blog/${source.slug}`,
    url: postUrl(source.slug),
    minutes: source.minutes,
    headings: source.headings,
  }))
  .sort((a, b) => b.date.localeCompare(a.date));

export const bySlug = (slug: string) => POSTS.find((post) => post.slug === slug);

/** Every tag in use with how many posts carry it, most used first. */
export const TAGS: readonly { tag: string; count: number }[] = [...new Set(POSTS.flatMap((post) => post.tags))]
  .map((tag) => ({ tag, count: POSTS.filter((post) => post.tags.includes(tag)).length }))
  .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

export const byTag = (tag: string) => POSTS.filter((post) => post.tags.includes(tag));

/** The posts either side of this one in time. */
export function neighbours(post: Post): { newer?: Post; older?: Post } {
  const at = POSTS.findIndex((p) => p.slug === post.slug);
  return { newer: POSTS[at - 1], older: POSTS[at + 1] };
}

/** Other posts that share a tag with this one, the most shared first. */
export function related(post: Post, limit = 3): Post[] {
  return POSTS.filter((other) => other.slug !== post.slug)
    .map((other) => ({ other, shared: other.tags.filter((tag) => post.tags.includes(tag)).length }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map(({ other }) => other);
}

const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** A post's date as the site prints dates: 8 Oct 2026. */
export const formatDay = (date: string) => day.format(new Date(date));
