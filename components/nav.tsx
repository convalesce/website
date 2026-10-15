import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ToolLogo } from "@/components/ui/tool-logo";
import { CTA, NAV_LINKS, outside } from "@/lib/content";
import { PACKAGES } from "@/lib/changelog";
import { INTEGRATION_PAGES } from "@/lib/integrations";

const item =
  "text-muted hover:text-ink aria-[current=page]:text-ink text-small inline-flex min-h-11 items-center transition-colors";

type Entry = {
  name: string;
  sub: string;
  href: string;
  logo: string;
  away?: boolean;
};

/* A link that opens a list on hover or keyboard focus; the link itself still goes to its page. */
function Menu({
  label,
  href,
  current,
  entries,
  all,
  columns,
  width,
}: {
  label: string;
  href: string;
  current: boolean;
  entries: readonly Entry[];
  all: string;
  columns: string;
  width: string;
}) {
  return (
    <div className="group relative">
      <a
        href={href}
        aria-current={current ? "page" : undefined}
        className={`${item} gap-1`}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className="size-3.5 transition-transform group-focus-within:rotate-180 group-hover:rotate-180"
        />
      </a>
      <div className="invisible absolute top-full left-1/2 z-50 -translate-x-1/2 pt-2 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div
          className={`border-line bg-bg rounded-lg border p-3 shadow-2xl shadow-black/40 ${width}`}
        >
          <ul className={`grid gap-0.5 ${columns}`}>
            {entries.map((entry) => (
              <li key={entry.href}>
                <a
                  href={entry.href}
                  {...(entry.away
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="hover:bg-ink/[0.06] flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center">
                    <ToolLogo name={entry.logo} />
                  </span>
                  <span className="min-w-0">
                    <span className="text-ink text-small block truncate">
                      {entry.name}
                    </span>
                    <span className="text-faint block truncate text-xs">
                      {entry.sub}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={href}
            className="border-line text-muted hover:text-ink text-small mt-2 flex items-center justify-between border-t px-3 pt-3 pb-1 transition-colors"
          >
            {all}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

const TOOLS: readonly Entry[] = INTEGRATION_PAGES.filter(
  (tool) => tool.status === "live",
).map((tool) => ({
  name: tool.name,
  sub: tool.kind,
  href: `/integrations/${tool.slug}`,
  logo: tool.name,
}));

const PLUGINS: readonly Entry[] = PACKAGES.map((pkg) => ({
  name: pkg.for.replace(" (Maven Central)", ""),
  sub: pkg.name,
  href: pkg.href,
  logo: pkg.tool,
  away: true,
}));

/* `home` is set on the blog's pages. They answer on the blog's own host,
   where "/" is the post list, so a link to a section of the home page has to
   name the main site in full. `current` is the path of the page being shown,
   as the app keeps it; the link to its section is marked. */
export function Nav({
  home = "",
  current = "",
}: {
  home?: string;
  current?: string;
}) {
  const at = (href: string) =>
    href.startsWith("/#") ? `${home}${href}` : href;
  const here = (href: string) =>
    current === href || current.startsWith(`${href}/`);
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
          className="hidden items-center gap-4 lg:flex xl:gap-7"
        >
          {NAV_LINKS.map((link) =>
            link.href === "/integrations" ? (
              <Menu
                key={link.href}
                label={link.label}
                href={`${home}${link.href}`}
                current={here(link.href)}
                entries={TOOLS.map((tool) => ({
                  ...tool,
                  href: `${home}${tool.href}`,
                }))}
                all="All integrations"
                columns="grid-cols-3"
                width="w-[46rem]"
              />
            ) : link.href === "/changelog" ? (
              <Menu
                key={link.href}
                label={link.label}
                href={`${home}${link.href}`}
                current={here(link.href)}
                entries={PLUGINS}
                all="All release notes"
                columns="grid-cols-2"
                width="w-[36rem]"
              />
            ) : (
              <a
                key={link.href}
                href={at(link.href)}
                {...outside(link.href)}
                aria-current={here(link.href) ? "page" : undefined}
                className={item}
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            href={CTA.primary.href}
            size="sm"
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
