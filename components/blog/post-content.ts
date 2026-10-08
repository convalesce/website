import { Children, isValidElement, type ReactElement, type ReactNode } from "react";

import type { Post } from "@/lib/blog";
import { slugify } from "@/lib/blog-source";
import { components, textOf } from "@/mdx-components";

import { Checklist, Window } from "./marks";
import { toMinutes } from "./time";

/* A post, taken apart so the page can lay it out as a manual: the opening
   line of each section on the surface, its lists and figures as boxes, the
   rest of its account folded. The compiled MDX is asked for its top-level
   elements, and each is recognised by the component that would have drawn it. */

export type TimelineEvent = { time: string; what: string; state?: "fail" | "ok"; mark?: "started" | "found" };
export type HandStep = { step: string; minutes: number; note?: string };
export type Item = { lead: string; rest: ReactNode };

export type Block =
  | { kind: "p"; children: ReactNode }
  /** a list whose every item opens with a bold lead */
  | { kind: "points"; items: Item[]; tick: boolean }
  | { kind: "timeline"; title: string; events: readonly TimelineEvent[] }
  | { kind: "byhand"; title: string; estimate: string; steps: readonly HandStep[] }
  /** anything else, drawn as the post wrote it */
  | { kind: "other"; node: ReactNode };

/** Minutes past midnight at each end, or the time after the fix. */
export type Span = { from: number; to: number } | "after";

export type Part = { id: string; title: string; blocks: Block[]; window?: Span };

/** What a post's Timeline says about its incident, as minutes past midnight. */
export type Facts = {
  first: number;
  fixed: number;
  started?: number;
  found?: number;
  whatFailed: string;
  events: readonly TimelineEvent[];
};

export type Loaded = { parts: Part[]; facts?: Facts };

type Kids = { children?: ReactNode };
type TimelineProps = { title?: string; events: readonly TimelineEvent[] };
type HandProps = { title?: string; estimate: string; steps: readonly HandStep[] };
type WindowProps = { from?: string; to?: string; after?: boolean };

const elements = (node: ReactNode) => Children.toArray(node).filter((child): child is ReactElement<Kids> => isValidElement(child));

function points(list: ReactElement<Kids>, tick: boolean): Block {
  const items = elements(list.props.children).map((li) => {
    const [first, ...rest] = Children.toArray(li.props.children);
    return isValidElement(first) && first.type === components.strong ? { lead: textOf(first).replace(/\.$/, ""), rest } : null;
  });
  return items.every((item) => item !== null) ? { kind: "points", items, tick } : { kind: "other", node: list };
}

function blockOf(el: ReactElement): Block {
  if (el.type === components.p) return { kind: "p", children: (el.props as Kids).children };
  if (el.type === components.ul) return points(el as ReactElement<Kids>, false);
  if (el.type === Checklist) {
    const list = elements((el.props as Kids).children).find((child) => child.type === components.ul);
    return list ? points(list, true) : { kind: "other", node: el };
  }
  if (el.type === components.Timeline) {
    const props = el.props as TimelineProps;
    return { kind: "timeline", title: props.title ?? "Timeline", events: props.events };
  }
  if (el.type === components.ByHand) {
    const props = el.props as HandProps;
    return { kind: "byhand", title: props.title ?? "By hand", estimate: props.estimate, steps: props.steps };
  }
  return { kind: "other", node: el };
}

export async function loadPost(post: Post): Promise<Loaded> {
  const { default: Body } = (await import(`@/content/blog/${post.slug}.mdx`)) as {
    default: (props: object) => ReactElement<Kids>;
  };

  const intro: Block[] = [];
  const sections: Part[] = [];
  for (const el of elements(Body({}).props.children)) {
    const section = sections.at(-1);
    if (el.type === components.h2) {
      const title = textOf(el.props.children);
      sections.push({ id: slugify(title), title, blocks: [] });
    } else if (el.type === Window) {
      const { from, to, after } = el.props as WindowProps;
      if (section) section.window = after ? "after" : from && to ? { from: toMinutes(from), to: toMinutes(to) } : undefined;
    } else {
      (section?.blocks ?? intro).push(blockOf(el));
    }
  }

  const timeline = [...intro, ...sections.flatMap((s) => s.blocks)].find((b) => b.kind === "timeline");
  const opening = timeline?.title ?? "Introduction";
  const parts = intro.length > 0 ? [{ id: slugify(opening), title: opening, blocks: intro }, ...sections] : sections;
  if (!timeline || timeline.events.length < 2) return { parts };

  const { events } = timeline;
  const at = (match: (e: TimelineEvent) => boolean) => {
    const event = events.find(match);
    return event ? toMinutes(event.time) : undefined;
  };
  return {
    parts,
    facts: {
      first: at((e) => e.state === "fail") ?? toMinutes(events[0].time),
      fixed: at((e) => e.state === "ok") ?? toMinutes(events.at(-1)!.time),
      started: at((e) => e.mark === "started"),
      found: at((e) => e.mark === "found"),
      whatFailed: (events.find((e) => e.state === "fail") ?? events[0]).what,
      events,
    },
  };
}

/** Each step with the minute it starts and the minute it ends, counted on from `started`. */
export const scheduled = (steps: readonly HandStep[], started: number) =>
  steps.map((step, i) => {
    const from = started + steps.slice(0, i).reduce((sum, s) => sum + s.minutes, 0);
    return { ...step, from, to: from + step.minutes };
  });
