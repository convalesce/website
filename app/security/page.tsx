import Link from "next/link";

import { JsonLd, PageShell } from "@/components/page-shell";
import { textLink } from "@/components/ui/text-link";
import { SECURITY_MEASURES, SECURITY_TOPICS, SITE } from "@/lib/content";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/security");

const row = "border-line scroll-mt-24 grid gap-x-10 gap-y-4 border-t py-10 lg:grid-cols-12";
const heading = "font-display text-h2 text-balance lg:col-span-4";
const source = "text-faint text-small mt-5";

const CONTENTS = [
  ...SECURITY_TOPICS.map((topic) => ({ id: topic.id, label: topic.heading })),
  { id: "measures", label: "The measures in place" },
  { id: "shared", label: "Who else processes your data" },
];

export default function Page() {
  return (
    <>
      <PageShell
        index="/security"
        label="Security and data"
        title="What Convalesce reads, sends and changes."
        intro="Convalesce works on your pipelines, so this page says plainly what it touches. Where an answer rests on the legal pages, it links to the part it comes from."
        meta={
          <nav aria-label="On this page" className="mt-8">
            <ul className="text-small flex flex-wrap gap-x-6">
              {CONTENTS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-muted hover:text-ink inline-flex min-h-11 items-center transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      >
        {SECURITY_TOPICS.map((topic) => (
          <section key={topic.id} id={topic.id} aria-labelledby={`${topic.id}-h`} className={row}>
            <h2 id={`${topic.id}-h`} className={heading}>
              {topic.heading}
            </h2>
            <div className="lg:col-span-8">
              {topic.body.map((text, i) => (
                <p
                  key={text}
                  className={`max-w-[62ch] text-pretty ${i === 0 ? "text-ink text-lead" : "text-muted mt-4"}`}
                >
                  {text}
                </p>
              ))}
              {topic.source.length > 0 ? (
                <p className={source}>
                  From the{" "}
                  {topic.source.map((s, i) => (
                    <span key={s.href}>
                      {i > 0 ? " and " : null}
                      <Link href={s.href} className={textLink}>
                        {s.label}
                      </Link>
                    </span>
                  ))}
                  .
                </p>
              ) : null}
            </div>
          </section>
        ))}

        <section id="measures" aria-labelledby="measures-h" className={row}>
          <h2 id="measures-h" className={heading}>
            The measures in place
          </h2>
          <div className="lg:col-span-8">
            <dl>
              {SECURITY_MEASURES.map((measure) => (
                <div
                  key={measure.name}
                  className="border-line grid gap-x-8 gap-y-1 border-t py-4 first:border-t-0 first:pt-0 sm:grid-cols-[9rem_1fr]"
                >
                  <dt className="font-display text-h3">{measure.name}</dt>
                  <dd className="text-muted max-w-[56ch] text-pretty">{measure.body}</dd>
                </div>
              ))}
            </dl>
            <p className={source}>
              From the{" "}
              <Link href="/dpa#technical-and-organizational-measures" className={textLink}>
                DPA, schedule 2
              </Link>
              , with{" "}
              <Link href="/dpa#11-security-incidents" className={textLink}>
                section 11
              </Link>{" "}
              and{" "}
              <Link href="/dpa#15-return-and-deletion-of-customer" className={textLink}>
                section 15
              </Link>
              .
            </p>
          </div>
        </section>

        <section id="shared" aria-labelledby="shared-h" className={row}>
          <h2 id="shared-h" className={heading}>
            Who else processes your data
          </h2>
          <div className="lg:col-span-8">
            <p className="text-ink text-lead max-w-[62ch] text-pretty">
              Convalesce does not sell or rent customer personal data, and does not use it for advertising.
            </p>
            <p className="text-muted mt-4 max-w-[62ch] text-pretty">
              The providers that process data on its behalf are listed in the{" "}
              <Link href="/dpa#9-2-current-subprocessors" className={textLink}>
                data processing addendum
              </Link>
              , and a change to that list comes with notice. The{" "}
              <Link href="/privacy" className={textLink}>
                privacy policy
              </Link>{" "}
              covers the personal data Convalesce holds about its own users, and the{" "}
              <Link href="/terms" className={textLink}>
                terms of service
              </Link>{" "}
              cover your use of the product.
            </p>
            <p className="text-muted mt-4 max-w-[62ch] text-pretty">
              A question about any of this goes to{" "}
              <a href={`mailto:${SITE.privacyEmail}`} className={textLink}>
                {SITE.privacyEmail}
              </a>
              .
            </p>
          </div>
        </section>
      </PageShell>
      <JsonLd data={pageJsonLd("/security")} />
    </>
  );
}
