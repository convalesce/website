# Convalesce landing site

Marketing site for **Convalesce**, the self-healing layer for data pipelines.

Live at [www.convalesce.io](https://www.convalesce.io/).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Analytics

Both GA4 and Vercel Analytics are wired.

GA4 loads only when `NEXT_PUBLIC_GA_ID` is set, so local dev and preview deploys stay out of your reporting:

```bash
cp .env.example .env.local   # then paste your G-XXXXXXXXXX
```

In production set the same key under **Project → Settings → Environment Variables**.

Custom events live in `lib/analytics.ts` as a typed union — `request_early_access`, `see_how_it_works`, `theme_changed`. Add a new one there and it becomes available to `track()` everywhere.

Vercel Analytics and Speed Insights need no configuration; they activate on deploy.

## Editing content

All copy is in **`lib/content.ts`**: headlines, steps and their artifacts, context sources, FAQ, integrations, and the example incident used in `llms-full.txt`. Nothing else needs touching for a wording change.

To move an integration from coming-soon to live, flip its `status` from `"soon"` to `"live"` in `INTEGRATIONS`.

## Layout system

Every section sits inside a hairline frame with mono furniture at its corners, and headers are deliberately asymmetric. Three components hold the grammar:

- **`components/frame.tsx`** — the hairline frame every section sits inside (`max-w-[1230px]`, so it insets ~105px at 1440px wide) with mono index/label furniture at its top corners.
- **`components/ui/section-header.tsx`** — the asymmetric header: display heading on the left, supporting paragraph thrown to the far-right column *and* dropped below the heading baseline. Takes an optional `action` for a closing CTA.
- **`components/ui/grid.tsx`** — the contiguous hairline grid (`Grid` + `Cell`): one top and left rail, every cell closes its own right and bottom. One breakpoint ladder, one cell padding, so sections cannot drift apart.

Sections compose these rather than re-deriving the layout. Key metrics: `156px` section tail padding, `mt-14 lg:mt-24` between header and content, body at `16px`, radii `4/6/12`.

Every font size is a step on the scale in `app/globals.css` (`text-display`, `h2`, `h3`, `body`, `small`, `mono`, `mono-sm`, `label`). Sections never set pixel sizes. Mono is not decoration: it carries product data (run ids, table names, what each source reads) in every section.

## Colour

Dark only. Black page, near-black surfaces, `#142820` matte green for the brand, and a bright emerald reserved for state signals (live dots, the marquee logos, the logo arc) where the matte green would be invisible.

Hierarchy comes from a single ink colour at varying alpha (`--muted` 64%, `--faint` 48%, `--line` 10%) rather than a grey ramp, so every surface stays in the same family. All tokens live in one `:root` block at the top of `app/globals.css`.

No component uses a `dark:` utility — every colour resolves through a token, so a palette change is confined to that one block.

`.on-brand` re-derives the ink scale against the matte green, so panels wearing it (the footer, the healing ticker, the context-engine bar) get correct text and hairlines without per-element overrides.

## Motion

Restrained scroll reveals from `components/ui/reveal.tsx`, driven by one shared `IntersectionObserver`. The hero headline's object rotates through the stack (`components/ui/rotating-word.tsx`, words in `HERO.rotating`): a one-line clipped window, outgoing word rises out, incoming word rises in, every 3s. Two ambient loops, the stack marquee and the context ticker.

Both marquee halves are rendered wider than the frame; the track wraps by shifting exactly `-50%`, so a half narrower than the viewport would run dry before the loop came round.

Under `prefers-reduced-motion: reduce` everything collapses to its final state and the headline holds its first word.

## Not in this repo

Integration docs. Those are a separate app; this site adds no `/docs` or `/integrations/*` routes so that app can own the path space cleanly.
