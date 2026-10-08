"use client";

import { useReading } from "./reading";

type Link = { id: string; title: string };

/** The chain as the contents list: links already read are joined in green, the one being read is ringed. */
export function TrailContents({ links }: { links: readonly Link[] }) {
  const ids = links.map((l) => l.id);
  const at = useReading(ids);
  return (
    <ol>
      {links.map((link, i) => (
        <li key={link.id} className="relative pb-5 last:pb-0">
          {i < links.length - 1 ? (
            <span
              aria-hidden="true"
              className={`absolute top-6 bottom-0 left-[0.6875rem] w-px origin-top transition-colors duration-500 ${i < at ? "bg-accent" : "bg-line"}`}
            />
          ) : null}
          <a
            href={`#${link.id}`}
            aria-current={i === at ? "true" : undefined}
            className="group text-muted hover:text-ink aria-[current=true]:text-ink text-small grid grid-cols-[1.5rem_minmax(0,1fr)] items-baseline gap-x-3 transition-colors"
          >
            <span
              className={`text-mono-sm relative flex size-6 translate-y-0.5 items-center justify-center rounded-full border font-mono tabular-nums transition-colors duration-500 ${
                i < at ? "border-accent/60 text-accent-text" : i === at ? "border-ink text-ink" : "border-ink/25 text-faint"
              }`}
            >
              {i + 1}
            </span>
            <span className="text-pretty">{link.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
