import type { ReactNode } from "react";

/* The blog's reading theme. The wrapper carries `data-blog-theme`, which
   globals.css keys the light palette on; nothing outside it can change.
   Dark is the default and what the server sends. */

export const THEME_KEY = "blog-theme";

/* Runs before the first paint, as the wrapper's first child, so a reader who
   chose light never sees dark first. A blocked store leaves the default. */
const apply = `try{if(localStorage.getItem("${THEME_KEY}")==="light")document.currentScript.parentElement.dataset.blogTheme="light"}catch(e){}`;

export function BlogTheme({ children }: { children: ReactNode }) {
  return (
    // the attribute is changed by the script and the toggle, outside React
    <div data-blog-theme="dark" suppressHydrationWarning className="bg-bg text-ink min-h-svh">
      <script dangerouslySetInnerHTML={{ __html: apply }} />
      {children}
    </div>
  );
}
