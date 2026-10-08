import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { CTA, NAV_LINKS, outside } from "@/lib/content";

/* `home` is set on the blog's pages. They answer on the blog's own host,
   where "/" is the post list, so a link to a section of the home page has to
   name the main site in full. */
export function Nav({ home = "" }: { home?: string }) {
  const at = (href: string) => (href.startsWith("/#") ? `${home}${href}` : href);
  return (
    // the bar is the page's first panel: the same width, rails and rounded
    // foot as every section, so the first section's rails start beneath it
    <header className="bg-bg/75 supports-[backdrop-filter]:bg-bg/45 sticky top-0 z-50 px-4 backdrop-blur-xl backdrop-saturate-150 sm:px-6 lg:px-0">
      <div className="border-line mx-auto flex h-16 w-full max-w-[1230px] items-center justify-between gap-4 rounded-b-lg border-x border-b px-5 sm:px-8 lg:px-10">
        <Link
          href={at("/#top")}
          aria-label="Convalesce, back to top"
          className="inline-flex min-h-11 items-center"
        >
          <Logo />
        </Link>

        <nav
          aria-label="Sections"
          className="hidden items-center gap-7 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={at(link.href)}
              {...outside(link.href)}
              // six links do not fit beside the button on a tablet, so the newest waits for a wider screen
              className={`text-muted hover:text-ink text-small min-h-11 items-center transition-colors ${link.href === "/blog" ? "hidden lg:inline-flex" : "inline-flex"}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            href={CTA.primary.href}
            size="sm"
            beta
            className="max-lg:h-11"
            event="open_app"
            label={CTA.primary.label}
            trailing={<ArrowUpRight className="size-4" />}
          >
            {CTA.primary.label}
          </Button>
        </div>
      </div>
    </header>
  );
}
