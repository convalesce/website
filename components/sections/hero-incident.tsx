import { GitPullRequest } from "lucide-react";
import type { CSSProperties } from "react";

import { HERO_INCIDENT } from "@/lib/content";

const dot = { fail: "bg-fail", step: "bg-faint", done: "bg-accent" } as const;

const line = {
  same: { mark: " ", row: "", code: "text-muted" },
  cut: { mark: "-", row: "bg-fail-soft", code: "text-fail" },
  add: { mark: "+", row: "bg-accent-soft", code: "text-accent-text" },
} as const;

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * What a team receives, in one picture: the pull request on the right, and on
 * the left how Convalesce got to it. The page claims a fix with its evidence;
 * this is that claim made visible before anything else is read.
 */
export function HeroIncident() {
  const { title, branch, file, trail, diff, reaches } = HERO_INCIDENT;

  return (
    <figure className="border-line bg-surface mx-auto mt-14 max-w-[1020px] overflow-hidden rounded-lg border text-left lg:mt-20">
      <figcaption className="border-line flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <GitPullRequest aria-hidden="true" className="text-accent size-5 shrink-0" />
          <div className="min-w-0">
            <p className="text-h3 truncate">{title}</p>
            <p className="text-faint font-mono text-mono-sm mt-0.5 truncate">{branch} → main</p>
          </div>
        </div>
        <span className="mono-label border-line rounded-sm border px-2 py-1">Example</span>
      </figcaption>

      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="border-line px-5 py-6 sm:px-6 lg:border-r lg:py-7">
          <p className="mono-label mb-5">How it got here</p>
          <ol className="before:bg-line relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[5.5625rem] before:w-px">
            {trail.map((entry, i) => (
              <li
                key={entry.at}
                style={step(i)}
                className="hero-step relative grid grid-cols-[4.5rem_0.625rem_minmax(0,1fr)] items-baseline gap-x-3"
              >
                <span className="text-faint font-mono text-mono-sm text-right tabular-nums">{entry.at}</span>
                <span
                  aria-hidden="true"
                  className={`ring-surface size-2.5 translate-y-px rounded-full ring-4 ${dot[entry.state]}`}
                />
                <span className={`text-small ${entry.state === "step" ? "text-muted" : "text-ink"}`}>{entry.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <div style={step(trail.length)} className="hero-step border-line min-w-0 max-lg:border-t">
          <p className="border-line text-faint font-mono text-mono-sm border-b px-5 py-3 sm:px-6">{file}</p>
          <pre className="font-mono text-mono overflow-x-auto py-3">
            {diff.map((entry) => {
              const look = line[entry.kind];
              return (
                <div key={`${entry.kind}-${entry.n}`} className={`flex min-w-max px-5 sm:px-6 ${look.row}`}>
                  <span aria-hidden="true" className="text-faint w-7 shrink-0 tabular-nums select-none">
                    {entry.n}
                  </span>
                  <span aria-hidden="true" className={`w-5 shrink-0 select-none ${look.code}`}>
                    {look.mark}
                  </span>
                  <code className={look.code}>{entry.code}</code>
                </div>
              );
            })}
          </pre>
        </div>
      </div>

      <div className="border-line flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t px-5 py-3.5 sm:px-6">
        <span className="mono-label">Also repairs</span>
        <ul className="font-mono text-mono-sm text-muted flex flex-wrap gap-x-4 gap-y-1">
          {reaches.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
