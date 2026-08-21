export const SITE = {
  company: "Convalesce",
  product: "Convalesce",
  domain: "https://convalesce.io",
  tagline: "Self-healing for data pipelines.",
  description:
    "Convalesce's agents pick up a failed pipeline run, trace the blast radius through your environment, and return a fix with the evidence behind it.",
  email: "vedanshu7.joshi@gmail.com",
} as const;

export const mailto = (subject: string) =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;

export const CTA = {
  primary: { label: "Request early access", href: mailto("Convalesce early access") },
  secondary: { label: "See the evidence trail", href: "#how-it-works" },
} as const;

export const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Context", href: "#context" },
  { label: "Integrations", href: "#integrations" },
] as const;

export const HERO = {
  head: "Self-healing data infrastructure",
  /* the headline as rendered: a fixed stem and a rotating object, so a
     visitor sees their own stack named within a few seconds */
  headStem: "Self-healing",
  rotating: [
    "data infrastructure",
    "data pipelines",
    "data warehouses",
    "data lakehouses",
    "data workflows",
  ],
  body: "Agents pick up the failed run, trace its blast radius through your environment, and return a fix with the evidence, before anyone opens a tab. Convalesce reads the shape of your data, never the rows, and you decide whether a fix is proposed or applied.",
} as const;

export const STACK = [
  "Airflow",
  "Snowflake",
  "dbt",
  "OpenLineage",
  "OpenTelemetry",
] as const;

/* What the product actually holds at this stage, shown as key/value mono. */
export type Artifact = {
  caption: string;
  rows: readonly (readonly [string, string])[];
};

export type Step = {
  n: string;
  title: string;
  body: string;
  footnote: string;
  artifact: Artifact;
};

export const STEPS: readonly Step[] = [
  {
    n: "01",
    title: "Capture the failure",
    body: "Convalesce's integration captures the failed run, the exception, the task state, and the correlated execution metadata around it.",
    footnote: "Your env → Convalesce ENV",
    artifact: {
      caption: "Captured run",
      rows: [
        ["dag", "daily_orders"],
        ["task", "load_orders"],
        ["state", "failed · 09:42:18 UTC"],
        ["exception", "SnowflakeSQLException: invalid type"],
      ],
    },
  },
  {
    n: "02",
    title: "Build the context",
    body: "Convalesce combines runtime evidence with metadata, lineage, telemetry, and context from the tools already connected to it.",
    footnote: "Lineage + telemetry + schema history",
    artifact: {
      caption: "Incident bundle",
      rows: [
        ["runtime", "task state, retries, exit codes"],
        ["lineage", "upstream cause, downstream blast radius"],
        ["warehouse", "schema, types, freshness, row counts"],
        ["telemetry", "spans, exceptions, timing"],
      ],
    },
  },
  {
    n: "03",
    title: "Resolve and heal",
    body: "Agents reason over a scoped incident bundle, then propose or apply the fix, with the evidence trail attached, so an engineer can verify before it ships.",
    footnote: "Cause → evidence → action",
    artifact: {
      caption: "Evidence trail",
      rows: [
        ["+0.2s", "Airflow task exception captured"],
        ["+0.8s", "Lineage impact resolved"],
        ["+1.4s", "Schema history compared"],
        ["cause", "order_total NUMBER → VARCHAR in raw.shopify_orders"],
        ["fix", "CAST(order_total AS NUMBER)"],
        ["confidence", "94%"],
      ],
    },
  },
] as const;

export type ContextSource = {
  name: string;
  question: string;
  /** the concrete signals this source contributes, in mono */
  reads: string;
};

export const CONTEXT_SOURCES: readonly ContextSource[] = [
  {
    name: "Orchestrator runs",
    question: "What happened in your data tools?",
    reads: "task state · exceptions · retries",
  },
  {
    name: "OpenLineage",
    question: "What data is connected and impacted?",
    reads: "inputs · outputs · job runs",
  },
  {
    name: "OpenTelemetry",
    question: "What execution caused what?",
    reads: "spans · traces · timing",
  },
  {
    name: "Metadata",
    question: "What changed in the tables underneath?",
    reads: "information_schema · row counts · freshness",
  },
  {
    name: "Convalesce instrumentation",
    question: "What did this run know at the moment it failed?",
    reads: "params · upstream versions · config",
  },
] as const;

