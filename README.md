# Heal — Convalesce landing site

Marketing site for **Heal**, Convalesce's self-healing layer for data pipelines.

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

All copy is in **`lib/content.ts`** — headlines, steps, FAQ, integrations, and the hero incident. Nothing else needs touching for a wording change.

To move an integration from coming-soon to live, flip its `status` from `"soon"` to `"live"` in `INTEGRATIONS`.

## Layout system

The page follows opal.dev's structural grammar, measured off the live site rather than eyeballed. Two components hold it:

- **`components/frame.tsx`** — the hairline frame every section sits inside (`max-w-[1230px]`, so it insets ~105px at 1440px wide) with mono index/label furniture at its top corners.
- **`components/ui/section-header.tsx`** — the asymmetric header: display heading on the left, supporting paragraph thrown to the far-right column *and* dropped below the heading baseline.

Sections compose these rather than re-deriving the layout. Key metrics carried over: `156px` section tail padding, display line-height exactly `1.0` at tracking `-0.04em`, body at `15px`, radii `2/4/6/12/36/pill`.

## Colour

Dark only. Black page, near-black surfaces, `#142820` matte green for the brand, and a bright emerald reserved for state signals (live dots, the healed cell, the logo arc) where the matte green would be invisible.

Hierarchy comes from a single ink colour at varying alpha (`--muted` 64%, `--faint` 48%, `--line` 10%) rather than a grey ramp, so every surface stays in the same family. All tokens live in one `:root` block at the top of `app/globals.css`.

No component uses a `dark:` utility — every colour resolves through a token, so a palette change is confined to that one block.

`.on-brand` re-derives the ink scale against the matte green, so panels wearing it (the footer, the healing ticker, the context-engine bar) get correct text and hairlines without per-element overrides.

## Motion

One orchestrated moment — the hero run grid fills, stalls red, gathers evidence, and heals — plus restrained scroll reveals driven by a single shared `IntersectionObserver` in `components/ui/reveal.tsx`.

Under `prefers-reduced-motion: reduce` everything collapses to its final state and the grid renders healed and static.

## Not in this repo

Integration docs. Those are a separate app; this site adds no `/docs` or `/integrations/*` routes so that app can own the path space cleanly.
