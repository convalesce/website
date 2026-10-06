"use client";

import { GitPullRequest } from "lucide-react";
import { useEffect, useState } from "react";

import { Mark } from "@/components/logo";
import { ToolLogo } from "@/components/ui/tool-logo";
import { STEPS } from "@/lib/content";

/* The stack as a graph, with Convalesce as the layer under every tool in it.
   Four moments of one incident play in turn; a reader can pick one to hold.
   It sits on the page with no frame of its own: the tools are the only boxes,
   and the layer is the one thing in the brand's colour. */

type Tone = "calm" | "failed" | "cause" | "reached" | "healthy";

/* How long each moment is held, in ms. The line under its name fills over
   the same time, so the two are one number. */
const HOLD = 3600;

/* What the layer says at each moment. The first is the stack at rest; the
   other three are the three steps written out under the map. */
const LAYER = [
  "Connected to every tool. Watching each run.",
  "Failed run captured: daily_orders / load_orders",
  "Cause found: order_total changed type upstream",
  "Pull request opened, with the evidence attached",
] as const;

type Slot = {
  id: string;
  /** the tools that take this place in turn, one per run of the story, each
      with what it is to the stack. The lists are different lengths on
      purpose, so the same seven are not seen together twice in a row. */
  tools: readonly (readonly [name: string, role: string])[];
  /** centre, in percent of the map */
  x: number;
  y: number;
  /** what it shows at stages one and two; calm when left out */
  at?: Partial<Record<1 | 2, readonly [Tone, string]>>;
};

const SLOTS: readonly Slot[] = [
  {
    id: "source",
    tools: [
      ["Postgres", "Source"],
      ["Kafka", "Stream"],
      ["Shopify", "App data"],
      ["MySQL", "Source"],
      ["MongoDB", "Source"],
    ],
    x: 6.75,
    y: 18,
  },
  {
    id: "landing",
    tools: [
      ["Amazon S3", "Landing"],
      ["Google Cloud Storage", "Landing"],
      ["MinIO", "Object store"],
      ["Delta Lake", "Lake tables"],
    ],
    x: 6.75,
    y: 48.7,
  },
  {
    id: "orchestrator",
    tools: [
      ["Airflow", "DAG runs"],
      ["Dagster", "Asset runs"],
      ["Prefect", "Flow runs"],
    ],
    x: 28.4,
    y: 33.3,
    at: { 1: ["failed", "Run failed"], 2: ["failed", "Run failed"] },
  },
  {
    id: "warehouse",
    tools: [
      ["Snowflake", "Warehouse"],
      ["BigQuery", "Warehouse"],
      ["Databricks", "Lakehouse"],
      ["ClickHouse", "Warehouse"],
    ],
    x: 50,
    y: 33.3,
    at: { 2: ["cause", "Type changed"] },
  },
  {
    id: "transform",
    tools: [
      ["dbt", "Models"],
      ["Spark", "Jobs"],
      ["AWS Glue", "ETL jobs"],
      ["Flink", "Stream jobs"],
    ],
    x: 71.6,
    y: 33.3,
    at: { 2: ["reached", "Blocked"] },
  },
  {
    id: "reader-a",
    tools: [
      ["Looker", "Dashboards"],
      ["Vertex AI", "Training"],
      ["Tableau", "Dashboards"],
      ["Metabase", "Dashboards"],
    ],
    x: 93.25,
    y: 18,
    at: { 2: ["reached", "Stale"] },
  },
  {
    id: "reader-b",
    tools: [
      ["Tableau", "Dashboards"],
      ["Looker", "Dashboards"],
      ["Superset", "Dashboards"],
      ["Vertex AI", "Training"],
    ],
    x: 93.25,
    y: 48.7,
    at: { 2: ["reached", "Stale"] },
  },
];

/* Names too long for a tile, as their own makers shorten them. */
const SHORT: Record<string, string> = {
  "Google Cloud Storage": "Cloud Storage",
};

