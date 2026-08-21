import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { CTA, NAV_LINKS } from "@/lib/content";

export function Nav() {
  return (
    <header className="bg-bg/75 supports-[backdrop-filter]:bg-bg/45 sticky top-0 z-50 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 w-full max-w-[1230px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <Link href="#top" aria-label="Convalesce, back to top">
          <Logo />
        </Link>

        <nav aria-label="Sections" className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted hover:text-ink text-small transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            href={CTA.primary.href}
            size="sm"
            event="request_early_access"
            label="Request early access"
            trailing={<ArrowUpRight className="size-4" />}
          >
            <span className="hidden sm:inline">Request early access</span>
            <span className="sm:hidden">Early access</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
