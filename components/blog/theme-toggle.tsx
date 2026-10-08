"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

const KEY = "blog-theme";
const CHANGED = "blog-theme-change";

/* The stored choice, or dark. Reading can throw where storage is blocked. */
function stored(): Theme {
  try {
    return localStorage.getItem(KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

/* What the page shows now wins over the store, so a choice still holds for
   the visit when it could not be saved. */
const shown = (): Theme => {
  const at = document.querySelector<HTMLElement>("[data-blog-theme]")?.dataset.blogTheme;
  return at === "light" || at === "dark" ? at : stored();
};

function subscribe(notify: () => void) {
  window.addEventListener(CHANGED, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(CHANGED, notify);
    window.removeEventListener("storage", notify);
  };
}

function choose(theme: Theme) {
  document.querySelectorAll<HTMLElement>("[data-blog-theme]").forEach((el) => (el.dataset.blogTheme = theme));
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // the choice holds for this page; it is not remembered
  }
  window.dispatchEvent(new Event(CHANGED));
}

const option =
  "text-muted hover:text-ink aria-pressed:bg-ink/[0.1] aria-pressed:text-ink text-small inline-flex h-9 items-center rounded-sm px-3 transition-colors pointer-coarse:h-10";

/** Light or dark, for the blog's pages only. It acts on the wrapper that components/blog/theme.tsx renders. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore<Theme>(subscribe, shown, () => "dark");

  /* A page reached by a link inside the app arrives with the server's dark
     wrapper and no script run, so the stored choice is put back here. */
  useEffect(() => {
    const want = stored();
    if (want !== shown()) choose(want);
  }, []);

  return (
    <div role="group" aria-label="Reading theme" className={`inline-flex items-center gap-0.5 ${className}`}>
      {(["light", "dark"] as const).map((value) => (
        <button key={value} type="button" aria-pressed={theme === value} onClick={() => choose(value)} className={option}>
          {value === "light" ? "Light" : "Dark"}
        </button>
      ))}
    </div>
  );
}
