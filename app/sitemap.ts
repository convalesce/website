import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

/* Pinned so lastmod means "the content changed", not "the site rebuilt".
   Bump it when the page copy changes. */
const LAST_MODIFIED = new Date("2026-08-21");

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
  ];
}
