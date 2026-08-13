"use client";

import { useEffect, useRef, useState } from "react";
import { INCIDENT } from "@/lib/content";

const TASKS = ["extract", "transform", "validate", "load", "publish"] as const;
const COLS = 15;
const FAIL_COL = 11;
const FAIL_ROW = 1;

/** 0 running · 1 failed · 2 gathering evidence · 3 cause found · 4 healed */
type Step = 0 | 1 | 2 | 3 | 4;

type CellState = "ok" | "pending" | "blocked" | "fail" | "healed";

function cellState(row: number, col: number, step: Step, filled: number): CellState {
  // Once healed the whole board is green, with the repaired run still marked.
  if (step >= 4) {
    return col === FAIL_COL && row === FAIL_ROW ? "healed" : "ok";
  }
  if (col < FAIL_COL) return col < filled ? "ok" : "pending";
  if (col === FAIL_COL) {
    // extract succeeded — that is why transform got far enough to fail
    if (row < FAIL_ROW) return filled >= FAIL_COL ? "ok" : "pending";
    if (row === FAIL_ROW) return step >= 1 ? "fail" : "pending";
    return step >= 1 ? "blocked" : "pending";
  }
  return "pending";
}

const CELL_CLASS: Record<CellState, string> = {
  ok: "bg-accent/45",
  pending: "bg-ink/[0.07]",
  blocked: "bg-ink/[0.14]",
  fail: "bg-fail",
  healed: "bg-accent ring-accent/35 ring-2",
};

const STATUS: Record<Step, { label: string; className: string }> = {
  0: { label: "Running", className: "text-muted" },
  1: { label: "Failed", className: "text-fail" },
  2: { label: "Investigating", className: "text-fail" },
  3: { label: "Cause found", className: "text-accent-text" },
  4: { label: "Healed", className: "text-accent-text" },
};

export function RunGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>(0);
  const [filled, setFilled] = useState(0);
  const [trail, setTrail] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const settle = () => {
      setFilled(COLS);
      setStep(4);
      setTrail(INCIDENT.trail.length);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      settle();
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    let interval: ReturnType<typeof setInterval> | undefined;

    const play = () => {
      let col = 0;
      interval = setInterval(() => {
        col += 1;
        setFilled(col);
        if (col >= FAIL_COL) clearInterval(interval);
      }, 55);

      const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
      at(760, () => setStep(1));
      at(1150, () => setStep(2));
      at(1200, () => setTrail(1));
      at(1750, () => setTrail(2));
      at(2300, () => setTrail(3));
      at(2800, () => setStep(3));
      at(3900, () => setStep(4));
    };

    const io = new IntersectionObserver(
      (entries, self) => {
        if (!entries[0]?.isIntersecting) return;
        self.disconnect();
        play();
      },
      { threshold: 0.25 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      clearInterval(interval);
      timers.forEach(clearTimeout);
    };
  }, []);

  const status = STATUS[step];

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Incident ${INCIDENT.id}: the ${INCIDENT.pipeline} pipeline failed on ${INCIDENT.source}. Heal traced the cause to ${INCIDENT.cause.column} changing type in ${INCIDENT.cause.table} and healed the run.`}
      className="border-line bg-surface rounded-lg border p-4 sm:p-5"
    >
      {/* header */}
      <div className="border-line/70 flex items-center justify-between gap-3 border-b pb-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              step >= 4 ? "bg-accent" : step >= 1 ? "bg-fail" : "bg-muted"
            }`}
          />
          <span className="font-mono truncate text-[12px] tracking-tight">
            {INCIDENT.id}
          </span>
          <span className="text-faint truncate text-[12px]">{INCIDENT.source}</span>
        </div>
        <span
          className={`font-mono shrink-0 text-[10px] tracking-[0.14em] uppercase ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* run grid — rows are tasks, columns are runs over time */}
      <div className="flex gap-3 py-4">
        <ul className="flex shrink-0 flex-col justify-between py-px">
          {TASKS.map((task) => (
            <li
              key={task}
              className="font-mono text-faint h-3.5 text-[9.5px] leading-[14px]"
            >
              {task}
            </li>
          ))}
        </ul>
        <div className="grid min-w-0 flex-1 gap-[3px]">
          {TASKS.map((task, row) => (
            <div key={task} className="flex gap-[3px]">
              {Array.from({ length: COLS }, (_, col) => (
                <span
                  key={col}
                  className={`h-3.5 min-w-0 flex-1 rounded-[2px] transition-colors duration-300 ${
                    CELL_CLASS[cellState(row, col, step, filled)]
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* evidence trail */}
      <div className="border-line/70 space-y-1.5 border-t pt-3.5">
        <div className="flex items-baseline justify-between">
          <span className="mono-label">Context trace</span>
          <span className="font-mono text-faint text-[10px]">{INCIDENT.time}</span>
        </div>

        <ul className="space-y-1 pt-1">
          {INCIDENT.trail.map((line, i) => (
            <li
              key={line.text}
              className={`font-mono flex items-baseline justify-between gap-3 text-[11px] transition-opacity duration-300 ${
                i < trail ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="text-muted truncate">
                <span className="text-accent-text">✓</span> {line.text}
              </span>
              <span className="text-faint shrink-0">{line.at}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* resolution */}
      <div
        className={`border-line mt-3.5 rounded-md border p-3 transition-all duration-500 ${
          step >= 3 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
        } ${step >= 4 ? "bg-accent-soft border-accent/30" : "bg-ink/[0.02]"}`}
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="mono-label">Likely cause</span>
          <span className="font-mono text-faint text-[10px]">
            Confidence {INCIDENT.confidence}
          </span>
        </div>
        <p className="text-muted mt-2 text-[12.5px] leading-relaxed">
          <code className="text-ink font-mono text-[12px]">
            {INCIDENT.cause.column}
          </code>{" "}
          {INCIDENT.cause.change}{" "}
          <code className="text-ink font-mono text-[12px]">
            {INCIDENT.cause.table}
          </code>
          .
        </p>
        <p
          className={`font-mono mt-2.5 text-[11.5px] transition-opacity duration-500 ${
            step >= 4 ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-accent-text">→ fix applied</span>{" "}
          <span className="text-muted">{INCIDENT.fix}</span>
        </p>
      </div>
    </div>
  );
}
