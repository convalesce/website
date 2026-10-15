import { ImageResponse } from "next/og";

/* A post's cover in the look of the brand banner, with no words: a block of
   dark cubes with one knocked out of it, the pieces of the search scattered
   off to one side, and the mint cube that mends it dropping back into place.
   Drawn on nothing, for white pages such as Medium's. */

const W = 1200;
const H = 630;
const S = 62;
const COS = 0.866;
const ORIGIN = { x: 720, y: 325 };
const BLOCK = 4;
const LAYERS = 3;
// Each cube is drawn a little smaller than its cell, so the joins show.
const INSET = 0.05;

type Cube = { x: number; y: number; z: number; size: number; mint?: boolean };

// The same post always draws the same picture.
function random(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const at = (x: number, y: number, z: number) => [ORIGIN.x + (x - y) * S * COS, ORIGIN.y + (x + y) * S * 0.5 - z * S] as const;
const poly = (points: (readonly [number, number])[]) => points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

function faces({ x, y, z, size }: Cube) {
  const a = x + INSET;
  const b = y + INSET;
  const c = z + INSET;
  const s = size - INSET * 2;
  return {
    top: poly([at(a, b, c + s), at(a + s, b, c + s), at(a + s, b + s, c + s), at(a, b + s, c + s)]),
    right: poly([at(a + s, b, c), at(a + s, b + s, c), at(a + s, b + s, c + s), at(a + s, b, c + s)]),
    left: poly([at(a, b + s, c), at(a + s, b + s, c), at(a + s, b + s, c + s), at(a, b + s, c + s)]),
  };
}

export function coverArt({ seed }: { seed: string }) {
  const next = random(seed);
  const hole = { x: 1 + Math.floor(next() * 2), y: 1 + Math.floor(next() * 2) };
  const cubes: Cube[] = [];
  for (let z = 0; z < LAYERS; z++)
    for (let x = 0; x < BLOCK; x++)
      for (let y = 0; y < BLOCK; y++) if (!(z === LAYERS - 1 && x === hole.x && y === hole.y)) cubes.push({ x, y, z, size: 1 });
  const mint: Cube = { x: hole.x, y: hole.y, z: LAYERS + 0.55, size: 1, mint: true };
  // the pieces of the search, flung off up and to the left, smaller the further they went
  const pieces: Cube[] = Array.from({ length: 7 }, (_, i) => {
    const far = (i + 1) / 7;
    return { x: 0.3 - far * 0.6 + next() * 0.7, y: 4.3 + far * 3 + next() * 0.6, z: 1.9 + far * 2.6 + (next() - 0.5) * 1.2, size: 0.6 - far * 0.34 };
  });
  const order = [...cubes, ...pieces, mint].sort((p, q) => p.x + p.y - (q.x + q.y) || p.z - q.z);
  const glow = faces(mint);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "transparent" }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <linearGradient id="top" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#5b5f63" />
              <stop offset="1" stopColor="#3a3d40" />
            </linearGradient>
            <linearGradient id="left" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2e3133" />
              <stop offset="1" stopColor="#1d1f21" />
            </linearGradient>
            <linearGradient id="right" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1f2123" />
              <stop offset="1" stopColor="#111213" />
            </linearGradient>
            <linearGradient id="mintTop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#a7f3d0" />
              <stop offset="1" stopColor="#6ee7b7" />
            </linearGradient>
            <linearGradient id="mintSide" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#34d399" />
              <stop offset="1" stopColor="#0f9f6e" />
            </linearGradient>
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="28" />
            </filter>
          </defs>
          <g filter="url(#blur)" opacity="0.8">
            <polygon points={glow.top} fill="#34d399" />
            <polygon points={glow.left} fill="#34d399" />
            <polygon points={glow.right} fill="#34d399" />
          </g>
          {order.map((cube, i) => {
            const f = faces(cube);
            const edge = cube.mint ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.07)";
            return (
              <g key={i} stroke={edge} strokeWidth="1" strokeLinejoin="round">
                <polygon points={f.left} fill={cube.mint ? "url(#mintSide)" : "url(#left)"} />
                <polygon points={f.right} fill={cube.mint ? "url(#mintSide)" : "url(#right)"} opacity={cube.mint ? 0.8 : 1} />
                <polygon points={f.top} fill={cube.mint ? "url(#mintTop)" : "url(#top)"} />
              </g>
            );
          })}
        </svg>
      </div>
    ),
    { width: W, height: H },
  );
}
