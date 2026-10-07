import { ContactForm } from "@/components/contact-form";
import { JsonLd, PageShell } from "@/components/page-shell";
import { SITE } from "@/lib/content";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/contact");

const ADDRESSES = [
  { for: "Product questions, integrations and account help", email: SITE.email },
  { for: "Access, correction or deletion of personal data", email: SITE.privacyEmail },
] as const;

export default function Page() {
  return (
    <>
      <PageShell
        index="/contact"
        label="Talk to us"
        title="Tell us what you need."
        intro="Pick the closest topic and write as much or as little as you like. A person reads every message and replies to the email you give."
      >
        <div className="border-line grid gap-12 border-t pt-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <aside aria-labelledby="direct" className="lg:col-span-5">
            <h2 id="direct" className="font-display text-h3">Prefer email?</h2>
            <ul className="mt-4">
              {ADDRESSES.map((a) => (
                <li key={a.email} className="border-line border-b py-4 first:pt-0">
                  <p className="text-muted text-small">{a.for}</p>
                  <a href={`mailto:${a.email}`} className="text-ink mt-1 inline-block font-mono text-mono underline underline-offset-4 hover:text-accent-text transition-colors">
                    {a.email}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </PageShell>
      <JsonLd data={pageJsonLd("/contact")} />
    </>
  );
}
