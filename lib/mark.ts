/**
 * The mark: a C whose opening is closed in brand green. The letterform is
 * already a ring with a gap, and closing gaps is the product — so the
 * monogram and the idea are the same shape.
 *
 * Geometry lives here because it is drawn on three surfaces at three sizes
 * (in-page logo, OG image, favicon) and used to drift between them.
 * `public/icon.svg` is a static file and cannot import this; it carries the
 * r=9 paths inline and points back here. The rasters in `public/` are rendered
 * from that same geometry on an opaque plate, because search results draw a
 * favicon on white and a transparent theme-adaptive stroke vanishes there.
 */

/** Half-width of the C's opening, in degrees off east. */
const GAP_DEG = 40;

/** Both arcs traverse the circle in one direction, so the joins sit flush. */
const SWEEP = 0;

export function markPaths(r: number) {
  const a = (GAP_DEG * Math.PI) / 180;
  const x = round(12 + r * Math.cos(a));
  const dy = r * Math.sin(a);
  const top = round(12 - dy);
  const bottom = round(12 + dy);

  return {
    /** 280° of ink — the C itself, opening to the right. */
    c: `M${x} ${top}A${r} ${r} 0 1 ${SWEEP} ${x} ${bottom}`,
    /** The remaining 80°, carrying the accent: the gap, closed. */
    closure: `M${x} ${bottom}A${r} ${r} 0 0 ${SWEEP} ${x} ${top}`,
  };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}
