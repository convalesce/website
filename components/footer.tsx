import { FrameWidth } from "@/components/frame";
import { Logo } from "@/components/logo";
import { HERO, SITE, mailto, outside } from "@/lib/content";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Context", href: "/#context" },
      { label: "Integrations", href: "/#integrations" },
      { label: "Docs", href: SITE.docs },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Sign in", href: SITE.app },
      { label: "Contact", href: mailto("Hello from your site") },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="pb-10">
      <FrameWidth>
        <div className="on-brand rounded-lg p-7 sm:p-9 lg:p-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <Logo />
            </div>

            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="mono-label mb-4">{column.heading}</h2>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...outside(link.href)}
                        className="text-muted hover:text-ink text-small transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* coda */}
        <div className="flex items-center justify-between py-6">
          <span className="mono-label">© 2026 {SITE.company}</span>
          <a href="#top" className="mono-label hover:text-ink transition-colors">
            Back to top
          </a>
        </div>

        {/* the page signs off with its own headline, full size */}
        <p
          aria-hidden="true"
          className="font-display text-display text-ink/[0.13] select-none"
        >
          {HERO.head}
        </p>
      </FrameWidth>
    </footer>
  );
}
