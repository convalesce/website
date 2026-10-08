import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/* Reading and checking the post files, and nothing else. This module imports
   no alias paths and uses no syntax Node cannot strip, because
   scripts/check-blog.mjs runs it directly with Node, outside the build. */

export type FrontMatter = {
  title: string;
  description: string;
  /** the day it was published, as YYYY-MM-DD */
  date: string;
  tags: string[];
  /** the test scenario a walkthrough post follows; kept for our own reference, never rendered */
  scenario?: string;
  /** the day its content last changed, as YYYY-MM-DD */
  updated?: string;
  /** who was held up while the failure was traced, for the facts at the top of the post */
  waited?: string[];
};

export type Heading = { id: string; text: string };

export type Source = {
  slug: string;
  file: string;
  /** what the front matter held, before it is known to be complete */
  data: Record<string, string | string[]>;
  body: string;
  headings: Heading[];
  minutes: number;
  /** what the parser could not read */
  errors: string[];
};

export const BLOG_DIR = join(process.cwd(), "content/blog");

const REQUIRED = ["title", "description", "date", "tags"] as const;
const KNOWN = [...REQUIRED, "scenario", "updated", "waited"];
const WORDS_PER_MINUTE = 220;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function scalar(raw: string, key: string, errors: string[]): string {
  const value = raw.trim();
  if (value.startsWith('"')) {
    try {
      return String(JSON.parse(value));
    } catch {
      errors.push(`${key}: the double-quoted value does not close`);
      return value;
    }
  }
  if (value.startsWith("'") && value.endsWith("'") && value.length > 1) return value.slice(1, -1).replace(/''/g, "'");
  if (value.includes(": ") || value.includes(" #")) errors.push(`${key}: put the value in double quotes, it contains a colon or a hash`);
  return value;
}

/* The front matter is the small part of YAML a post needs: `key: value`, and a
   list written inline as `[a, b]` or as `- a` lines. Anything else is reported
   rather than guessed at. */
export function parse(raw: string): Pick<Source, "data" | "body" | "errors"> {
  const errors: string[] = [];
  const data: Record<string, string | string[]> = {};
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { data, body: raw, errors: ["no front matter block at the top of the file"] };

  let list: string[] | null = null;
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const item = /^\s+-\s+(.*)$/.exec(line);
    if (item && list) {
      list.push(scalar(item[1], "list item", errors));
      continue;
    }
    const pair = /^([A-Za-z][\w-]*):(.*)$/.exec(line);
    if (!pair) {
      errors.push(`cannot read the front matter line "${line}"`);
      continue;
    }
    const [, key, rest] = pair;
    const value = rest.trim();
    list = null;
    if (key in data) errors.push(`${key}: set twice`);
    if (value === "") {
      list = [];
      data[key] = list;
    } else if (value.startsWith("[")) {
      if (!value.endsWith("]")) errors.push(`${key}: the list does not close`);
      const inner = value.replace(/^\[|\]$/g, "").trim();
      data[key] = inner === "" ? [] : inner.split(",").map((part) => scalar(part, key, errors));
    } else {
      data[key] = scalar(value, key, errors);
    }
  }
  return { data, body: raw.slice(match[0].length), errors };
}

