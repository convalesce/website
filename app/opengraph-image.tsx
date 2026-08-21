import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { HERO, SITE } from "@/lib/content";
import { markPaths } from "@/lib/mark";

const MARK = markPaths(8.5);

export const alt = `${SITE.company}: ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Satori cannot read woff2, and next/font only ever emits woff2, so the display
   face is vendored as ttf beside this file and read at build time. Without it
   the card falls back to a system sans and stops looking like the site. */
const font = (weight: 400 | 600) =>
  readFile(join(process.cwd(), "app/fonts", `InstrumentSans-${weight}.ttf`));

export default async function OpenGraphImage() {
  const [regular, semibold] = await Promise.all([font(400), font(600)]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          color: "#ededed",
          fontFamily: "Instrument Sans",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            {/* Satori resolves no CSS variables, so the tokens are literal here. */}
            <path
              d={MARK.c}
              stroke="#ededed"
              strokeOpacity="0.3"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d={MARK.closure}
              stroke="#34d399"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.6 }}>
            convalesce
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 82,
              fontWeight: 600,
              letterSpacing: -3.2,
              lineHeight: 1.02,
            }}
          >
            <span>{HERO.head}</span>
          </div>
          <span
            style={{
              fontSize: 26,
              fontWeight: 400,
              color: "rgba(237,237,237,0.64)",
              maxWidth: 900,
            }}
          >
            {HERO.sub}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Sans", data: regular, weight: 400, style: "normal" },
        { name: "Instrument Sans", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
