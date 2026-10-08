import { FrameWidth } from "@/components/frame";
import { Logo } from "@/components/logo";
import { HERO, SITE, outside } from "@/lib/content";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Integrations", href: "/integrations" },
      { label: "Changelog", href: "/changelog" },
      { label: "Docs", href: SITE.docs },
      { label: "Sign in", href: SITE.app },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "DPA", href: "/dpa" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="pb-10">
      <FrameWidth>
        <div className="on-brand rounded-lg p-7 sm:p-9 lg:p-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Logo />
            </div>

            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="mono-label mb-4">{column.heading}</h2>
                <ul className="space-y-2.5 max-lg:space-y-0">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...outside(link.href)}
                        className="text-muted hover:text-ink text-small transition-colors max-lg:inline-flex max-lg:min-h-11 max-lg:items-center"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <a
              href="https://smollaunch.com"
              target="_blank"
              rel="noopener"
              className="block w-fit"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- a badge served by its issuer */}
              <img
                src="https://smollaunch.com/badges/featured.svg"
                alt="Convalesce — Featured on Smol Launch"
                loading="lazy"
                width={150}
                height={36}
              />
            </a>
          </div>
        </div>

        {/* coda */}
        <div className="flex items-center justify-between py-6">
          <span className="mono-label">Copyright 2026 {SITE.company}</span>
          <a
            href="#top"
            className="mono-label hover:text-ink inline-flex min-h-11 items-center transition-colors"
          >
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
