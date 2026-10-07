import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd, PageShell } from "@/components/page-shell";
import { ToolLogo } from "@/components/ui/tool-logo";
import { SITE } from "@/lib/content";
import { INTEGRATION_PAGES, READ_ONLY, byOne } from "@/lib/integrations";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return INTEGRATION_PAGES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const tool = byOne((await params).slug);
  if (!tool) return {};
  const title = `${tool.name} integration`;
  const path = `/integrations/${tool.slug}`;
  const card = { url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE.company}: ${SITE.tagline}` };
  return {
    title,
    description: tool.summary,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${SITE.company}`, description: tool.summary, url: path, siteName: SITE.company, locale: "en_US", type: "article", images: [card] },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE.company}`, description: tool.summary, images: [card] },
  };
}

const link = "text-ink underline underline-offset-4";
const button =
  "bg-ink text-bg inline-flex min-h-11 items-center rounded-md px-5 py-2.5 font-medium";

export default async function Page({ params }: { params: Promise<Params> }) {
  const tool = byOne((await params).slug);
  if (!tool) notFound();

  const url = `${SITE.domain}/integrations/${tool.slug}`;
  const guide = tool.docs ? `${SITE.docs}/docs/${tool.docs}` : null;
  const trail = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: `${tool.name} integration`,
        description: tool.summary,
        isPartOf: { "@id": `${SITE.domain}/#site` },
        publisher: { "@id": `${SITE.domain}/#org` },
        breadcrumb: { "@id": `${url}#trail` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#trail`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE.company, item: SITE.domain },
          { "@type": "ListItem", position: 2, name: "Integrations", item: `${SITE.domain}/integrations` },
          { "@type": "ListItem", position: 3, name: tool.name, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <PageShell
        index="I"
        label={tool.kind}
        title={`${tool.name} with Convalesce`}
        intro={tool.summary}
      >
        <div className="max-w-[72ch]">
          <div className="flex items-center gap-3.5">
            <ToolLogo name={tool.name} className="size-8" />
            <span className="mono-label border-line text-faint rounded-sm border px-2 py-1">
              {tool.status === "live" ? "Live" : "Coming soon"}
            </span>
          </div>

          {tool.reads.length > 0 ? (
            <>
              <h2 className="font-display text-h3 mt-10">What Convalesce reads</h2>
              <ul className="text-muted marker:text-faint mt-4 list-disc space-y-2 pl-5">
                {tool.reads.map((r) => (
                  <li key={r} className="pl-1">{r}</li>
                ))}
              </ul>
            </>
          ) : null}

          {tool.status === "live" ? (
            <>
              <h2 className="font-display text-h3 mt-10">How it connects</h2>
              {tool.pip ? (
                <>
                  <p className="text-muted mt-4">
                    Install the plugin where {tool.name} runs and set one key. Nothing is opened inbound on your side.
                  </p>
                  <pre className="border-line mt-4 overflow-x-auto rounded-md border p-4 text-small">
                    <code>{tool.name === "Spark" ? "Attach the convalesce-emit-spark listener" : `pip install ${tool.pip}`}</code>
                  </pre>
                  <p className="text-muted mt-4">
                    See every release in the <Link href="/changelog" className={link}>changelog</Link>.
                  </p>
                </>
              ) : (
                <p className="text-muted mt-4">{READ_ONLY}</p>
              )}
            </>
          ) : null}

          <div className="mt-12 flex flex-wrap gap-3">
            {guide ? (
              <a href={guide} target="_blank" rel="noopener noreferrer" className={button}>
                Read the setup guide
              </a>
            ) : null}
            {tool.status === "live" ? (
              <a href={SITE.app} target="_blank" rel="noopener noreferrer" className={guide ? `${link} inline-flex min-h-11 items-center` : button}>
                Connect {tool.name}
              </a>
            ) : (
              <Link href="/contact?topic=integration" className={button}>
                Tell us you want {tool.name}
              </Link>
            )}
          </div>

          <p className="text-muted mt-12">
            <Link href="/integrations" className={link}>All integrations</Link>
          </p>
        </div>
      </PageShell>
      <JsonLd data={trail} />
    </>
  );
}
