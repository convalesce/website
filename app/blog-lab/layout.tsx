import type { Metadata } from "next";
import type { ReactNode } from "react";

import { BlogTheme } from "@/components/blog/theme";
import { Switcher } from "@/components/blog-lab/switcher";

/* A design lab for the blog: samples to choose between. Not part of the
   site: no page links here, and nothing here is indexed. */
export const metadata: Metadata = {
  title: "Blog design lab",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <BlogTheme>
      {children}
      <Switcher />
    </BlogTheme>
  );
}
