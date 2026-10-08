import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/footer";
import { Section } from "@/components/frame";
import { JsonLd } from "@/components/page-shell";
import { Nav } from "@/components/nav";
import { ToolLogo } from "@/components/ui/tool-logo";
import { SITE } from "@/lib/content";
import { latestVersion } from "@/lib/versions";
import {
  DEFAULT_BOUNDARY,
  DEFAULT_STEPS,
  INTEGRATION_PAGES,
  byOne,
  type IntegrationPage,
} from "@/lib/integrations";

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
    keywords: [
      `${tool.name} integration`,
      `${tool.name} monitoring`,
      `${tool.name} failure recovery`,
      `${tool.name} pipeline failure`,
      `${tool.name} data observability`,
      `${tool.name} lineage`,
      `self-healing ${tool.name}`,
      `${tool.name} root cause analysis`,
      `${tool.name} incident response`,
      `Convalesce ${tool.name}`,
      "Convalesce",
      "self-healing data infrastructure",
    ],
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${SITE.company}`, description: tool.summary, url: path, siteName: SITE.company, locale: "en_US", type: "article", images: [card] },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE.company}`, description: tool.summary, images: [card] },
  };
}

type Line = { text: string; tone?: "ink" | "faint" | "accent" };

/* The connection, as the person will actually do it: the panel on the right
   of the page is the one place the page shows the product rather than
   describing it. */
function connection(tool: IntegrationPage, sparkVersion: string): { title: string; lines: Line[] } {
  if (tool.status === "soon") {
    return {
      title: `${tool.slug} · not yet`,
      lines: [
        { text: "status      coming soon", tone: "faint" },
        { text: "request     tell us what you would want it to show", tone: "ink" },
      ],
    };
  }
  if (tool.name === "Spark") {
    return {
      title: "spark-defaults.conf",
      lines: [
        { text: `spark.jars.packages   io.convalesce:convalesce-emit-spark:${sparkVersion}` },
        { text: "spark.extraListeners  io.convalesce.emit.spark.ConvalesceSparkListener" },
        { text: "CONVALESCE_INGEST_KEY=<your key>", tone: "faint" },
        { text: "first run reports itself", tone: "accent" },
      ],
    };
  }
  if (tool.pip) {
    return {
      title: `${tool.slug} · worker`,
      lines: [
        { text: `$ pip install ${tool.pip}` },
        { text: "$ export CONVALESCE_INGEST_KEY=<your key>", tone: "faint" },
        { text: "first run reports itself", tone: "accent" },
      ],
    };
  }
  return {
    title: `${tool.slug} · connection`,
    lines: [
      { text: "access      read-only", tone: "ink" },
      { text: "install     nothing on your side", tone: "ink" },
      { text: "network     outbound HTTPS from Convalesce", tone: "faint" },
      { text: "first read in minutes", tone: "accent" },
    ],
  };
}

const toneClass = { ink: "text-ink", faint: "text-faint", accent: "text-accent-text" } as const;

