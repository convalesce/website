"use client";

import { useEffect, useState, type CSSProperties } from "react";

/**
 * Cycles through a list of phrases in a one-line clipped window. Two phases
 * per swap: the current word rises out, then the next word rises in; the
 * CSS in globals.css does the moving. Holds the first word when the visitor
 * prefers reduced motion.
 */
export function RotatingWord({
  words,
  interval = 3000,
  exitMs = 450,
  className = "",
  /** stagger index, so it rises with the surrounding split words on reveal */
  from = 0,
}: {
  words: readonly string[];
  interval?: number;
  exitMs?: number;
  className?: string;
  from?: number;
}) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");

  useEffect(() => {
    if (words.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let swap: ReturnType<typeof setTimeout>;
    const tick = setInterval(() => {
      setPhase("out");
      swap = setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setPhase("in");
      }, exitMs);
    }, interval);

    return () => {
      clearInterval(tick);
      clearTimeout(swap);
    };
  }, [words.length, interval, exitMs]);

  return (
    <span
      className={`rotating-word split-word ${className}`}
      data-phase={phase}
      style={{ "--i": from } as CSSProperties}
      aria-live="off"
    >
      <span key={index}>{words[index]}</span>
    </span>
  );
}
