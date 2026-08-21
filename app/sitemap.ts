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
    },
  ];
}