/** The body with fenced code removed, so a `#` inside a code sample is not read as a heading. */
const prose = (body: string) => body.replace(/^(```|~~~)[\s\S]*?^\1.*$/gm, "");

const plain = (markdown: string) =>
  markdown
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();

export function headingsOf(body: string): Heading[] {
  return [...prose(body).matchAll(/^##[ \t]+(.+?)[ \t]*#*$/gm)].map((m) => {
    const text = plain(m[1]);
    return { id: slugify(text), text };
  });
}

/* Counted over what a reader reads: the prose, and the words inside a
   component's quoted props, which is where a ByHand or Trail keeps its text. */
export function minutesOf(body: string): number {
  const words = body
    .replace(/^(import|export)\s.*$/gm, " ")
    .replace(/<\/?[A-Za-z][\w.]*|\/?>|[{}[\]()=:,"'`*_#|-]/g, " ")
    .split(/\s+/)
    .filter((word) => /[A-Za-z0-9]/.test(word)).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function readSources(dir: string = BLOG_DIR): Source[] {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .sort()
    .map((file) => {
      const parsed = parse(readFileSync(join(dir, file), "utf8"));
      return {
        slug: file.slice(0, -".mdx".length),
        file,
        ...parsed,
        headings: headingsOf(parsed.body),
        minutes: minutesOf(parsed.body),
      };
    });
}

/** The names a slug must not take: the routes and public files of the main site, and the blog's own tag index. */
export const reservedSlugs = (root: string = process.cwd()) => [
  ...readdirSync(join(root, "app")).map((name) => name.replace(/\.[a-z]+$/, "")),
  ...readdirSync(join(root, "public")),
  "tags",
];

const realDay = (value: string) => DAY.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().startsWith(value);

/* Everything wrong with the posts, one line each; empty when they are fine.
   `today` is YYYY-MM-DD in UTC. `reserved` holds the names a slug must not
   take: on the blog's own host a post is served at /<slug>, where a page of
   the main site with the same name would answer first. */
export function problems(sources: readonly Source[], today: string, reserved: readonly string[] = []): string[] {
  const found: string[] = [];
  const seen = new Map<string, string>();

  for (const post of sources) {
    const say = (message: string) => found.push(`${post.file}: ${message}`);
    post.errors.forEach(say);

    if (!SLUG.test(post.slug)) say("the file name must be lowercase letters, digits and single hyphens");
    if (reserved.includes(post.slug)) say(`the slug "${post.slug}" is taken by a page of the site`);
    const key = post.slug.toLowerCase();
    const twin = seen.get(key);
    if (twin) say(`duplicate slug, also used by ${twin}`);
    seen.set(key, post.file);

    for (const field of REQUIRED) {
      const value = post.data[field];
      if (value === undefined || value.length === 0) say(`missing the front matter field "${field}"`);
    }
    for (const field of Object.keys(post.data)) {
      if (!KNOWN.includes(field)) say(`unknown front matter field "${field}"`);
    }
    for (const field of ["title", "description", "date", "scenario", "updated"]) {
      if (Array.isArray(post.data[field])) say(`"${field}" must be a single value, not a list`);
    }

    const { date, updated, tags } = post.data;
    if (typeof date === "string") {
      if (!realDay(date)) say(`date "${date}" is not a real day written as YYYY-MM-DD`);
      else if (date > today) say(`date ${date} is in the future`);
    }
    if (typeof updated === "string") {
      if (!realDay(updated)) say(`updated "${updated}" is not a real day written as YYYY-MM-DD`);
      else if (updated > today) say(`updated ${updated} is in the future`);
      else if (typeof date === "string" && updated < date) say("updated is earlier than date");
    }
    if (tags !== undefined && !Array.isArray(tags)) say('"tags" must be a list');
    if (post.data.waited !== undefined && !Array.isArray(post.data.waited)) say('"waited" must be a list');
    if (Array.isArray(tags)) {
      for (const tag of tags) if (!SLUG.test(tag)) say(`tag "${tag}" must be lowercase letters, digits and single hyphens`);
      if (new Set(tags).size !== tags.length) say("a tag is listed twice");
    }

    const text = prose(post.body);
    for (const field of ["title", "description"]) {
      const value = post.data[field];
      if (typeof value === "string" && value.includes("—")) say(`em dash in the ${field}`);
    }
    post.body.split(/\r?\n/).forEach((line, i) => {
      if (line.includes("—")) say(`em dash in the body, line ${i + 1} of the text below the front matter`);
    });
    if (/^#[ \t]+\S/m.test(text)) say("a level-one heading in the body; the page already has its h1, start at ##");
    if (/!\[\s*\]\(/.test(text) || /<img(?![^>]*\balt=["{][^"}]+)[^>]*>/.test(text)) say("an image without alt text");

    for (const block of text.match(/<ByHand\b[^>]*?(?:\/>|>)/g) ?? []) {
      if (!/\bestimate=(["'])[^"']*estimate[^"']*\1/i.test(block)) {
        say('a ByHand block without its estimate label; give it estimate="..." with the word "estimate" in it');
      }
    }

    const ids = post.headings.map((h) => h.id);
    if (ids.some((id) => id === "")) say("a ## heading with no letters or digits in it");
    if (new Set(ids).size !== ids.length) say("two ## headings with the same text, so their anchors collide");
  }
  return found;
}