/* Real pipeline names, so the ticker reads as the product rather than as decoration. */
export const TICKER_ITEMS = [
  "daily_orders",
  "finance.daily_revenue",
  "raw.shopify_orders",
  "dim_customers",
  "stg_payments",
  "marts.arr_rollup",
] as const;

/* The hero's incident as a lineage graph. Columns are left-to-right flow,
   rows separate the join. Blast order is how far downstream each hit sits. */
export const LINEAGE = {
  run: "HL-2847",
  nodes: [
    { id: "shopify", name: "raw.shopify_orders", col: 0, row: 1 },
    { id: "stg", name: "stg_orders", col: 1, row: 1 },
    { id: "customers", name: "dim_customers", col: 1, row: 0 },
    { id: "daily", name: "daily_orders", col: 2, row: 1 },
    { id: "revenue", name: "finance.daily_revenue", col: 3, row: 1 },
  ],
  edges: [
    ["shopify", "stg"],
    ["stg", "daily"],
    ["customers", "daily"],
    ["daily", "revenue"],
  ],
  origin: "shopify",
  blast: ["stg", "daily", "revenue"],
  change: "order_total: NUMBER → VARCHAR",
  fix: "CAST(order_total AS NUMBER)",
} as const;

export type LineageNode = (typeof LINEAGE.nodes)[number];

export type Integration = {
  name: string;
  kind: string;
  status: "live" | "soon";
};

export const INTEGRATIONS: readonly Integration[] = [
  { name: "Airflow", kind: "Orchestrator", status: "live" },
  { name: "Snowflake", kind: "Warehouse", status: "live" },
  { name: "dbt", kind: "Transformation", status: "live" },
  { name: "OpenLineage", kind: "Lineage", status: "live" },
  { name: "OpenTelemetry", kind: "Telemetry", status: "live" },
  { name: "Dagster", kind: "Orchestrator", status: "soon" },
  { name: "BigQuery", kind: "Warehouse", status: "soon" },
  { name: "Databricks", kind: "Lakehouse", status: "soon" },
  { name: "Postgres", kind: "Database", status: "soon" },
] as const;

export const PRINCIPLES = [
  {
    name: "Evidence before answers",
    body: "Every conclusion is tied to the signals behind it, so engineers can verify before acting.",
    proof: "every conclusion cites its signals",
  },
  {
    name: "Scoped by design",
    body: "Convalesce collects the context an incident needs, not another copy of your data.",
    proof: "reads information_schema · never table rows",
  },
  {
    name: "Fits the stack you have",
    body: "Start with your orchestrator and warehouse, then add context sources as your needs grow.",
    proof: "one tool · your environment · nothing else",
  },
] as const;

export const FAQ = [
  {
    q: "Does Convalesce apply fixes on its own?",
    a: "You choose. Convalesce can stop at a proposed fix with its evidence attached, or apply it and open the trail for review. Auto-apply is opt-in per pipeline, never a default.",
  },
  {
    q: "What does Convalesce need access to?",
    a: "Read access to your orchestrator's run metadata and your warehouse's information schema. Convalesce reads the shape of your data: schemas, types, row counts, lineage. Not the rows themselves.",
  },
  {
    q: "Does our data leave our environment?",
    a: "Only the incident bundle does, and only what the investigation needs. Context is scoped to the failed run rather than mirrored wholesale into another system.",
  },
  {
    q: "How long does setup take?",
    a: "Configure your environment to connect the tools you want. Convalesce starts building context on the next failed run.",
  },
  {
    q: "Which tools are supported?",
    a: "The integrations listed above are live today, and the rest are on the way. If you run something that isn't there, tell us what. Early access is where we decide the order.",
  },
] as const;

export const CLOSER = {
  eyebrow: "Early access",
  head: "Stop reconstructing failures.",
  body: "We're working with early data teams to shape Convalesce around real production incidents.",
  cta: { label: "Join the early access list", href: mailto("Convalesce early access") },
} as const;
