import type { ReactNode } from "react";

import { BlogTheme } from "@/components/blog/theme";

/* The blog's pages alone can be read in light or dark: this wrapper carries
   the choice, and components/blog/theme-toggle.tsx changes it. */
export default function Layout({ children }: { children: ReactNode }) {
  return <BlogTheme>{children}</BlogTheme>;
}
