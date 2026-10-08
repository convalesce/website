import type { ReactNode } from "react";

const tones = {
  note: { rail: "border-l-accent", label: "Note" },
  warn: { rail: "border-l-fail", label: "Careful" },
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
    <aside className={`border-line bg-surface my-8 rounded-md border border-l-2 px-4 py-4 sm:px-5 ${tones[tone].rail}`}>
      <p className="mono-label mb-2">{title ?? tones[tone].label}</p>
      <div className="text-small [&_a]:text-ink [&_p]:text-muted [&_p]:mt-2 [&_p:first-child]:mt-0">{children}</div>
    </aside>
  );
}
