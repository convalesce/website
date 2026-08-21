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
  alternates: { canonical: "/" },
  keywords: [
    "data infrastructure",
    "data pipelines",
    "data workflows",
    "data warehouse",
    "data lakehouse",
    "data platform",
    "self-healing",
    "self-healing data pipelines",
    "data pipeline automation",
    "pipeline failure recovery",
    "pipeline monitoring",
    "data observability",
    "data reliability",
    "data quality",
    "data downtime",
    "data lineage",
    "blast radius analysis",
    "root cause analysis",
    "incident investigation",
    "schema drift",
    "data orchestration",
    "data engineering",
    "AI agents for data",
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
      logo: `${SITE.domain}/icon.svg`,
      email: SITE.email,
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
