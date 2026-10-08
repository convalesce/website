"use client";

import { useEffect, useState } from "react";

/* A section counts as being read once its top has passed this far down the window. */
const LINE = 0.4;

/** Which of these ids is being read, and how many have been passed. */
export function useReading(ids: readonly string[]): number {
  const [at, setAt] = useState(-1);

  useEffect(() => {
    const targets = ids.map((id) => document.getElementById(id));
    const mark = () => {
      const line = window.innerHeight * LINE;
      setAt(targets.findLastIndex((target) => target !== null && target.getBoundingClientRect().top <= line));
    };
    const observer = new IntersectionObserver(mark, { rootMargin: `0px 0px -${(1 - LINE) * 100}% 0px` });
    targets.forEach((target) => target && observer.observe(target));
    return () => observer.disconnect();
  }, [ids]);

  return at;
}
