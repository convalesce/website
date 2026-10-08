import type { ReactNode } from "react";

const tones = {
  note: { dot: "bg-accent", label: "Note" },
  warn: { dot: "bg-fail", label: "Careful" },
} as const;

/** A short aside set apart from the argument: a caveat, a definition, a warning. */
export function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: keyof typeof tones;
  /** replaces the tone's own label */
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className="border-line my-8 rounded-md border px-4 py-4 sm:px-5">
      <p className="mono-label mb-2 flex items-center gap-2">
        <span aria-hidden="true" className={`size-1.5 rounded-full ${tones[tone].dot}`} />
        {title ?? tones[tone].label}
      </p>
      <div className="text-small [&_p]:text-small [&_p]:text-muted [&_p]:mt-2 [&_p:first-child]:mt-0">{children}</div>
    </aside>
  );
}
