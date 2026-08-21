import { FrameWidth } from "@/components/frame";
import { Logo } from "@/components/logo";
import { HERO, SITE, mailto } from "@/lib/content";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Context", href: "#context" },
      { label: "Integrations", href: "#integrations" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Early access", href: mailto("Convalesce early access") },
      { label: "Contact", href: mailto("Hello from your site") },
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
              <p className="text-muted text-small mt-5 max-w-[30ch]">
                {SITE.tagline}
              </p>
            </div>

            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="mono-label mb-4">{column.heading}</h2>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
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

          <p className="border-line text-faint text-mono-sm font-mono mt-10 border-t pt-5">
            Docs and integration guides are on the way.
          </p>
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
