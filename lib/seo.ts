import type { Metadata } from "next";

import { PAGES, SITE, type PagePath } from "@/lib/content";

const page = (path: PagePath) => PAGES.find((p) => p.path === path)!;

const SHARED_KEYWORDS = ["Convalesce", "self-healing data infrastructure", "self-healing data pipelines"];

const PAGE_KEYWORDS: Record<PagePath, string[]> = {
  "/integrations": [
    "data pipeline integrations",
    "Airflow integration",
    "Dagster integration",
    "Prefect integration",
    "dbt integration",
    "Spark integration",
    "Snowflake integration",
    "Databricks integration",
    "BigQuery integration",
    "Kafka integration",
    "Great Expectations integration",
    "data observability integrations",
    "orchestrator integrations",
    "warehouse integrations",
    "lineage integrations",
    "connect data tools",
  ],
  "/changelog": [
    "Convalesce changelog",
    "release notes",
    "plugin releases",
    "Airflow plugin release",
    "Dagster plugin release",
    "Prefect plugin release",
    "Great Expectations plugin release",
    "Spark plugin release",
    "data observability release notes",
  ],
  "/about": [
    "about Convalesce",
    "why self-healing data infrastructure",
    "incident evidence",
    "evidence-backed remediation",
    "data pipeline incidents",
    "data privacy",
    "data reliability company",
  ],
  "/contact": [
    "contact Convalesce",
    "Convalesce support",
    "request an integration",
    "data pipeline help",
    "privacy request",
    "product questions",
  ],
  "/privacy": ["privacy policy", "personal data", "data retention", "data subject rights", "GDPR"],
  "/terms": ["terms of service", "free beta terms", "acceptable use", "liability"],
  "/dpa": ["data processing addendum", "DPA", "subprocessors", "GDPR", "data transfers", "security measures"],
};

/* A page's own title, description and address, for search results and for
   share cards. Without the openGraph block a page inherits the home page's,
   and a shared link to the privacy policy would be titled as the home page
   and point back at it. */
export function pageMetadata(path: PagePath): Metadata {
  const { title, description } = page(path);
  /* The site has one share card, and a page under the home page does not
     pick it up on its own, so it is named here. */
  const card = {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: `${SITE.company}: ${SITE.tagline}`,
  };
  return {
    title,
    description,
    keywords: [...SHARED_KEYWORDS, ...PAGE_KEYWORDS[path]],
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${SITE.company}`,
      description,
      url: path,
      siteName: SITE.company,
      locale: "en_US",
      type: "article",
      images: [card],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.company}`,
      description,
      images: [card],
    },
  };
}

/* What a page is and where it sits in the site, for crawlers: the page
   itself, joined to the site and organisation the home page declares, and
   the trail back to the home page. */
export function pageJsonLd(path: PagePath) {
  const { title, description, updated } = page(path);
  const url = `${SITE.domain}${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: title,
        description,
        dateModified: updated,
        inLanguage: "en",
        isPartOf: { "@id": `${SITE.domain}/#site` },
        publisher: { "@id": `${SITE.domain}/#org` },
        breadcrumb: { "@id": `${url}#trail` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#trail`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: SITE.company,
            item: SITE.domain,
          },
          { "@type": "ListItem", position: 2, name: title, item: url },
        ],
      },
    ],
  };
}
