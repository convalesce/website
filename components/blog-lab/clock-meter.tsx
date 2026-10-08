"use client";

import { useEffect, useState } from "react";

import { clock } from "./time";

type Now = { minute: number; label: string };

/* Where in the window a moment counts as reached. */
const LINE = 0.45;

/** The time in the story at the point being read. Each moment in the text
    carries `data-minute`; between two of them the clock runs at the pace of
    the scroll. Without scripts it shows the end of the morning and stays there;
    with motion reduced it steps from moment to moment and does not run. */
export function ClockMeter({ first, rest, className = "" }: { first: number; rest: Now; className?: string }) {
  const [now, setNow] = useState<Now>(rest);

  useEffect(() => {
    const points = [...document.querySelectorAll<HTMLElement>("[data-minute]")];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const read = () => {
      frame = 0;
      const line = window.innerHeight * LINE;
      const at = points.map((p) => ({ y: p.getBoundingClientRect().top, minute: Number(p.dataset.minute), label: p.dataset.label ?? "" }));
      const next = at.findIndex((p) => p.y > line);
      if (next === 0) return setNow(at[0]);
      const from = at[(next < 0 ? at.length : next) - 1];
      const to = next < 0 ? from : at[next];
      const share = still.matches || to === from ? 0 : (line - from.y) / (to.y - from.y);
      setNow({ minute: Math.round(from.minute + share * (to.minute - from.minute)), label: from.label });
    };
    const queue = () => {
      frame ||= requestAnimationFrame(read);
    };
    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, []);

  return (
    <div aria-hidden="true" className={className}>
      <p className="font-display text-ink text-[1.75rem] leading-none font-medium tracking-[-0.02em] tabular-nums lg:text-[2.5rem]">{clock(now.minute)}</p>
      <p className="text-muted text-small tabular-nums lg:mt-3">
        {now.minute - first} min <span className="max-lg:hidden">since the first sign</span><span className="lg:hidden">in</span>
      </p>
      <p className="text-faint text-small min-w-0 text-pretty max-lg:truncate lg:mt-2 lg:min-h-[4.5em]">{now.label}</p>
    </div>
  );
}
