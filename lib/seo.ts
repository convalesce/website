import type { Metadata } from "next";

import { PAGES, SITE, type PagePath } from "@/lib/content";

const page = (path: PagePath) => PAGES.find((p) => p.path === path)!;

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
