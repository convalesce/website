import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { CTA, NAV_LINKS, outside } from "@/lib/content";

export function Nav() {
  return (
    // the bar is the page's first panel: the same width, rails and rounded
    // foot as every section, so the first section's rails start beneath it
    <header className="bg-bg/75 supports-[backdrop-filter]:bg-bg/45 sticky top-0 z-50 px-4 backdrop-blur-xl backdrop-saturate-150 sm:px-6 lg:px-0">
      <div className="border-line mx-auto flex h-16 w-full max-w-[1230px] items-center justify-between gap-4 rounded-b-lg border-x border-b px-5 sm:px-8 lg:px-10">
        <Link href="/#top" aria-label="Convalesce, back to top">
          <Logo />
        </Link>

        <nav aria-label="Sections" className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...outside(link.href)}
              className="text-muted hover:text-ink text-small py-2 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            href={CTA.primary.href}
            size="sm"
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
