import type { VercelConfig } from "@vercel/config/v1";

/**
 * Vercel auto-detects the framework and build command. What it cannot infer is
 * the security posture, so that is what this file is for.
 */
export const config: VercelConfig = {
  framework: "nextjs",

  headers: [
    {
      source: "/(.*)",
      headers: [
        // the site embeds nothing and should never be embedded
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ],
    },
    {
      // fingerprinted build output is safe to cache forever
      source: "/_next/static/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],
};

export default config;
