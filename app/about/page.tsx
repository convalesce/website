import { JsonLd, PageShell } from "@/components/page-shell";
import { HERO, PRINCIPLES, SITE } from "@/lib/content";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/about");

const link = "text-ink underline underline-offset-4";

export default function Page() {
  return (
    <>
      <PageShell
        index="A"
        label="About"
        title="Fix the failure, with the evidence behind it."
        intro={HERO.body}
      >
        <div className="max-w-[72ch]">
          <h2 className="font-display text-h3">What we believe</h2>
          <ul className="mt-6 space-y-7">
            {PRINCIPLES.map((p) => (
              <li key={p.name}>
                <h3 className="text-ink font-semibold">{p.name}</h3>
                <p className="text-muted mt-1">{p.body}</p>
              </li>
            ))}
          </ul>

          <h2 className="font-display text-h3 mt-14">Your data</h2>
          <p className="text-muted mt-4">
            The details are written down, not promised:{" "}
            <a href="/privacy" className={link}>privacy policy</a>,{" "}
            <a href="/terms" className={link}>terms of service</a> and the{" "}
            <a href="/dpa" className={link}>data processing addendum</a>.
          </p>

          <h2 className="font-display text-h3 mt-14">Talk to us</h2>
          <p className="text-muted mt-4">
            Questions, a tool you need, or feedback: <a href="/contact" className={link}>contact us</a> or read the{" "}
            <a href={SITE.docs} target="_blank" rel="noopener noreferrer" className={link}>docs</a>.
          </p>
        </div>
      </PageShell>
      <JsonLd data={pageJsonLd("/about")} />
    </>
  );
}