const COLUMNS = [
  ["Sources", 6.75],
  ["Orchestration", 28.4],
  ["Warehouse", 50],
  ["Transform", 71.6],
  ["Downstream", 93.25],
] as const;

/* Data flowing left to right, on a 1000 by 390 sheet stretched to the map.
   The last value says whether the failure travels along this link. */
const WIRES: readonly (readonly [string, boolean])[] = [
  ["M67.5 70 H150 Q175 70 175 95 V105 Q175 130 200 130 H284", false],
  ["M67.5 190 H150 Q175 190 175 165 V155 Q175 130 200 130 H284", false],
  ["M284 130 H500", false],
  ["M500 130 H716", true],
  ["M716 130 H800 Q825 130 825 105 V95 Q825 70 850 70 H932.5", true],
  ["M716 130 H800 Q825 130 825 155 V165 Q825 190 850 190 H932.5", true],
];

/* One line from each column down to the layer: how Convalesce reads the tool. */
const TAPS: readonly (readonly [number, number, string])[] = [
  [67.5, 190, "landing"],
  [284, 130, "orchestrator"],
  [500, 130, "warehouse"],
  [716, 130, "transform"],
  [932.5, 190, "reader-b"],
];
const LAYER_Y = 330;

const look: Record<Tone, { box: string; note: string; dot: string }> = {
  calm: {
    box: "border-line bg-surface",
    note: "text-faint",
    dot: "bg-faint/50",
  },
  failed: {
    box: "border-fail/60 bg-[color-mix(in_oklab,var(--fail)_13%,var(--bg))]",
    note: "text-fail",
    dot: "bg-fail",
  },
  cause: {
    box: "border-fail/60 bg-[color-mix(in_oklab,var(--fail)_13%,var(--bg))]",
    note: "text-fail",
    dot: "bg-fail",
  },
  reached: {
    box: "border-fail/25 bg-surface",
    note: "text-muted",
    dot: "bg-fail/50",
  },
  healthy: {
    box: "border-brand-rim bg-surface",
    note: "text-accent-text",
    dot: "bg-accent",
  },
};

/* Where the failure starts, in the sheet's units and in percent: what the
   trace spreads out from, and what the fix sweeps across from the left. */
const ORIGIN = { x: 284, pct: 28.4 };

