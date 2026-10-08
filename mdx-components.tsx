import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { isValidElement, type ReactNode } from "react";

import { ByHand } from "@/components/blog/by-hand";
import { Callout } from "@/components/blog/callout";
import { Checklist, Window } from "@/components/blog/marks";
import { Timeline } from "@/components/blog/timeline";
import { Trail } from "@/components/blog/trail";
import { textLink } from "@/components/ui/text-link";
import { slugify } from "@/lib/blog-source";
import { SITE, outside } from "@/lib/content";

/* How a post's markdown is drawn, and the components a post may use without
   importing them. Every size and colour is a token from globals.css. */

export const textOf = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
};

export const components = {
  /* The id is made from the heading's own words by the same function the
     table of contents uses on the source, so the two cannot drift. */
  h2: ({ children }) => (
    <h2 id={slugify(textOf(children))} className="font-display text-h2 text-ink mt-14 scroll-mt-24 text-balance first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={slugify(textOf(children))} className="font-display text-h3 text-ink mt-9 scroll-mt-24">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="text-soft text-prose mt-5 text-pretty first:mt-0">{children}</p>,
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href} className={textLink}>
        {children}
      </Link>
    ) : (
      // a link to the main site stays in the tab; any other address opens beside it
      <a href={href} {...(href.startsWith(SITE.domain) ? {} : outside(href))} className={textLink}>
        {children}
      </a>
    ),
  strong: ({ children }) => <strong className="text-ink font-semibold">{children}</strong>,
  ul: ({ children }) => <ul className="text-soft text-prose marker:text-faint mt-5 list-disc space-y-2 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="text-soft text-prose marker:text-faint mt-5 list-decimal space-y-2 pl-5 marker:tabular-nums">{children}</ol>,
  li: ({ children }) => <li className="pl-1 text-pretty">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-line [&_p]:text-ink my-8 border-l-2 pl-5">{children}</blockquote>
  ),
  hr: () => <hr className="border-line my-12" />,
  /* A code block scrolls inside itself, so a long line never widens the page;
     it takes focus so the scroll is reachable from the keyboard. */
  pre: ({ children }) => (
    <pre
      tabIndex={0}
      className="border-line bg-surface text-mono-sm text-ink sm:text-mono my-8 overflow-x-auto rounded-lg border px-4 py-4 font-mono [&_code]:rounded-none [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[length:inherit]"
    >
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="border-line-soft bg-panel text-ink text-mono rounded-sm border px-1 py-0.5 font-mono break-words">{children}</code>
  ),
  table: ({ children }) => (
    <div tabIndex={0} role="region" aria-label="Table" className="border-line my-8 overflow-x-auto rounded-lg border">
      <table className="text-small w-full border-collapse text-left">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-surface">{children}</thead>,
  th: ({ children }) => <th scope="col" className="mono-label border-line border-b px-4 py-3 font-normal whitespace-nowrap">{children}</th>,
  td: ({ children }) => <td className="border-line text-muted border-t px-4 py-3 align-top">{children}</td>,
  /* eslint-disable-next-line @next/next/no-img-element -- a post's image keeps its own size; check-blog fails one without alt text */
  img: ({ src, alt }) => <img src={src} alt={alt} loading="lazy" className="border-line my-8 h-auto max-w-full rounded-lg border" />,
  ByHand,
  Callout,
  Checklist,
  Timeline,
  Trail,
  Window,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
