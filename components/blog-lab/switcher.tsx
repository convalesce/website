"use client";

import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { ThemeToggle } from "@/components/blog/theme-toggle";

import { VARIANTS, listPath, postPath } from "./variants";

const key = "text-muted hover:text-ink hover:bg-ink/[0.06] inline-flex size-11 shrink-0 items-center justify-center rounded-md transition-colors";
const tab = "text-muted hover:text-ink aria-[current=page]:bg-ink/[0.1] aria-[current=page]:text-ink text-small inline-flex h-9 items-center rounded-sm px-3 transition-colors";

/** Flips between the samples, keeping to the post or the list, and between the two reading themes. Left and right arrow keys step through the samples. */
export function Switcher() {
  const router = useRouter();
  const [, slug, view] = usePathname().split("/").filter(Boolean);
  const at = VARIANTS.findIndex((v) => v.slug === slug);
  const list = view === "list";
  const step = (by: number) => {
    const to = VARIANTS[(at + by + VARIANTS.length) % VARIANTS.length].slug;
    return list ? listPath(to) : postPath(to);
  };
  const previous = at < 0 ? "" : step(-1);
  const next = at < 0 ? "" : step(1);

  useEffect(() => {
    if (!previous) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable]")) return;
      if (event.key === "ArrowLeft") router.push(previous);
      if (event.key === "ArrowRight") router.push(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, previous, next]);

  if (at < 0) return null;
  const current = VARIANTS[at];

  return (
    <nav aria-label="Design samples" className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-3">
      <div className="border-ink/25 bg-panel pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-x-1 rounded-lg border p-1">
        {/* on a small screen the name and the theme take the first row, the rest the second */}
        <div className="order-first flex basis-full items-center justify-between gap-2 pl-3 sm:contents">
          <p className="text-ink text-small whitespace-nowrap tabular-nums sm:px-3" aria-live="polite">
            {at + 1} of {VARIANTS.length}: {current.name}
          </p>
          <ThemeToggle className="sm:order-last" />
        </div>
        <Link href={previous} aria-label={`Previous sample: ${VARIANTS[(at + VARIANTS.length - 1) % VARIANTS.length].name}`} className={`${key} sm:order-first`}>
          <ArrowLeft aria-hidden="true" className="size-4" />
        </Link>
        <Link href={next} aria-label={`Next sample: ${VARIANTS[(at + 1) % VARIANTS.length].name}`} className={key}>
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        <span aria-hidden="true" className="bg-line mx-1 h-6 w-px" />
        <Link href={postPath(current.slug)} aria-current={list ? undefined : "page"} className={tab}>
          Post
        </Link>
        <Link href={listPath(current.slug)} aria-current={list ? "page" : undefined} className={tab}>
          List
        </Link>
        <span aria-hidden="true" className="bg-line mx-1 h-6 w-px" />
        <Link href="/blog-lab" aria-label="All samples" className={key}>
          <LayoutGrid aria-hidden="true" className="size-4" />
        </Link>
        <span aria-hidden="true" className="bg-line mx-1 h-6 w-px max-sm:hidden" />
      </div>
    </nav>
  );
}