export function StackMap() {
  /* one clock for both: the stage, and how many times the story has run.
     Each new run puts the next tool in every place. */
  const [tick, setTick] = useState(0);
  const [held, setHeld] = useState(false);
  const stage = tick % LAYER.length;
  const round = Math.floor(tick / LAYER.length);

  useEffect(() => {
    if (held || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const timer = setInterval(() => setTick((t) => t + 1), HOLD);
    return () => clearInterval(timer);
  }, [held]);

  const state = (slot: Slot, role: string): readonly [Tone, string] => {
    if (stage === 3) return ["healthy", "Healthy"];
    if (stage === 0) return ["calm", role];
    return slot.at?.[stage as 1 | 2] ?? ["calm", role];
  };

  /* Nothing changes all at once. The trace spreads outward from the tool
     that failed, and the fix arrives from the left, the way the data does. */
  const wait = (pct: number) =>
    stage === 3 ? pct * 5 : stage === 2 ? Math.abs(pct - ORIGIN.pct) * 7 : 0;

  return (
    <figure className="mt-12 lg:mt-16">
      {/* the picture in words, for a screen reader and for a crawler, neither
          of which can watch it play */}
      <p className="sr-only">
        A diagram of a data stack: sources feed an orchestrator, then a
        warehouse, then transformations, then dashboards. Convalesce sits under
        all of them and reads from each. When an orchestrator run fails,
        Convalesce captures it, traces the cause to a column that changed type
        in the warehouse and the models and dashboards it reaches, and opens a
        pull request with the fix.
      </p>
      <div
        className="relative aspect-[1000/800] sm:aspect-[1000/560] lg:aspect-[1000/350]"
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
      >
        {/* light from under the layer, the same low light as the hero's. It
            turns with the incident: faint at rest, red while something is
            wrong, full once it is fixed */}
        <span
          aria-hidden="true"
          className={`stack-ambient stack-ambient-ok ${
            stage === 3
              ? "opacity-100"
              : stage === 0
                ? "opacity-35"
                : "opacity-0"
          }`}
        />
        <span
          aria-hidden="true"
          className={`stack-ambient stack-ambient-fail ${
            stage === 1 || stage === 2 ? "opacity-100" : "opacity-0"
          }`}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 390"
          preserveAspectRatio="none"
          fill="none"
          className="absolute inset-0 size-full"
        >
          {WIRES.map(([d, carries], i) => (
            <path
              key={d}
              d={d}
              style={{ transitionDelay: `${stage === 3 ? i * 90 : 0}ms` }}
              className={`stack-wire ${
                stage === 3
                  ? "stack-wire-ok"
                  : stage === 2 && carries
                    ? "stack-wire-hit"
                    : ""
              }`}
            />
          ))}
          {/* data moving along each link. Past the tool that failed it stops,
              and it starts again when the fix is in: the one thing here that
              is always in motion, so its stopping is what the eye catches */}
          {WIRES.map(([d], i) => (
            <path
              key={d}
              d={d}
              className={`stack-flow ${stage === 3 ? "stack-flow-ok" : ""} ${
                i > 1 && (stage === 1 || stage === 2) ? "stack-flow-off" : ""
              }`}
              style={{ animationDelay: `${-i * 0.45}s` }}
            />
          ))}
          {TAPS.map(([x, from, id]) => (
            <path
              key={id}
              d={`M${x} ${from} V${LAYER_Y}`}
              style={{ transitionDelay: `${Math.round(wait(x / 10))}ms` }}
              className={`stack-tap ${
                stage === 1 && id === "orchestrator"
                  ? "stack-tap-fail"
                  : stage === 2
                    ? "stack-tap-read"
                    : stage === 3
                      ? "stack-tap-ok"
                      : ""
              }`}
            />
          ))}
        </svg>

        {COLUMNS.map(([label, x], i) => (
          <span
            key={label}
            aria-hidden="true"
            className={`mono-label absolute top-0 max-sm:hidden ${
              i === 0
                ? ""
                : i === COLUMNS.length - 1
                  ? "-translate-x-full"
                  : "-translate-x-1/2"
            }`}
            style={{
              left: i === 0 ? 0 : i === COLUMNS.length - 1 ? "100%" : `${x}%`,
            }}
          >
            {label}
          </span>
        ))}

        {SLOTS.map((slot) => {
          const [name, role] = slot.tools[round % slot.tools.length];
          const [tone, note] = state(slot, role);
          return (
            <div
              key={slot.id}
              className={`absolute flex -translate-x-1/2 -translate-y-1/2 rounded-md border shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] transition-colors duration-500 sm:w-[13.5%] sm:min-w-24 lg:min-w-28 lg:max-xl:w-[14.5%] ${look[tone].box}`}
              style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                transitionDelay: `${Math.round(wait(slot.x))}ms`,
              }}
            >
              {/* twice, as the run fails: the alarm, and then it is quiet */}
              {tone === "failed" && stage === 1 ? (
                <span key={tick} aria-hidden="true" className="stack-alarm" />
              ) : null}
              <span
                aria-hidden="true"
                className={`absolute top-2 right-2 size-1 rounded-full transition-colors duration-500 max-sm:hidden ${look[tone].dot}`}
                style={{ transitionDelay: `${Math.round(wait(slot.x))}ms` }}
              />
              {/* keyed by the tool, so a new one arrives rather than snapping in */}
              <span
                key={name}
                className="stack-swap flex min-w-0 flex-1 items-center gap-2.5 p-2.5 sm:max-lg:flex-col sm:max-lg:gap-1.5 sm:max-lg:px-1.5 sm:max-lg:text-center lg:px-3 lg:max-xl:gap-2 lg:max-xl:px-2"
              >
                <ToolLogo name={name} />
                <span className="max-w-full min-w-0 max-sm:sr-only">
                  <span className="text-small sm:max-lg:text-mono-sm block truncate font-medium">
                    {SHORT[name] ?? name}
                  </span>
                  <span
                    className={`text-mono-sm block truncate transition-colors duration-500 ${look[tone].note}`}
                    style={{ transitionDelay: `${Math.round(wait(slot.x))}ms` }}
                  >
                    {note}
                  </span>
                </span>
              </span>
              {tone === "cause" ? (
                <span className="mono-label text-fail stack-swap absolute -top-6 left-0 whitespace-nowrap max-sm:hidden">
                  Root cause
                </span>
              ) : null}
            </div>
          );
        })}

        {/* the layer itself: one band under the whole stack, and the only
            thing here in the brand's own green, at every moment */}
        <div
          className={`bg-brand text-on-brand absolute inset-x-0 top-[84.6%] flex min-h-13 -translate-y-1/2 items-center gap-3 overflow-hidden rounded-md border px-4 py-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-colors duration-700 ${
            stage === 3 ? "border-accent/55" : "border-brand-rim"
          }`}
        >
          {/* a light passes along the layer each time it learns something */}
          {stage > 0 ? (
            <span
              key={`sweep-${stage}`}
              aria-hidden="true"
              className={`stack-sweep ${stage === 1 ? "stack-sweep-fail" : ""}`}
            />
          ) : null}
          <Mark size={18} />
          <span className="text-small font-medium max-sm:sr-only">
            convalesce
          </span>
          <span
            aria-hidden="true"
            className="bg-brand-rim h-4 w-px max-sm:hidden"
          />
          <span
            key={`says-${stage}`}
            className="stack-swap text-small min-w-0 flex-1"
            aria-live="polite"
          >
            {LAYER[stage]}
          </span>
          {stage === 3 ? (
            <span className="text-accent-text text-mono-sm stack-swap flex shrink-0 items-center gap-1.5 font-mono max-sm:hidden">
              <GitPullRequest aria-hidden="true" className="size-3.5" />
              Ready for review
            </span>
          ) : null}
        </div>
      </div>

      <figcaption className="text-faint text-small mt-4 text-pretty">
        The map plays one example incident. The tools turn healthy once your
        team merges the fix.
      </figcaption>

      {/* the three steps are the map's own legend: each one is a moment the
          map plays, and the line over it fills while that moment is held */}
      <ol className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-3 lg:mt-16">
        {STEPS.map((step, i) => {
          const on = stage === i + 1;
          return (
            <li key={step.n} className="border-line relative border-t pt-5">
              {on ? (
                <span
                  key={tick}
                  aria-hidden="true"
                  className={`bg-accent absolute inset-x-0 -top-px h-px origin-left ${
                    held ? "" : "stack-progress"
                  }`}
                />
              ) : null}
              <h3 className="text-h3">
                <button
                  type="button"
                  aria-current={on ? "step" : undefined}
                  onClick={() => {
                    setTick(round * LAYER.length + i + 1);
                    setHeld(true);
                  }}
                  className="flex min-h-11 items-center gap-4 text-left"
                >
                  <span
                    className={`text-mono-sm w-5 shrink-0 font-mono font-normal tracking-normal tabular-nums transition-colors ${
                      on ? "text-accent-text" : "text-faint"
                    }`}
                  >
                    {step.n}
                  </span>
                  {step.title}
                </button>
              </h3>
              <p className="text-muted mt-2 max-w-[42ch] pl-9">{step.body}</p>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
