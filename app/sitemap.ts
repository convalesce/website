import type { MetadataRoute } from "next";
import { PAGES, SITE } from "@/lib/content";

/* Pinned so lastmod means "the content changed", not "the site rebuilt".
   Bump it when the page copy changes. */
const LAST_MODIFIED = new Date("2026-10-06");

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
      url: `${SITE.domain}${page.path}`,
      lastModified: new Date(page.updated),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
