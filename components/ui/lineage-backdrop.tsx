/* A pipeline drawn as it is: tables in columns, data flowing left to right.
   Positions are on a fixed sheet that is scaled to cover whatever it sits in. */
const SHEET = { w: 1200, h: 680 };

const NODES: Record<string, readonly [number, number]> = {
  a1: [40, 130],
  a2: [40, 350],
  a3: [40, 570],
  b1: [220, 90],
  b2: [220, 270],
  b3: [220, 460],
  b4: [220, 620],
  c1: [400, 170],
  c2: [400, 370],
  c3: [400, 550],
  d1: [600, 70],
  d2: [600, 260],
  d3: [600, 470],
  d4: [600, 630],
  e1: [800, 160],
  e2: [800, 360],
  e3: [800, 560],
  f1: [980, 90],
  f2: [980, 280],
  f3: [980, 480],
  f4: [980, 630],
  g1: [1160, 190],
  g2: [1160, 390],
  g3: [1160, 570],
};

const EDGES = [
  "a1-b1",
  "a1-b2",
  "a2-b2",
  "a2-b3",
  "a3-b3",
  "a3-b4",
  "b1-c1",
  "b2-c1",
  "b2-c2",
  "b3-c2",
  "b3-c3",
  "b4-c3",
  "c1-d1",
  "c1-d2",
  "c2-d2",
  "c2-d3",
  "c3-d3",
  "c3-d4",
  "d1-e1",
  "d2-e1",
  "d2-e2",
  "d3-e2",
  "d3-e3",
  "d4-e3",
  "e1-f1",
  "e1-f2",
  "e2-f2",
  "e2-f3",
  "e3-f3",
  "e3-f4",
  "f1-g1",
  "f2-g1",
  "f2-g2",
  "f3-g2",
  "f3-g3",
  "f4-g3",
] as const;

/* One failure, and how far downstream each table it reaches sits. It runs
   along the lower band, under the text rather than through it. */
const HOPS: Record<string, number> = { b3: 0, c3: 1, d4: 2, e3: 3, f3: 4, f4: 4, g2: 5, g3: 5 };

const SIZE = 12;

function wire(from: string, to: string): string {
  const [ax, ay] = NODES[from];
  const [bx, by] = NODES[to];
  const mid = (ax + bx) / 2;
  return `M${ax + SIZE / 2} ${ay} C${mid} ${ay} ${mid} ${by} ${bx - SIZE / 2} ${by}`;
}

/**
 * The page's backdrop: a lineage graph in which a failure travels downstream
 * and is then healed along the same path. It is what the product watches, so
 * it sits behind the words that describe it, faint enough to read over.
 *
 * `still` draws the graph without the failure, for where it is only texture.
 */
export function LineageBackdrop({
  still = false,
  className = "",
}: {
  still?: boolean;
  className?: string;
}) {
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
        const hot =
          !still && from in HOPS && to in HOPS && HOPS[to] === HOPS[from] + 1;
        return (
          <path
            key={edge}
            d={wire(from, to)}
            stroke="currentColor"
            className={hot ? "lineage-wire lineage-hot" : "lineage-wire"}
            style={
              hot
                ? { animationDelay: `${HOPS[from] * 0.45 + 0.22}s` }
                : undefined
            }
          />
        );
      })}
      {Object.entries(NODES).map(([id, [x, y]]) => {
        const hot = !still && id in HOPS;
        return (
          <rect
            key={id}
            x={x - SIZE / 2}
            y={y - SIZE / 2}
            width={SIZE}
            height={SIZE}
            rx={3}
            fill="var(--bg)"
            stroke="currentColor"
            className={hot ? "lineage-node lineage-hot" : "lineage-node"}
            style={hot ? { animationDelay: `${HOPS[id] * 0.45}s` } : undefined}
          />
        );
      })}
    </svg>
  );
}
