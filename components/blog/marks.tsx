import type { ReactNode } from "react";

/* Two marks a post can leave for the page that lays it out. Neither draws
   anything of its own: components/blog/post-content.ts reads them. */

/** Under a `##` heading: the part of the post's Timeline that section is about. */
export const Window: (props: { from?: string; to?: string; after?: boolean }) => null = () => null;

/** Around a list of things to put in place, so it is drawn as one to tick. */
export function Checklist({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
