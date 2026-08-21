import type { MetadataRoute } from "next";

import { SITE } from "@/lib/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.company}: ${SITE.tagline}`,
    short_name: SITE.company,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { src: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { src: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { src: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
      /* Android installs from these two. */
      { src: "/favicon-192x192.png", type: "image/png", sizes: "192x192", purpose: "any" },
      { src: "/favicon-512x512.png", type: "image/png", sizes: "512x512", purpose: "any" },
    ],
  };
}
