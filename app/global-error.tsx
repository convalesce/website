"use client";

/**
 * The last resort: this replaces the root layout, so globals.css and the font
 * variables are gone by the time it renders. Everything it needs is inline,
 * and it stays deliberately small, because whatever broke may break again on
 * the way to drawing this.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          color: "#ededed",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <main style={{ width: "100%", maxWidth: "480px" }}>
          <p
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(237, 237, 237, 0.5)",
              margin: "0 0 24px",
            }}
          >
            Convalesce · unhandled error
          </p>

          <h1
            style={{
              fontSize: "28px",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              fontWeight: 500,
              margin: "0 0 16px",
            }}
          >
            Something failed on our side.
          </h1>

          <p
            style={{
              color: "rgba(237, 237, 237, 0.64)",
              lineHeight: 1.6,
              margin: "0 0 28px",
            }}
          >
            The page could not finish rendering. Try again, and if it keeps happening,
            the digest below tells us which failure to look for.
          </p>

          <div
            style={{
              borderTop: "1px solid rgba(237, 237, 237, 0.1)",
              borderBottom: "1px solid rgba(237, 237, 237, 0.1)",
              padding: "20px 0",
              marginBottom: "28px",
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              fontSize: "13px",
              display: "grid",
              gridTemplateColumns: "auto minmax(0, 1fr)",
              columnGap: "24px",
              rowGap: "6px",
            }}
          >
            <span style={{ color: "rgba(237, 237, 237, 0.5)" }}>status</span>
            <span style={{ color: "rgba(237, 237, 237, 0.85)" }}>500 · unhandled</span>
            <span style={{ color: "rgba(237, 237, 237, 0.5)" }}>digest</span>
            <span style={{ color: "rgba(237, 237, 237, 0.85)", wordBreak: "break-all" }}>
              {error.digest ?? "not recorded"}
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                height: "40px",
                padding: "0 16px",
                borderRadius: "6px",
                border: "1px solid rgba(52, 211, 153, 0.26)",
                background: "#142820",
                color: "#f4f7f6",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* a hard navigation on purpose: the router is a plausible suspect
                for whatever brought us here, so Link is the wrong tool */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                height: "40px",
                padding: "0 16px",
                borderRadius: "6px",
                border: "1px solid rgba(237, 237, 237, 0.1)",
                color: "#ededed",
                fontSize: "14px",
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Back to the homepage
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
