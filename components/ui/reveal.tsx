"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/* One observer for the whole page rather than one per component. */
let shared: IntersectionObserver | null = null;

function observer(): IntersectionObserver | null {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }
  shared ??= new IntersectionObserver(
    (entries, self) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.shown = "true";
        self.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
  );
  return shared;
}

type Props = {
  children: ReactNode;
  className?: string;
  /** ms before this element starts rising */
  delay?: number;
  /** "words" staggers direct <SplitText> children instead of the container */
  mode?: "self" | "words";
};

export function Reveal({ children, className, delay = 0, mode = "self" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const io = observer();
    if (!el || !io) return;
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  const attr = mode === "words" ? { "data-reveal-words": "" } : { "data-reveal": "" };

  return (
    <div
      ref={ref}
      {...attr}
      className={className}
      style={{ "--reveal-delay": delay } as CSSProperties}
    >
      {children}
    </div>
  );
}

/** Splits a line into words so they can rise in sequence. */
export function SplitText({ text, from = 0 }: { text: string; from?: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="split-word"
          style={{ "--i": from + i } as CSSProperties}
        >
          {word}
          {i < text.split(" ").length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}
