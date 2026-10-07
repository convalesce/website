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
  children,
}: {
  index: string;
  label: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <Nav />
      <main id="main">
        <Section index={index} label={label} pad="tight">
          <div className="pt-12 sm:pt-16 lg:pt-24">
            <h1 className="font-display text-h2 max-w-[22ch] text-balance">{title}</h1>
            <p className="text-muted mt-5 max-w-[60ch]">{intro}</p>
          </div>
          <div className="mt-12 lg:mt-16">{children}</div>
        </Section>
      </main>
      <Footer />
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
