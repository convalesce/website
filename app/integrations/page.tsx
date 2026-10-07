import { Circle } from "lucide-react";
import Link from "next/link";

import { JsonLd, PageShell } from "@/components/page-shell";
import { ToolLogo } from "@/components/ui/tool-logo";
import { INTEGRATIONS, SITE } from "@/lib/content";
import { INTEGRATION_PAGES, slugOf, type IntegrationPage } from "@/lib/integrations";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/integrations");

const GROUPS: { heading: string; kinds: readonly string[] }[] = [
  { heading: "Orchestration and processing", kinds: ["Orchestrator", "Transformation", "Processing", "Data quality"] },
  { heading: "Warehouses, lakes and databases", kinds: ["Warehouse", "Lakehouse", "Database", "Storage"] },
  { heading: "Streaming and ingestion", kinds: ["Streaming", "Ingestion"] },
  { heading: "Catalogues, code and dashboards", kinds: ["Catalogue and jobs", "Catalogue", "Code and pull requests", "Inputs, outputs and runs", "Dashboards", "Machine learning"] },
];

const chip = "mono-label inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-line px-2 py-1 text-faint";

function Card({ tool }: { tool: IntegrationPage }) {
  const body = (
    <>
      <div className="flex items-center gap-3.5">
        <ToolLogo name={tool.name} />
        <div className="min-w-0">
          <h3 className="text-h3 text-balance">{tool.name}</h3>
          <p className="text-faint text-small mt-0.5">{tool.kind}</p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        {tool.status === "live" ? (
          <span className={chip}>
            <Circle aria-hidden="true" className="text-accent size-2 fill-current" />
            Live
          </span>
        ) : (
          <span className={chip}>Coming soon</span>
        )}
        <span className="text-ink text-small underline underline-offset-4">Details</span>
      </div>
    </>
  );
  return (
    <Link
      href={`/integrations/${tool.slug}`}
      className="border-line hover:bg-ink/[0.03] block rounded-lg border p-5 transition-colors"
    >
      {body}
    </Link>
  );
}

export default function Page() {
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: INTEGRATIONS.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tool.name,
      url: `${SITE.domain}/integrations/${slugOf(tool.name)}`,
    })),
  };
  return (
    <>
      <PageShell
        index="I"
        label="Integrations"
        title="Connect the tools you already run."
        intro="Convalesce reads run metadata and schema shape. Pick one tool to begin, follow its setup guide in the docs, and add more as you need them."
      >
        <div className="space-y-14">
          {GROUPS.map((group) => {
            const tools = INTEGRATION_PAGES.filter((t) => group.kinds.includes(t.kind));
            return (
              <section key={group.heading} aria-labelledby={group.heading}>
                <h2 id={group.heading} className="font-display text-h3 mb-5">
                  {group.heading}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => (
                    <Card key={tool.name} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <p className="text-muted mt-14 max-w-[60ch]">
          Do not see your tool? <a href="/contact?topic=integration" className="text-ink underline underline-offset-4">Tell us which one you need next</a>, or browse every connector in the{" "}
          <a href={SITE.docs} target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-4">docs</a>.
        </p>
      </PageShell>
      <JsonLd data={pageJsonLd("/integrations")} />
      <JsonLd data={list} />
    </>
  );
}
