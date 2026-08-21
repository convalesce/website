import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

/* The answer-engine crawlers are named explicitly rather than left to the
   wildcard, because this site ships llms.txt and llms-full.txt for exactly
   those readers. /_next/ is deliberately NOT disallowed: Google renders the
   page before ranking it, and blocking the JS and CSS blinds that render. */
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE.domain}/sitemap.xml`,
  };
}
