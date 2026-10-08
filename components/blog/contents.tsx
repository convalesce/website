"use client";

import { useEffect, useState } from "react";

import type { Heading } from "@/lib/blog-source";

/* A heading counts as being read once it has passed this far down the window. */
const LINE = 0.4;

/** A post's headings as links, with the section being read marked. */
export function ContentsList({ headings, className = "" }: { headings: readonly Heading[]; className?: string }) {
  const [reading, setReading] = useState<string>();

  useEffect(() => {
    const targets = headings.flatMap(({ id }) => document.getElementById(id) ?? []);
    const mark = () => {
      const line = window.innerHeight * LINE;
      setReading(targets.findLast((target) => target.getBoundingClientRect().top <= line)?.id);
    };
    // fires as a heading crosses the line in either direction, and once at the start
    const observer = new IntersectionObserver(mark, { rootMargin: `0px 0px -${(1 - LINE) * 100}% 0px` });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <ol className={className}>
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            aria-current={reading === heading.id ? "true" : undefined}
            // a link followed from the folded list on a small screen folds it again
            onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}
            className="text-muted hover:text-ink aria-[current=true]:text-ink text-small block py-1.5 text-pretty transition-colors aria-[current=true]:font-medium max-lg:py-2.5"
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  );
}
