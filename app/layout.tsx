import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { GA_ID } from "@/lib/analytics";
import { SITE } from "@/lib/content";
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

const title = `${SITE.product} by ${SITE.company}: ${SITE.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: title,
    template: `%s | ${SITE.company}`,
  },
  description: SITE.description,
  applicationName: SITE.product,
  keywords: [
    "data pipelines",
    "self-healing",
    "data observability",
    "Airflow",
    "data lineage",
    "incident investigation",
  ],
  openGraph: {
    title,
    description: SITE.description,
    url: SITE.domain,
    siteName: SITE.company,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.company,
  url: SITE.domain,
  description: SITE.description,
  email: SITE.email,
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "SoftwareApplication",
      name: SITE.product,
      applicationCategory: "DeveloperApplication",
      description: SITE.description,
    },
  },
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
