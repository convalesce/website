import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Footer } from "@/components/footer";
import { Section } from "@/components/frame";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { formatDay, type Post } from "@/lib/blog";
import { CLOSER, CTA } from "@/lib/content";

import { SLUG } from "./content";

/* The words the real list page opens with, so each sample's list is judged on the same copy. */
export const LIST = {
  title: "What a data incident is really like.",
  intro:
    "Each post takes one failure and walks through it: what went red, where the time went, who was waiting, and what would have shortened it.",
} as const;

/** The site's own nav, frame and footer around a sample. */
export function LabFrame({
  list = false,
  pad = "tight",
  children,
}: {
  list?: boolean;
  pad?: "tight" | "none";
  children: ReactNode;
}) {
  return (
    <>
      <Nav current="/blog" />
      <main id="main">
        <Section index={list ? "/blog" : `/blog/${SLUG}`} label="Blog" pad={pad}>
          {children}
        </Section>
      </main>
      {/* room for the switcher, which is fixed over the foot of the page */}
      <div className="pb-20">
        <Footer />
      </div>
    </>
  );
}

export function Back({ href, className = "" }: { href: string; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <Link href={href} className="text-muted hover:text-ink text-small inline-flex min-h-11 items-center gap-1.5 transition-colors">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Blog
      </Link>
    </nav>
  );
}

/** Marks a row that stands in for a post not yet written. Lab only. */
export function Sample({ className = "" }: { className?: string }) {
  return (
    <span className={`mono-label border-line inline-flex rounded-sm border border-dashed px-1.5 py-1 ${className}`}>Sample</span>
  );
}

export function Filed({ post, className = "" }: { post: Post; className?: string }) {
  return (
    <p className={`text-faint text-small tabular-nums ${className}`}>
      <time dateTime={post.date}>{formatDay(post.date)}</time>, {post.minutes} min read
    </p>
  );
}

/** The site's closing line and its one action, without a box around them. */
export function Actions({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Button href={CTA.primary.href} beta event="open_app" label={CTA.primary.label}>
        {CTA.primary.label}
      </Button>
      <Button href="/#how-it-works" variant="secondary">
        {CTA.secondary.label}
      </Button>
    </div>
  );
}

export { CLOSER };

/* Running text, the same in every sample: the reading size, at reading contrast. */
export const prose = "text-soft text-prose text-pretty";
/* The width that holds a line of it to about 68 characters. */
export const measure = "max-w-[33rem]";
