import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/blog";
import { PAGES, SITE, pageUrl } from "@/lib/content";
import { INTEGRATION_PAGES } from "@/lib/integrations";

/* Pinned so lastmod means "the content changed", not "the site rebuilt".
   Bump it when the page copy changes. */
const LAST_MODIFIED = new Date("2026-10-09");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.domain,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
      /* The share card is the only image the site has. Naming it here is what
         makes it discoverable to image search, which never sees an og: tag. */
      images: [`${SITE.domain}/opengraph-image`],
    },
    ...PAGES.map((page) => ({
      url: pageUrl(page.path),
      lastModified: new Date(page.updated),
      changeFrequency: page.priority > 0.3 ? ("monthly" as const) : ("yearly" as const),
      priority: page.priority,
    })),
    ...INTEGRATION_PAGES.map((tool) => ({
      url: `${SITE.domain}/integrations/${tool.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...POSTS.map((post) => ({
      url: post.url,
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
