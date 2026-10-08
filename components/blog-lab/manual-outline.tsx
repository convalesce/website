"use client";

import { useReading } from "./reading";

type Entry = { id: string; title: string; points: readonly string[] };

/** The page's outline, with each section's key lines under it and the section being read marked. */
export function ManualOutline({ entries }: { entries: readonly Entry[] }) {
  const at = useReading(entries.map((e) => e.id));
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
