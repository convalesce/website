import { ContactForm } from "@/components/contact-form";
import { JsonLd, PageShell } from "@/components/page-shell";
import { SITE, mailto } from "@/lib/content";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/contact");

const TOPICS = [
  {
    title: "Product and getting started",
    body: "How it works, whether it fits your stack, or help connecting your first tool.",
    href: mailto("Question about Convalesce"),
    to: SITE.email,
  },
  {
    title: "Request an integration",
    body: "Tell us which tool you need next and what you would want it to show.",
    href: mailto("Integration request"),
    to: SITE.email,
  },
  {
    title: "Account help",
    body: "Sign-in, keys, or something that is not behaving.",
    href: mailto("Account help"),
    to: SITE.email,
  },
  {
    title: "Privacy and personal data",
    body: "Access, correction or deletion requests, and questions about how data is handled.",
    href: `mailto:${SITE.privacyEmail}?subject=${encodeURIComponent("Privacy request")}`,
    to: SITE.privacyEmail,
  },
] as const;

export default function Page() {
  return (
    <>
      <PageShell
        index="K"
        label="Contact"
        title="Tell us what you need."
        intro="Pick the closest topic. A real person reads every message."
      >
        <div className="max-w-[44rem]">
          <ContactForm />
        </div>

        <h2 className="font-display text-h3 mt-16 mb-5">Or write to us directly</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {TOPICS.map((t) => (
            <a key={t.title} href={t.href} className="border-line hover:bg-ink/[0.03] block rounded-lg border p-6 transition-colors">
              <h2 className="font-display text-h3">{t.title}</h2>
              <p className="text-muted mt-2">{t.body}</p>
              <p className="text-ink text-small mt-4 underline underline-offset-4">{t.to}</p>
            </a>
          ))}
        </div>
      </PageShell>
      <JsonLd data={pageJsonLd("/contact")} />
    </>
  );
}
