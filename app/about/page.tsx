import Link from "next/link";

import { JsonLd, PageShell } from "@/components/page-shell";
import { HERO, PRINCIPLES, SITE } from "@/lib/content";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/about");

const link = "text-ink underline underline-offset-4 hover:text-accent-text transition-colors";
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
        <section aria-labelledby="believe" className="border-line border-t pt-10">
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
            <Link href="/privacy" className={link}>privacy policy</Link>, the{" "}
            <Link href="/terms" className={link}>terms of service</Link> and the{" "}
            <Link href="/dpa" className={link}>data processing addendum</Link>.
          </p>
        </section>

        <section aria-labelledby="talk" className="border-line mt-10 grid gap-x-10 gap-y-5 border-t pt-10 lg:grid-cols-12">
          <h2 id="talk" className="font-display text-h2 lg:col-span-4">Talk to us</h2>
          <div className="lg:col-span-8">
            <p className="text-muted max-w-[60ch] text-pretty">
              A question, a tool you need, or something to correct. A person reads every message, and the{" "}
              <a href={SITE.docs} target="_blank" rel="noopener noreferrer" className={link}>docs</a> cover setup.
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
