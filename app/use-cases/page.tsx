import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { JsonLd, PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { textLink } from "@/components/ui/text-link";
import { bySlug } from "@/lib/blog";
import { CLOSER, SITE, USE_CASES } from "@/lib/content";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/use-cases");

const columns = "lg:grid lg:grid-cols-12 lg:gap-x-10";

export default function Page() {
  const pillar = bySlug("what-a-data-incident-really-costs");
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: USE_CASES.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${SITE.domain}/use-cases#${item.id}`,
    })),
  };
  return (
    <>
      <PageShell
        index="/use-cases"
        label="Use cases"
        title="The failures Convalesce investigates."
        intro="Six kinds of failure a data team meets again and again. For each one: what the team sees first, and what Convalesce gathers to explain it."
        meta={
          pillar ? (
            <p className="text-muted mt-4 max-w-[62ch] text-pretty">
              What these cost a team is in{" "}
              <a href={pillar.url} className={textLink}>
                {pillar.title}
              </a>
              .
            </p>
          ) : null
        }
      >
        {/* the two questions head their columns once on a wide screen; on a
            narrow one each row names them itself */}
        <div aria-hidden="true" className={`border-line hidden border-t py-4 ${columns}`}>
          <span className="mono-label lg:col-span-4">The failure</span>
          <span className="mono-label lg:col-span-4">What the team sees</span>
          <span className="mono-label lg:col-span-4">What Convalesce gathers</span>
        </div>
        <ol className="border-line border-t">
          {USE_CASES.map((item) => (
            <li
              key={item.id}
              id={item.id}
              className={`border-line scroll-mt-24 border-b py-8 lg:py-10 ${columns}`}
            >
              <h2 className="font-display text-lead max-w-[24ch] font-semibold text-balance lg:col-span-4">
                {item.name}
              </h2>
              <div className="mt-5 lg:col-span-4 lg:mt-0">
                <h3 className="mono-label mb-2 lg:sr-only">What the team sees</h3>
                <p className="text-muted max-w-[60ch] text-pretty">{item.sees}</p>
              </div>
              <div className="mt-5 lg:col-span-4 lg:mt-0">
                <h3 className="mono-label mb-2 lg:sr-only">What Convalesce gathers</h3>
                <p className="max-w-[60ch] text-pretty">{item.gathers}</p>
                <p className="text-faint text-mono-sm mt-3 font-mono">{item.signals}</p>
              </div>
            </li>
          ))}
        </ol>

        <section aria-labelledby="next" className="mt-14 grid gap-x-10 gap-y-5 lg:mt-20 lg:grid-cols-12">
          <h2 id="next" className="font-display text-h2 max-w-[16ch] text-balance lg:col-span-4">
            {CLOSER.head}
          </h2>
          <div className="lg:col-span-8">
            <p className="text-muted max-w-[60ch] text-pretty">
              {CLOSER.body} See{" "}
              <Link href="/integrations" className={textLink}>
                the tools it connects to
              </Link>{" "}
              and{" "}
              <Link href="/security" className={textLink}>
                what it reads and sends
              </Link>
              .
            </p>
            <div className="mt-6">
              <Button
                href={CLOSER.cta.href}
                event="open_app"
                label={CLOSER.cta.label}
                trailing={<ArrowUpRight className="size-4" />}
              >
                {CLOSER.cta.label}
              </Button>
            </div>
          </div>
        </section>
      </PageShell>
      <JsonLd data={pageJsonLd("/use-cases")} />
      <JsonLd data={list} />
    </>
  );
}
