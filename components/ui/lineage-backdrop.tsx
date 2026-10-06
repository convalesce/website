import {
  Boxes,
  Brain,
  ChartColumn,
  Cylinder,
  Database,
  FileCode2,
  LayoutDashboard,
  Layers,
  Radio,
  Sheet,
  Table2,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/* A pipeline drawn as it is: assets in columns, data flowing left to right.
   Positions are on a fixed sheet that is scaled to cover whatever it sits in. */
const SHEET = { w: 1200, h: 680 };

/* Placed by hand, not on a grid: a real estate is uneven, with columns that
   drift, gaps where nothing sits and tables that feed something two steps
   on. Fixed numbers rather than random ones, so the server and the browser
   draw the same picture. */
const NODES: Record<string, readonly [number, number]> = {
  a1: [58, 118],
  a2: [26, 322],
  a3: [84, 548],
  b1: [196, 52],
  b2: [262, 232],
  b3: [214, 438],
  b4: [286, 634],
  c1: [432, 142],
  c2: [374, 352],
  c3: [452, 528],
  d1: [566, 38],
  d2: [644, 226],
  d3: [588, 408],
  d4: [652, 612],
  e1: [806, 124],
  e2: [846, 328],
  e3: [772, 506],
  f1: [948, 48],
  f2: [1022, 246],
  f3: [968, 452],
  f4: [1034, 632],
  g1: [1142, 148],
  g2: [1176, 362],
  g3: [1128, 566],
};

/* Uneven on purpose too: some assets feed one thing and some four, and a few
   edges skip a column, as a source read straight by a model does. */
const EDGES = [
  "a1-b1",
  "a1-b2",
  "a1-c1",
  "a2-b2",
  "a2-b3",
  "a3-b3",
  "a3-b4",
  "b1-d1",
  "b2-c1",
  "b2-c2",
  "b3-c2",
  "b3-c3",
  "b4-c3",
  "b4-d4",
  "c1-d1",
  "c1-d2",
  "c2-d2",
  "c2-d3",
  "c3-d4",
  "d1-e1",
  "d1-f1",
  "d2-e1",
  "d2-e2",
  "d3-e2",
  "d3-e3",
  "d4-e3",
  "e1-f1",
  "e1-f2",
  "e2-f2",
  "e2-g2",
  "e3-f3",
  "e3-f4",
  "f1-g1",
  "f2-g1",
  "f3-g2",
  "f3-g3",
  "f4-g3",
] as const;

/* The tile each asset is drawn on, and the mark inside it. Small: this is
   the page's backdrop, and a tile the size of a button would be read as one. */
const SIZE = 18;
const MARK = 10;

/* What each node is, by the mark the product's own lineage gives that kind
   of asset. Sources on the left, what moves and reshapes the data in the
   middle, what reads it on the right. No mark is used more than three times,
   so the graph reads as an estate of different things rather than a pattern. */
const MARKS: Record<string, LucideIcon> = {
  // sources: two databases and a stream
  a1: Database,
  a2: Cylinder,
  a3: Radio,
  // what brings them in: pipelines, and a bucket files land in
  b1: Workflow,
  b2: Boxes,
  b3: Workflow,
  b4: Cylinder,
  // raw tables
  c1: Table2,
  c2: Sheet,
  c3: Table2,
  // what reshapes them
  d1: FileCode2,
  d2: Layers,
  d3: FileCode2,
  d4: Workflow,
  // models and marts
  e1: Layers,
  e2: Boxes,
  e3: Table2,
  f1: Sheet,
  f2: Database,
  f3: Layers,
  f4: Brain,
  // what reads it
  g1: ChartColumn,
  g2: LayoutDashboard,
  g3: ChartColumn,
};

const markOf = (id: string): LucideIcon => MARKS[id];

function wire(from: string, to: string): string {
  const [ax, ay] = NODES[from];
  const [bx, by] = NODES[to];
  const mid = (ax + bx) / 2;
  return `M${ax + SIZE / 2} ${ay} C${mid} ${ay} ${mid} ${by} ${bx - SIZE / 2} ${by}`;
}

/** A still lineage graph, faint enough to read over: texture behind a closing
    line, drawn from the same kinds of asset the product watches. */
export function LineageBackdrop({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${SHEET.w} ${SHEET.h}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      className={`lineage-backdrop pointer-events-none absolute inset-0 size-full ${className}`}
    >
      {EDGES.map((edge) => {
        const [from, to] = edge.split("-");
        return (
          <path
            key={edge}
            d={wire(from, to)}
            stroke="currentColor"
            className="lineage-wire"
          />
        );
      })}
      {Object.entries(NODES).map(([id, [x, y]]) => {
        const Mark = markOf(id);
        return (
          <g key={id}>
            <rect
              x={x - SIZE / 2}
              y={y - SIZE / 2}
              width={SIZE}
              height={SIZE}
              rx={4}
              fill="var(--bg)"
              stroke="currentColor"
              className="lineage-node"
            />
            <Mark
              x={x - MARK / 2}
              y={y - MARK / 2}
              width={MARK}
              height={MARK}
              className="lineage-mark"
            />
          </g>
        );
      })}
    </svg>
  );
}
