import type { ReactNode } from "react";

import { Footer } from "@/components/footer";
import { Section } from "@/components/frame";
import { Nav } from "@/components/nav";

/* A page of its own: the nav, one framed section with a heading and an
   intro, then the footer. Content-led pages (integrations, changelog, about,
   contact) share it so each is a real crawlable page with one h1. */
export function PageShell({
  index,
  label,
  title,
  intro,
  home,
  children,
}: {
  index: string;
  label: string;
  title: string;
  intro: string;
  /** passed to the nav and footer; set on the blog's pages */
  home?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Nav home={home} />
      <main id="main">
        <Section index={index} label={label} pad="tight">
          <div className="pt-12 sm:pt-16 lg:pt-24">
            <h1 className="font-display text-display max-w-[20ch] text-balance">{title}</h1>
            <p className="text-muted mt-6 max-w-[62ch] text-pretty">{intro}</p>
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
