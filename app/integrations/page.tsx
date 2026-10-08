import Link from "next/link";

import { JsonLd, PageShell } from "@/components/page-shell";
import { Grid } from "@/components/ui/grid";
import { textLink } from "@/components/ui/text-link";
import { ToolLogo } from "@/components/ui/tool-logo";
import { SITE } from "@/lib/content";
import { INTEGRATION_PAGES, type IntegrationPage } from "@/lib/integrations";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/integrations");

const GROUPS: { id: string; heading: string; kinds: readonly string[] }[] = [
  { id: "orchestration", heading: "Orchestration and processing", kinds: ["Orchestrator", "Transformation", "Processing", "Data quality"] },
  { id: "storage", heading: "Warehouses, lakes and databases", kinds: ["Warehouse", "Lakehouse", "Database", "Storage"] },
  { id: "streaming", heading: "Streaming and ingestion", kinds: ["Streaming", "Ingestion"] },
  { id: "catalogues", heading: "Catalogues, code and dashboards", kinds: ["Catalogue and jobs", "Catalogue", "Code and pull requests", "Inputs, outputs and runs", "Dashboards", "Machine learning"] },
];

function Tool({ tool }: { tool: IntegrationPage }) {
  const live = tool.status === "live";
  return (
    <Link
      href={`/integrations/${tool.slug}`}
      className="border-line hover:bg-ink/[0.04] group flex items-center gap-4 border-r border-b p-5 transition-colors lg:p-6"
    >
      <span className={live ? "" : "opacity-60"}>
        <ToolLogo name={tool.name} className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`text-h3 block text-balance ${live ? "" : "text-muted"}`}>{tool.name}</span>
        <span className="text-faint text-small block">{tool.kind}</span>
      </span>
      {live ? (
        <span className="text-accent-text text-small inline-flex shrink-0 items-center gap-1.5">
          <span aria-hidden="true" className="bg-accent size-1.5 rounded-full" />
          Live
        </span>
      ) : (
        <span className="text-faint text-small shrink-0">Soon</span>
      )}
    </Link>
  );
}

export default function Page() {
  const live = INTEGRATION_PAGES.filter((t) => t.status === "live").length;
  const soon = INTEGRATION_PAGES.length - live;
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: INTEGRATION_PAGES.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tool.name,
      url: `${SITE.domain}/integrations/${tool.slug}`,
    })),
  };
  return (
    <>
      <PageShell
        index="/integrations"
        label="Connect"
        title="Connect the tools you already run."
        intro={`${live} tools connect today and ${soon} more are on the way. Convalesce reads run metadata and schema shape, so start with one, follow its setup guide, and add more when you need them.`}
      >
        <div className="space-y-14">
          {GROUPS.map((group) => {
            const tools = INTEGRATION_PAGES.filter((t) => group.kinds.includes(t.kind));
            return (
              <section key={group.id} aria-labelledby={group.id}>
                <h2 id={group.id} className="font-display text-h3 mb-5">
                  {group.heading}
                </h2>
                <Grid cols={3}>
                  {tools.map((tool) => (
                    <Tool key={tool.name} tool={tool} />
                  ))}
                </Grid>
              </section>
            );
          })}
        </div>

        <p className="text-muted mt-14 max-w-[60ch]">
          Do not see your tool?{" "}
          <Link href="/contact?topic=integration" className={textLink}>
            Tell us which one you need next
          </Link>
          , or browse every connector in the{" "}
          <a href={SITE.docs} target="_blank" rel="noopener noreferrer" className={textLink}>
            docs
          </a>
          .
        </p>
      </PageShell>
      <JsonLd data={pageJsonLd("/integrations")} />
      <JsonLd data={list} />
    </>
  );
}