function ConnectionPanel({ tool, sparkVersion }: { tool: IntegrationPage; sparkVersion: string }) {
  const { title, lines } = connection(tool, sparkVersion);
  return (
    <figure className="border-line bg-surface overflow-hidden rounded-lg border">
      <figcaption className="border-line flex items-center justify-between border-b px-4 py-3">
        <span className="mono-label">{title}</span>
        <span className="mono-label inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={`size-1.5 rounded-full ${tool.status === "live" ? "bg-accent" : "bg-faint"}`}
          />
          {tool.status === "live" ? "Live" : "Coming soon"}
        </span>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-5 text-mono-sm sm:text-mono" tabIndex={0}>
        <code className="grid gap-1.5 font-mono">
          {lines.map((line) => (
            <span key={line.text} className={toneClass[line.tone ?? "ink"]}>
              {line.tone === "accent" ? "● " : ""}
              {line.text}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

const primary = "btn-primary inline-flex h-11 items-center gap-2 rounded-md px-5 text-small font-medium whitespace-nowrap";
const secondary =
  "border-ink/25 bg-bg/60 text-ink hover:border-ink/40 hover:bg-ink/[0.06] inline-flex h-11 items-center gap-2 rounded-md border px-5 text-small font-medium whitespace-nowrap transition-colors";

export default async function Page({ params }: { params: Promise<Params> }) {
  const tool = byOne((await params).slug);
  if (!tool) notFound();

  const sparkVersion = tool.name === "Spark" ? await latestVersion({ kind: "maven", id: "convalesce-emit-spark" }) : "";
  const live = tool.status === "live";
  const way = tool.pip ? "plugin" : "read";
  const steps = tool.steps ?? DEFAULT_STEPS[way];
  const boundary = tool.boundary ?? DEFAULT_BOUNDARY[way];
  const guide = tool.docs ? `${SITE.docs}/docs/${tool.docs}` : null;
  const siblings = INTEGRATION_PAGES.filter((i) => i.kind === tool.kind && i.slug !== tool.slug);
  const neighbours = (siblings.length > 0 ? siblings : INTEGRATION_PAGES.filter((i) => i.slug !== tool.slug && i.status === "live")).slice(0, 4);

  const url = `${SITE.domain}/integrations/${tool.slug}`;
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
      <Nav />
      <main id="main">
        <Section index={`/integrations/${tool.slug}`} label={tool.kind} pad="tight">
          <nav aria-label="Breadcrumb" className="text-small text-faint pt-8">
            <Link href="/integrations" className="hover:text-ink transition-colors">
              Integrations
            </Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="text-muted">{tool.name}</span>
          </nav>

          <div className="grid gap-10 pt-8 pb-14 lg:grid-cols-12 lg:gap-12 lg:pt-12 lg:pb-20">
            <div className="min-w-0 lg:col-span-7">
              <div className="border-line bg-surface grid size-16 place-items-center rounded-lg border">
                <ToolLogo name={tool.name} className="size-9" />
              </div>
              <h1 className="font-display text-display mt-7 text-balance">
                {tool.name} <span className="text-muted">with Convalesce</span>
              </h1>
              <p className="text-muted mt-6 max-w-[56ch] text-pretty">{tool.summary}</p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                {live ? (
                  <>
                    {guide ? (
                      <a href={guide} target="_blank" rel="noopener noreferrer" className={primary}>
                        Read the setup guide
                      </a>
                    ) : null}
                    <a
                      href={SITE.app}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={guide ? secondary : primary}
                    >
                      Connect {tool.name}
                    </a>
                  </>
                ) : (
                  <Link href="/contact?topic=integration" className={primary}>
                    Tell us you want {tool.name}
                  </Link>
                )}
              </div>
            </div>

            <div className="min-w-0 lg:col-span-5 lg:self-center">
              <ConnectionPanel tool={tool} sparkVersion={sparkVersion} />
            </div>
          </div>

          {live ? (
            <div className="border-line grid border-t lg:grid-cols-12">
              <div className="border-line py-10 lg:col-span-5 lg:border-r lg:py-12 lg:pr-10">
                <h2 className="font-display text-h2">What it reads</h2>
                <ul className="mt-6 grid gap-3">
                  {tool.reads.map((r) => (
                    <li key={r} className="text-muted flex gap-3">
                      <span aria-hidden="true" className="bg-accent mt-[0.62em] size-1.5 shrink-0 rounded-full" />
                      {r}
                    </li>
                  ))}
                </ul>
                <p className="text-faint text-small mt-8 max-w-[46ch]">{boundary}</p>
              </div>

              <div className="py-10 lg:col-span-7 lg:py-12 lg:pl-10">
                <h2 className="font-display text-h2">How it connects</h2>
                <ol className="mt-6">
                  {steps.map((step, i) => (
                    <li key={step} className="border-line grid grid-cols-[2rem_1fr] gap-3 border-t py-4 first:border-t-0 first:pt-0">
                      <span className="mono-label pt-1">{i + 1}</span>
                      <span className="text-ink">{step}</span>
                    </li>
                  ))}
                </ol>
                {tool.pip ? (
                  <p className="text-faint text-small mt-6">
                    Each release is listed in the{" "}
                    <Link href="/changelog" className="text-ink underline underline-offset-4">
                      changelog
                    </Link>
                    .
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="border-line border-t pt-10 lg:pt-12">
            <h2 className="font-display text-h3">{siblings.length > 0 ? `Other ${tool.kind.toLowerCase()} tools` : "Also connects"}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {neighbours.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={`/integrations/${n.slug}`}
                    className="border-line hover:bg-ink/[0.03] flex items-center gap-3 rounded-lg border p-4 transition-colors"
                  >
                    <ToolLogo name={n.name} />
                    <span className="text-h3 text-balance">{n.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </main>
      <Footer />
      <JsonLd data={trail} />
    </>
  );
}
