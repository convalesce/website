import type { Metadata } from "next";

import type { Post } from "@/lib/blog";
import { BLOG, PAGES, SITE, pageUrl, type PagePath } from "@/lib/content";

const page = (path: PagePath) => PAGES.find((p) => p.path === path)!;

const SHARED_KEYWORDS = ["Convalesce", "self-healing data infrastructure", "self-healing data pipelines"];

const PAGE_KEYWORDS: Record<PagePath, string[]> = {
  "/use-cases": [
    "data pipeline failures",
    "schema change broke pipeline",
    "column renamed upstream",
    "null values failing data quality check",
    "wrong numbers in dashboard",
    "silent data failure",
    "commit broke data pipeline",
    "flaky pipeline run",
    "root cause analysis for data pipelines",
    "data incident investigation",
  ],
  "/security": [
    "Convalesce security",
    "data security",
    "read-only data access",
    "PII masking",
    "data access controls",
    "subprocessors",
    "data deletion",
    "encryption in transit",
    "AI data handling",
  ],
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
  "/blog": [
    "data engineering blog",
    "data incident",
    "data incident cost",
    "data downtime",
    "pipeline failure walkthrough",
    "root cause analysis for data pipelines",
    "data on-call",
    "data incident postmortem",
    "data lineage",
    "data reliability",
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
  "/terms": ["terms of service", "acceptable use", "liability"],
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

const RSS = { "application/rss+xml": [{ url: `${BLOG.url}/rss.xml`, title: BLOG.title }] };

/* The blog's pages answer on their own host, so each names its address there
   in full and offers the feed. `path` is the address on that host. */
function onBlog(base: Metadata, path: string): Metadata {
  const url = `${BLOG.url}${path}`;
  return {
    ...base,
    alternates: { canonical: url, types: RSS },
    openGraph: { ...base.openGraph, url },
  };
}

export const blogMetadata = (): Metadata => onBlog(pageMetadata("/blog"), "/");

export function tagMetadata(tag: string): Metadata {
  const base = pageMetadata("/blog");
  const title = `Posts tagged ${tag}`;
  const description = `Every post on the ${SITE.company} blog tagged ${tag}.`;
  return onBlog(
    {
      ...base,
      title,
      description,
      openGraph: { ...base.openGraph, title: `${title} | ${SITE.company}`, description },
      twitter: { ...base.twitter, title: `${title} | ${SITE.company}`, description },
    },
    `/tags/${tag}`,
  );
}

/* A post's share card is drawn for it by app/blog/[slug]/opengraph-image.tsx.
   The base is the blog's host so that image is named where it is served,
   without a redirect in the way. */
export function postMetadata(post: Post): Metadata {
  const title = `${post.title} | ${SITE.company}`;
  return {
    metadataBase: new URL(BLOG.url),
    title: post.title,
    description: post.description,
    keywords: [...SHARED_KEYWORDS, ...post.tags.map((tag) => tag.replace(/-/g, " ")), ...PAGE_KEYWORDS["/blog"]],
    alternates: { canonical: post.url, types: RSS },
    openGraph: {
      title,
      description: post.description,
      url: post.url,
      siteName: SITE.company,
      locale: "en_GB",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [SITE.company],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title, description: post.description },
  };
}

/* The post as an Article, written by the organisation the home page declares,
   with the trail back through the blog. */
export function postJsonLd(post: Post) {
  const org = { "@type": "Organization", "@id": `${SITE.domain}/#org`, name: SITE.company, url: SITE.domain };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${post.url}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        author: org,
        publisher: org,
        url: post.url,
        mainEntityOfPage: post.url,
        image: `${BLOG.url}${post.path}/opengraph-image`,
        keywords: post.tags.join(", "),
        inLanguage: "en-GB",
        isPartOf: { "@id": `${SITE.domain}/#site` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${post.url}#trail`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE.company, item: SITE.domain },
          { "@type": "ListItem", position: 2, name: "Blog", item: pageUrl("/blog") },
          { "@type": "ListItem", position: 3, name: post.title, item: post.url },
        ],
      },
    ],
  };
}

/* What a page is and where it sits in the site, for crawlers: the page
   itself, joined to the site and organisation the home page declares, and
   the trail back to the home page. */
export function pageJsonLd(path: PagePath) {
  const { title, description, updated } = page(path);
  const url = pageUrl(path);
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
