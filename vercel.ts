import type { VercelConfig } from "@vercel/config/v1";

/**
 * Vercel auto-detects the framework and build command. What it cannot infer is
 * the security posture, so that is what this file is for.
 */

/**
 * On Vercel with no dsn configured, @vercel/analytics and speed-insights load
 * from same-origin `/_vercel/*`. They fall back to va.vercel-scripts.com when
 * a dsn is set or in debug, so that host is allowed too rather than left as a
 * silent breakage waiting for a config change.
 *
 * The google wildcards are Google's own documented GA4 allowlist: the collect
 * beacon picks a regional subdomain, so pinning one region would drop hits
 * from every other region.
 *
 * script-src carries 'unsafe-inline' because Next inlines the RSC payload and
 * the hydration bootstrap, and there is no nonce to hand them without putting
 * middleware in front of a fully static site. The allowlist still blocks
 * script loads from any host not listed here.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://*.googletagmanager.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.google-analytics.com https://*.googletagmanager.com https://va.vercel-scripts.com",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

export const config: VercelConfig = {
  framework: "nextjs",

  headers: [
    {
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: csp },
        // the site embeds nothing and should never be embedded
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
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
