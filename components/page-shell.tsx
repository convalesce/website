import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Footer } from "@/components/footer";
import { Section } from "@/components/frame";
import { Nav } from "@/components/nav";

/* A page of its own: the nav, one framed section with a heading and an
   intro, then the footer. Content-led pages (integrations, changelog, about,
   contact, the blog) share it so each is a real crawlable page with one h1. */
export function PageShell({
  index,
  label,
  title,
  intro,
  standfirst = false,
  back,
  meta,
  home,
  children,
}: {
  /** the page's path as the app keeps it; shown in the frame's corner and marked in the nav */
  index: string;
  label: string;
  title: string;
  intro?: string;
  /** sets the intro as a standfirst, for a page that is read rather than scanned */
  standfirst?: boolean;
  /** the list this page belongs to, linked above the heading */
  back?: { href: string; label: string };
  /** a line of facts about the page, under the intro */
  meta?: ReactNode;
  /** passed to the nav and footer; set on the blog's pages */
  home?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Nav home={home} current={index} />
      <main id="main">
        <Section index={index} label={label} pad="tight">
          {/* the link sits in the space above the heading, so a page with one
              keeps its heading where every other page has it */}
          <div className="relative pt-12 sm:pt-16 lg:pt-24">
            {back ? (
              <nav aria-label="Breadcrumb" className="absolute top-0 left-0 sm:top-2 lg:top-6">
                <Link
                  href={back.href}
                  className="text-muted hover:text-ink text-small inline-flex min-h-11 items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  {back.label}
                </Link>
              </nav>
            ) : null}
            <h1 className="font-display text-display max-w-[20ch] text-balance">{title}</h1>
            {intro ? (
              <p className={`mt-6 text-pretty ${standfirst ? "text-ink text-lead max-w-[46ch]" : "text-muted max-w-[62ch]"}`}>
                {intro}
              </p>
            ) : null}
            {meta}
          </div>
          <div className="mt-12 lg:mt-16">{children}</div>
        </Section>
      </main>
      <Footer home={home} />
    </>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
