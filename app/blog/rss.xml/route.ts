import { POSTS } from "@/lib/blog";
import { BLOG, PAGES, SITE } from "@/lib/content";

export const dynamic = "force-static";

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/* A feed item's date is the post's own day at midnight UTC, so the feed does
   not change between builds unless a post does. */
const stamp = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString();

export function GET() {
  const { description } = PAGES.find((page) => page.path === "/blog")!;
  const latest = POSTS.map((post) => post.updated ?? post.date).sort().at(-1);
  const items = POSTS.map(
    (post) => `    <item>
      <title>${escape(post.title)}</title>
      <link>${post.url}</link>
      <guid isPermaLink="true">${post.url}</guid>
      <pubDate>${stamp(post.date)}</pubDate>
      <description>${escape(post.description)}</description>
${post.tags.map((tag) => `      <category>${escape(tag)}</category>`).join("\n")}
    </item>`,
  ).join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(BLOG.title)}</title>
    <link>${BLOG.url}/</link>
    <description>${escape(description)}</description>
    <language>en-GB</language>
    <managingEditor>${SITE.email} (${escape(SITE.company)})</managingEditor>
    <atom:link href="${BLOG.url}/rss.xml" rel="self" type="application/rss+xml" />
${latest ? `    <lastBuildDate>${stamp(latest)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;
  return new Response(feed, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
