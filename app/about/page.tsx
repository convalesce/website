import Link from "next/link";
import type { ReactNode } from "react";

import { JsonLd, PageShell } from "@/components/page-shell";
import { textLink } from "@/components/ui/text-link";
import { COMPANY, PRINCIPLES, SITE } from "@/lib/content";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/about");

const primary = "btn-primary inline-flex h-11 items-center rounded-md px-5 text-small font-medium whitespace-nowrap";

/* Every section is one row of the page's grid: its heading in the first
   third, what it says in the rest, a hairline above, the same space each time. */
function Part({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-line grid gap-x-10 gap-y-6 border-t py-12 lg:grid-cols-12 lg:py-16">
      <h2 id={id} className="font-display text-h2 text-balance lg:col-span-4">{title}</h2>
      <div className="lg:col-span-8">{children}</div>
    </section>
  );
}

export default function Page() {
  const [met, problem, started] = COMPANY.story;
  return (
    <>
      <PageShell index="/about" label="Company" title="We built the fix we kept needing." intro={met} standfirst>
        <Part id="why" title="The hour after the alert">
          <p className="text-soft text-prose max-w-[62ch] text-pretty">{problem}</p>
          <p className="text-soft text-prose mt-5 max-w-[62ch] text-pretty">{started}</p>
          <dl className="mt-10 flex flex-wrap gap-x-14 gap-y-6">
            <div>
              <dt className="text-faint text-small">Founded</dt>
              <dd className="text-ink text-h3 mt-1">{COMPANY.founded.label}</dd>
            </div>
            <div>
              <dt className="text-faint text-small">Based in</dt>
              <dd className="text-ink text-h3 mt-1">{COMPANY.place.city}, {COMPANY.place.regionName}</dd>
            </div>
          </dl>
        </Part>

        <Part id="founders" title="Founders">
          <ul className="grid sm:grid-cols-2">
            {COMPANY.founders.map((f) => (
              <li key={f.name} className="border-line max-sm:not-first:mt-6 max-sm:not-first:border-t max-sm:not-first:pt-6 sm:px-8 sm:first:pl-0 sm:not-first:border-l">
                <p className="font-display text-h2 text-ink text-balance">{f.name}</p>
                <p className="text-muted mt-2">{f.role}</p>
              </li>
            ))}
          </ul>
        </Part>

        <Part id="believe" title="What we hold to">
          <ul>
            {PRINCIPLES.map((p) => (
              <li key={p.name} className="border-line grid gap-x-8 gap-y-2 border-t py-6 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1fr)_14rem]">
                <div>
                  <h3 className="font-display text-h3">{p.name}</h3>
                  <p className="text-muted mt-2 max-w-[52ch] text-pretty">{p.body}</p>
                </div>
                <p className="text-faint font-mono text-mono-sm md:pt-1">{p.proof}</p>
              </li>
            ))}
          </ul>
        </Part>

        <Part id="data" title="Your data">
          <p className="text-muted max-w-[60ch] text-pretty">
            The details are written down, not promised: the{" "}
            <Link href="/privacy" className={textLink}>privacy policy</Link>, the{" "}
            <Link href="/terms" className={textLink}>terms of service</Link> and the{" "}
            <Link href="/dpa" className={textLink}>data processing addendum</Link>.
          </p>
        </Part>

        <Part id="talk" title="Talk to us">
          <p className="text-muted max-w-[60ch] text-pretty">
            A question, a tool you need, or something to correct. A person reads every message, and the{" "}
            <a href={SITE.docs} target="_blank" rel="noopener noreferrer" className={textLink}>docs</a> cover setup.
          </p>
          <div className="mt-6">
            <Link href="/contact" className={primary}>Contact us</Link>
          </div>
        </Part>
      </PageShell>
      <JsonLd data={pageJsonLd("/about")} />
    </>
  );
}
