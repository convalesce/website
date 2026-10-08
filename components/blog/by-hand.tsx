type Step = {
  /** what the engineer does */
  step: string;
  minutes: number;
  /** a short line under the step, where it needs one */
  note?: string;
};

const span = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return [h > 0 ? `${h} h` : "", m > 0 || h === 0 ? `${m} min` : ""].filter(Boolean).join(" ");
};

/* The same work done by a person, with a time against each step. The times
   are never measurements, so the label saying whose estimate they are is not
   optional: `estimate` is required, and scripts/check-blog.mjs fails a post
   whose ByHand leaves it out. */
export function ByHand({
  title = "By hand",
  estimate,
  steps,
}: {
  title?: string;
  /** the visible label, e.g. "Our estimate for a mid-sized team" */
  estimate: string;
  steps: readonly Step[];
}) {
  const total = steps.reduce((sum, item) => sum + item.minutes, 0);
  return (
    <figure className="border-line bg-surface my-8 overflow-hidden rounded-lg border">
      <figcaption className="border-line flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-4 py-3 sm:px-5">
        <span className="mono-label">{title}</span>
        <span className="mono-label border-line text-muted rounded-sm border px-2 py-1">{estimate}</span>
      </figcaption>
      <ol className="px-4 sm:px-5">
        {steps.map((item, i) => (
          <li
            key={item.step}
            className="border-line grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-baseline gap-x-2 border-t py-3.5 first:border-t-0"
          >
            <span aria-hidden="true" className="mono-label tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-ink text-small text-pretty">{item.step}</p>
              {item.note ? <p className="text-faint text-small mt-0.5 text-pretty">{item.note}</p> : null}
            </div>
            <span className="text-muted text-mono-sm pl-2 font-mono whitespace-nowrap tabular-nums">
              <span aria-hidden="true">~</span>
              <span className="sr-only">about </span>
              {span(item.minutes)}
            </span>
          </li>
        ))}
      </ol>
      <p className="border-line flex items-baseline justify-between gap-4 border-t px-4 py-3.5 sm:px-5">
        <span className="text-ink text-small font-medium">Total, estimated</span>
        <span className="text-accent-text text-mono font-mono whitespace-nowrap tabular-nums">
          <span aria-hidden="true">~</span>
          <span className="sr-only">about </span>
          {span(total)}
        </span>
      </p>
    </figure>
  );
}
