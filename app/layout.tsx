import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { GA_ID } from "@/lib/analytics";
import { FAQ, SITE } from "@/lib/content";
import "./globals.css";

const display = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const sans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const title = `${SITE.company}: ${SITE.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: title,
    template: `%s | ${SITE.company}`,
  },
  description: SITE.description,
  applicationName: SITE.product,
  authors: [{ name: SITE.company, url: SITE.domain }],
  creator: SITE.company,
  publisher: SITE.company,
  category: "technology",
  /* Declared by hand from public/ rather than through the app/ file convention,
     for the two reasons the icon was missing from search results in the first
     place: the URLs stay clean and stable instead of carrying a build hash, and
     the theme-adaptive icon.svg is deliberately NOT declared. Google rasterises
     a favicon onto a white row, where that SVG's prefers-color-scheme stroke has
     nothing to hold on to. It stays on disk for anyone who wants it directly. */
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: { canonical: "/" },
  keywords: [
    // Brand.
    "Convalesce",
    "convalesce.io",
    // Core nouns.
    "data infrastructure",
    "data pipelines",
    "data workflows",
    "data warehouse",
    "data lakehouse",
    "data platform",
    "data orchestration",
    "data engineering",
    // The product.
    "self-healing",
    "self-healing data infrastructure",
    "self-healing data pipelines",
    "data pipeline automation",
    "pipeline failure recovery",
    "automated incident resolution",
    "pipeline monitoring",
    // Outcomes.
    "data observability",
    "data reliability",
    "data quality",
    "data downtime",
    "data incident response",
    // Mechanism.
    "data lineage",
    "blast radius analysis",
    "root cause analysis",
    "incident investigation",
    "schema drift",
    "schema drift detection",
    "evidence trail",
    // AI category.
    "AI agents for data",
    "agentic data engineering",
    "autonomous data operations",
    "AI data engineer",
    // Question keywords.
    "what is self-healing data infrastructure",
    "how to fix a failed data pipeline",
    "why did my data pipeline fail",
    "how to find the root cause of a pipeline failure",
    "what is blast radius in data",
    "how to detect schema drift",
    "data observability vs data quality",
  ],
  openGraph: {
    title,
    description: SITE.description,
    url: SITE.domain,
    siteName: SITE.company,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: SITE.description,
  },
  /* index+follow is the crawler default, so stating it here only duplicates
     the tag Next emits on /404. Only the googleBot extensions earn their tag. */
  robots: {
    googleBot: {
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

/* One graph, four entities: who we are, the site, the product, and the FAQ.
   Each node is addressable by id so crawlers can connect them. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.domain}/#org`,
      name: SITE.company,
      url: SITE.domain,
      description: SITE.description,
      /* Google's logo guidance wants dimensions it can trust, not a bare URL. */
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE.domain}/#logo`,
        url: `${SITE.domain}/favicon-512x512.png`,
        width: 512,
        height: 512,
        caption: SITE.company,
      },
      image: { "@id": `${SITE.domain}/#logo` },
      email: SITE.email,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: SITE.email,
        availableLanguage: "English",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.domain}/#site`,
      url: SITE.domain,
      name: SITE.company,
      description: SITE.description,
      publisher: { "@id": `${SITE.domain}/#org` },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE.domain}/#product`,
      name: SITE.product,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Cloud",
      description: SITE.description,
      url: SITE.domain,
      author: { "@id": `${SITE.domain}/#org` },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/PreOrder",
        url: `${SITE.domain}/#top`,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE.domain}/#faq`,
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        {/* The site is dark by design; Dark Reader would re-invert it into mush.
            Next drops a metadata `other` entry whose value is an empty string,
            so this one has to be a real tag. */}
        <meta name="darkreader-lock" />
      </head>
      <body className="bg-bg text-ink min-h-full">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
        <SpeedInsights />
        {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
      </body>
    </html>
  );
}
