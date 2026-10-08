type Step = {
  /** what was looked at */
  step: string;
  /** what it showed, in a sentence */
  finding: string;
};

/** The investigation, one numbered step at a time, each with what it found. */
export function Trail({ title = "Investigation", steps }: { title?: string; steps: readonly Step[] }) {
  return (
    <figure className="border-line bg-surface my-8 overflow-hidden rounded-lg border">
      <figcaption className="border-line mono-label border-b px-4 py-3 sm:px-5">{title}</figcaption>
      <ol className="px-4 sm:px-5">
        {steps.map((item, i) => (
          <li key={item.step} className="border-line grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2 border-t py-4 first:border-t-0">
            <span aria-hidden="true" className="mono-label pt-1 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-ink text-small font-medium">{item.step}</p>
              <p className="text-muted text-small mt-1 text-pretty">{item.finding}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
