"use client";

import { useEffect, useState } from "react";

type Entry = { id: string; title: string; points: readonly string[] };

/* A section counts as being read once its top has passed this far down the window. */
const LINE = 0.4;

/** A post's sections as links, each with its key lines under it and the one being read marked. */
export function Outline({ entries }: { entries: readonly Entry[] }) {
  const [at, setAt] = useState(-1);

  useEffect(() => {
    const targets = entries.map(({ id }) => document.getElementById(id));
    const mark = () => {
      const line = window.innerHeight * LINE;
      setAt(targets.findLastIndex((target) => target !== null && target.getBoundingClientRect().top <= line));
    };
    // fires as a section crosses the line in either direction, and once at the start
    const observer = new IntersectionObserver(mark, { rootMargin: `0px 0px -${(1 - LINE) * 100}% 0px` });
    targets.forEach((target) => target && observer.observe(target));
    return () => observer.disconnect();
  }, [entries]);

  return (
    <ol className="max-lg:flex max-lg:gap-x-5">
      {entries.map((entry, i) => (
        <li key={entry.id} className="max-lg:shrink-0">
          <a
            href={`#${entry.id}`}
            aria-current={i === at ? "true" : undefined}
            className="text-muted hover:text-ink aria-[current=true]:text-ink text-small flex items-baseline gap-2 py-1.5 transition-colors aria-[current=true]:font-medium max-lg:min-h-11 max-lg:items-center max-lg:whitespace-nowrap"
          >
            <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full transition-colors lg:-translate-y-0.5 ${i === at ? "bg-accent" : "bg-ink/20"}`} />
            {entry.title}
          </a>
          {entry.points.length > 0 ? (
            <ul className="text-faint mb-2 ml-3.5 space-y-1 text-[0.8125rem] leading-snug max-lg:hidden">
              {entry.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
