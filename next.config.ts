import createMDX from "@next/mdx";
import type { NextConfig } from "next";

import { BLOG } from "./lib/content";

/* `has` reads its value as a pattern, so the dots are escaped. */
const blogHost = [{ type: "host" as const, value: new URL(BLOG.url).host.replace(/\./g, "\\.") }];

const nextConfig: NextConfig = {
  /* On the blog's own host the list is the root and everything else sits one
     level up from where the app keeps it. These live here and not in
     vercel.ts because a vercel.ts rewrite is tried only after the files, and
     at "/" the home page is a file, so the list could never be reached.
     The first rule runs before the files for that reason. The second runs
     last of all, so the site's own pages and assets still answer on the blog
     host, and only an address nothing else owns is looked up under /blog:
     /<slug>, /tags/<tag>, /rss.xml and a post's share image. */
  rewrites: () => ({
    beforeFiles: [{ source: "/", has: blogHost, destination: "/blog" }],
    afterFiles: [],
    fallback: [{ source: "/:path*", has: blogHost, destination: "/blog/:path*" }],
  }),
};

/* Plugins are named as strings so Turbopack can load them. The first makes
   the compiler skip a post's front matter, which lib/blog-source.ts reads;
   the second adds tables. */
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-gfm"],
  },
});

export default withMDX(nextConfig);
