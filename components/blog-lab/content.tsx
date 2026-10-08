import { Children, isValidElement, type ReactElement, type ReactNode } from "react";

import { POSTS, type Post } from "@/lib/blog";
import { slugify } from "@/lib/blog-source";

import { toMinutes } from "./time";

/* The lab reads the real post, not a copy of it. The compiled MDX is asked for
   its top-level elements with marker components in place of the real ones, so
   each sample can lay the same words and the same figure data out its own way. */

export { clock, span, toMinutes } from "./time";

export const SLUG = "what-a-data-incident-really-costs";

export type TimelineEvent = { time: string; what: string; state?: "fail" | "ok" };
export type HandStep = { step: string; minutes: number; note?: string };

export type Item = { lead: string; rest: ReactNode; all: ReactNode };

export type Block =
  | { kind: "p"; children: ReactNode }
  | { kind: "ul"; items: Item[] }
  | { kind: "timeline"; title: string; events: readonly TimelineEvent[] }
  | { kind: "byhand"; title: string; estimate: string; steps: readonly HandStep[] };

export type Part = { id: string; title: string; blocks: Block[] };

export type Loaded = {
  post: Post;
  /** what comes before the first heading */
  intro: Block[];
  sections: Part[];
  timeline: Extract<Block, { kind: "timeline" }>;
  byHand: Extract<Block, { kind: "byhand" }>;
  facts: Facts;
};

export type Facts = {
  /** minutes past midnight */
  first: number;
  started: number;
  found: number;
  fixed: number;
  whatFailed: string;
  waiting: string[];
  handTotal: number;
};

type TimelineProps = { title?: string; events: readonly TimelineEvent[] };
type HandProps = { title?: string; estimate: string; steps: readonly HandStep[] };
type Kids = { children?: ReactNode };

const TimelineMark = (): null => null;
const ByHandMark = (): null => null;
const markers = { p: "p", h2: "h2", ul: "ul", li: "li", Timeline: TimelineMark, ByHand: ByHandMark };

export const textOf = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<Kids>(node)) return textOf(node.props.children);
  return "";
};

function blockOf(el: ReactElement): Block {
  if (el.type === "p") return { kind: "p", children: (el.props as Kids).children };
  if (el.type === "ul") {
    const items = Children.toArray((el.props as Kids).children)
      .filter((li): li is ReactElement<Kids> => isValidElement(li))
      .map((li) => {
        const [first, ...rest] = Children.toArray(li.props.children);
        const led = isValidElement(first);
        return { lead: led ? textOf(first) : "", rest: led ? rest : li.props.children, all: li.props.children };
      });
    return { kind: "ul", items };
  }
  if (el.type === TimelineMark) {
    const props = el.props as TimelineProps;
    return { kind: "timeline", title: props.title ?? "Timeline", events: props.events };
  }
  if (el.type === ByHandMark) {
    const props = el.props as HandProps;
    return { kind: "byhand", title: props.title ?? "By hand", estimate: props.estimate, steps: props.steps };
  }
  throw new Error(`blog lab: the post uses an element the lab does not lay out (${String(el.type)})`);
}

export async function loadPost(): Promise<Loaded> {
  const post = POSTS.find((p) => p.slug === SLUG);
  if (!post) throw new Error(`blog lab: ${SLUG} is not among the posts`);

  const { default: Body } = (await import(`@/content/blog/${SLUG}.mdx`)) as {
    default: (props: { components: typeof markers }) => ReactElement<Kids>;
  };
  const top = Children.toArray(Body({ components: markers }).props.children).filter(
    (node): node is ReactElement => isValidElement(node),
  );

  const intro: Block[] = [];
  const sections: Part[] = [];
  for (const el of top) {
    if (el.type === "h2") {
      const title = textOf((el.props as Kids).children);
      sections.push({ id: slugify(title), title, blocks: [] });
    } else {
      (sections.at(-1)?.blocks ?? intro).push(blockOf(el));
    }
  }

  const blocks = [...intro, ...sections.flatMap((s) => s.blocks)];
  const timeline = blocks.find((b) => b.kind === "timeline");
  const byHand = blocks.find((b) => b.kind === "byhand");
  if (!timeline || !byHand) throw new Error("blog lab: the post has lost its Timeline or its ByHand");

  const at = (match: (e: TimelineEvent) => boolean) => toMinutes((timeline.events.find(match) ?? timeline.events[0]).time);
  const waiting = sections.find((s) => s.id === "who-is-waiting")?.blocks.find((b) => b.kind === "ul");
  const handTotal = byHand.steps.reduce((sum, s) => sum + s.minutes, 0);
  const started = at((e) => /starts looking/.test(e.what));

  return {
    post,
    intro,
    sections,
    timeline,
    byHand,
    facts: {
      first: at((e) => e.state === "fail"),
      started,
      found: started + handTotal,
      fixed: at((e) => e.state === "ok"),
      whatFailed: timeline.events.find((e) => e.state === "fail")?.what ?? "",
      waiting: waiting?.kind === "ul" ? waiting.items.map((i) => i.lead.replace(/\.$/, "")) : [],
      handTotal,
    },
  };
}

/** Each step with the minute it starts and the minute it ends, counted on from `started`. */
export const scheduled = (steps: readonly HandStep[], started: number) =>
  steps.map((step, i) => {
    const from = started + steps.slice(0, i).reduce((sum, s) => sum + s.minutes, 0);
    return { ...step, from, to: from + step.minutes };
  });
