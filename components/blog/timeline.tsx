type Event = {
  /** when it happened, as the post wants it read: "09:42" or "09:42 UTC" */
  time: string;
  what: string;
  /** "fail" marks what went red, "ok" what recovered; the rest are plain */
  state?: "fail" | "ok";
};

const dot = { fail: "bg-fail", ok: "bg-accent", plain: "bg-faint" } as const;
const word = { fail: "Failed", ok: "Recovered" } as const;

/** What happened, in the order it happened. */
export function Timeline({ title = "Timeline", events }: { title?: string; events: readonly Event[] }) {
  return (
    <figure className="border-line bg-surface my-8 overflow-hidden rounded-lg border">
      <figcaption className="border-line mono-label border-b px-4 py-3 sm:px-5">{title}</figcaption>
      <ol className="px-4 sm:px-5">
        {events.map((event) => (
          <li
            key={`${event.time} ${event.what}`}
            className="border-line grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 border-t py-3.5 first:border-t-0 sm:grid-cols-[7rem_auto_minmax(0,1fr)]"
          >
            <time className="text-faint text-mono-sm col-span-2 font-mono tabular-nums sm:col-span-1">{event.time}</time>
            <span aria-hidden="true" className={`size-1.5 -translate-y-0.5 rounded-full ${dot[event.state ?? "plain"]}`} />
            <span className="text-ink text-small text-pretty">
              {event.state ? <span className="sr-only">{word[event.state]}: </span> : null}
              {event.what}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
