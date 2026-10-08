/* The lab's register: six answers, and one that joins two of them, to "what is a Convalesce post, as an object?". */
export const VARIANTS = [
  {
    slug: "incident-report",
    name: "Incident report",
    idea: "The post is a post-mortem: the facts first, the morning drawn to scale, and every section placed on that same axis.",
  },
  {
    slug: "evidence-trail",
    name: "Evidence trail",
    idea: "The post is a chain: one rail runs the length of the page, each section is a numbered link on it, and the rail is the contents list.",
  },
  {
    slug: "running-clock",
    name: "The running clock",
    idea: "The post is an hour passing: a quiet clock counts the engineer's minutes as you read, and each step lands in the text when it happens.",
  },
  {
    slug: "lineage",
    name: "Lineage",
    idea: "The post is a node in a graph: the header shows where the failure sits in a pipeline, and the list wires posts to the assets they cover.",
  },
  {
    slug: "editorial",
    name: "Editorial",
    idea: "The post is a magazine long-read: a very large title, a standfirst, and the figures and numbers set out in the margin.",
  },
  {
    slug: "field-manual",
    name: "Dense field manual",
    idea: "The post is a reference page: an outline that never leaves, the key lines and checklists on the surface, the narrative folded under them.",
  },
  {
    slug: "field-report",
    name: "Field report",
    idea: "Samples 6 and 1 together: the manual's permanent outline, folded narrative and checklist, opened by the report's facts and its morning drawn to scale, with each section placed on that morning.",
  },
] as const;

export type Variant = (typeof VARIANTS)[number];
export type VariantSlug = Variant["slug"];

export const variantOf = (slug: string) => VARIANTS.find((v) => v.slug === slug);

export const postPath = (slug: VariantSlug) => `/blog-lab/${slug}`;
export const listPath = (slug: VariantSlug) => `/blog-lab/${slug}/list`;

/* Planned titles from the series, shown so a list can be judged with more
   than one row. They have no date, no text and no page. */
export const SAMPLES = [
  {
    title: "A column was renamed upstream, and three teams found out from a dashboard",
    covers: ["table", "dashboard"],
  },
  {
    title: "One empty field, two failing tools, one cause",
    covers: ["check", "job"],
  },
  {
    title: "The pipeline was green and the numbers were wrong",
    covers: ["check", "dashboard"],
  },
  {
    title: "The commit that looked guilty and was not",
    covers: ["job"],
  },
] as const satisfies readonly { title: string; covers: readonly Kind[] }[];

export type Kind = "table" | "job" | "check" | "dashboard";

/** What the one real post covers, for the lists that sort by it. */
export const REAL_COVERS: readonly Kind[] = ["job", "table", "dashboard"];
