import Link from "next/link";

import { JsonLd, PageShell } from "@/components/page-shell";
import { textLink } from "@/components/ui/text-link";
import { COMPANY, HERO, PRINCIPLES, SITE } from "@/lib/content";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/about");

const primary = "btn-primary inline-flex h-11 items-center rounded-md px-5 text-small font-medium whitespace-nowrap";

export default function Page() {
  return (
    <>
      <PageShell
        index="/about"
        label="Company"
        title="Fix the failure, with the evidence behind it."
        intro={HERO.body}
      >
        <section aria-labelledby="who" className="border-line grid gap-x-10 gap-y-6 border-t pt-10 lg:grid-cols-12">
          <h2 id="who" className="font-display text-h2 lg:col-span-4">Who we are</h2>
          <div className="lg:col-span-8">
            {COMPANY.story.map((line) => (
              <p key={line} className="text-muted mt-4 max-w-[60ch] text-pretty first:mt-0">{line}</p>
            ))}
            <dl className="border-line mt-8 grid gap-x-8 border-t sm:grid-cols-3">
              <div className="border-line border-b py-4">
                <dt className="text-faint text-small">Founded</dt>
                <dd className="text-ink mt-1">{COMPANY.founded.label}</dd>
              </div>
              <div className="border-line border-b py-4">
                <dt className="text-faint text-small">Based in</dt>
                <dd className="text-ink mt-1">{COMPANY.place.city}, {COMPANY.place.regionName}</dd>
              </div>
              <div className="border-line border-b py-4">
                <dt className="text-faint text-small">Founders</dt>
                <dd className="text-ink mt-1">
                  {COMPANY.founders.map((f) => (
                    <span key={f.name} className="mt-2 block first:mt-0">
                      {f.name}
                      <span className="text-faint text-small block">{f.role}</span>
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section aria-labelledby="believe" className="border-line mt-10 border-t pt-10">
          <h2 id="believe" className="font-display text-h2">What we hold to</h2>
          <ul className="mt-8">
            {PRINCIPLES.map((p) => (
              <li key={p.name} className="border-line grid gap-x-10 gap-y-2 border-t py-7 first:border-t-0 lg:grid-cols-12">
                <h3 className="font-display text-h3 lg:col-span-4">{p.name}</h3>
                <p className="text-muted max-w-[52ch] text-pretty lg:col-span-5">{p.body}</p>
                <p className="text-faint font-mono text-mono-sm lg:col-span-3">{p.proof}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="data" className="border-line mt-6 grid gap-x-10 gap-y-3 border-t pt-10 lg:grid-cols-12">
          <h2 id="data" className="font-display text-h2 lg:col-span-4">Your data</h2>
          <p className="text-muted max-w-[60ch] text-pretty lg:col-span-8">
            The details are written down, not promised: the{" "}
            <Link href="/privacy" className={textLink}>privacy policy</Link>, the{" "}
            <Link href="/terms" className={textLink}>terms of service</Link> and the{" "}
            <Link href="/dpa" className={textLink}>data processing addendum</Link>.
          </p>
        </section>

        <section aria-labelledby="talk" className="border-line mt-10 grid gap-x-10 gap-y-5 border-t pt-10 lg:grid-cols-12">
          <h2 id="talk" className="font-display text-h2 lg:col-span-4">Talk to us</h2>
          <div className="lg:col-span-8">
            <p className="text-muted max-w-[60ch] text-pretty">
              A question, a tool you need, or something to correct. A person reads every message, and the{" "}
              <a href={SITE.docs} target="_blank" rel="noopener noreferrer" className={textLink}>docs</a> cover setup.
            </p>
            <div className="mt-6">
              <Link href="/contact" className={primary}>Contact us</Link>
            </div>
          </div>
        </section>
      </PageShell>
      <JsonLd data={pageJsonLd("/about")} />
    </>
  );
}
