export const SITE = {
  company: "Convalesce",
  product: "Heal",
  domain: "https://convalesce.ai",
  tagline: "Self-healing for data pipelines.",
  description:
    "Heal's agents pick up a failed pipeline run, trace the blast radius through your lineage, and return a fix with the evidence behind it.",
  email: "hello@convalesce.ai",
} as const;

export const mailto = (subject: string) =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;

export const CTA = {
  primary: { label: "Request early access", href: mailto("Heal early access") },
  secondary: { label: "See how it works", href: "#how-it-works" },
} as const;

export const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Context", href: "#context" },
  { label: "Integrations", href: "#integrations" },
] as const;

export const HERO = {
  eyebrow: "Self-healing data infrastructure",
  headLeft: "When data breaks,",
  headRight: "Heal fixes it.",
  body: "Heal's agents pick up the failed run, trace the blast radius through your lineage, and return a fix with the evidence behind it, before your team opens a single tab.",
  assurances: [
    "Designed for privacy-conscious teams",
    "Context stays scoped to the incident",
  ],
} as const;

export const STACK = [
  "Airflow",
  "Snowflake",
  "dbt",
  "OpenLineage",
  "OpenTelemetry",
] as const;

export type Step = {
  n: string;
  title: string;
  body: string;
  footnote: string;
};

export const STEPS: readonly Step[] = [
  {
    n: "01",
    title: "Capture the failure",
    body: "Heal's orchestration integration captures the failed run, the exception, task state, and the correlated execution metadata around it.",
    footnote: "Airflow SDK → Heal SDK",
  },
  {
    n: "02",
    title: "Build the context",
    body: "Heal combines runtime evidence with warehouse metadata, lineage, telemetry, and context from the tools already connected to the run.",
    footnote: "Evidence, connected",
  },
  {
    n: "03",
    title: "Resolve and heal",
    body: "Agents reason over a scoped incident bundle, then propose or apply the fix, with the evidence trail attached, so an engineer can verify before it ships.",
    footnote: "Cause → evidence → action",
  },
] as const;

export type ContextSource = {
  n: string;
  name: string;
  question: string;
};

export const CONTEXT_SOURCES: readonly ContextSource[] = [
  {
    n: "01",
    name: "Connectors",
    question: "What happened in your data tools?",
  },
  {
    n: "02",
    name: "OpenLineage",
    question: "What data is connected and impacted?",
  },
  {
    n: "03",
    name: "OpenTelemetry",
    question: "What execution caused what?",
  },
  {
    n: "04",
    name: "Warehouse metadata",
    question: "What changed in the tables underneath?",
  },
  {
    n: "05",
    name: "Heal instrumentation",
    question: "What did this run know at the moment it failed?",
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

export const PILLARS = [
  { name: "Runtime execution", detail: "Task state, retries, exit codes" },
  { name: "Data lineage", detail: "Upstream cause, downstream blast radius" },
  { name: "Warehouse metadata", detail: "Schema, types, freshness, row counts" },
  { name: "Logs & telemetry", detail: "Spans, exceptions, timing" },
] as const;

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
  },
  {
    name: "Scoped by design",
    body: "Heal collects incident-relevant context instead of becoming another uncontrolled copy of your data.",
  },
  {
    name: "Fits the stack you have",
    body: "Start with your orchestrator and warehouse, then add context sources as your needs grow.",
  },
] as const;

export const FAQ = [
  {
    q: "Does Heal apply fixes on its own?",
    a: "You choose. Heal can stop at a proposed fix with its evidence attached, or apply it and open the trail for review. Auto-apply is opt-in per pipeline, never a default.",
  },
  {
    q: "What does Heal need access to?",
    a: "Read access to your orchestrator's run metadata and your warehouse's information schema. Heal reads the shape of your data: schemas, types, row counts, lineage. Not the rows themselves.",
  },
  {
    q: "Does our data leave our environment?",
    a: "Only the incident bundle does, and only what the investigation needs. Context is scoped to the failed run rather than mirrored wholesale into another system.",
  },
  {
    q: "How long does setup take?",
    a: "Install the SDK in your Airflow deployment and connect your warehouse. Heal starts building context on the next failed run.",
  },
  {
    q: "Which orchestrators are supported?",
    a: "Airflow today. Dagster is next. If you run something else, tell us what. Early access is where we decide the order.",
  },
] as const;

export const CLOSER = {
  eyebrow: "Early access",
  head: "Spend less time reconstructing failures.",
  body: "We're working with early data teams to shape Heal around real production incidents.",
  cta: { label: "Join the early access list", href: mailto("Heal early access") },
} as const;

/* The hero's incident, reused verbatim from the working demo. */
export const INCIDENT = {
  id: "HL-2847",
  source: "Airflow · prod",
  pipeline: "daily_orders",
  time: "09:42:18 UTC",
  rootSignal: "Column type drift",
  downstream: "finance.daily_revenue",
  trail: [
    { text: "Airflow task exception captured", at: "+0.2s" },
    { text: "Lineage impact resolved", at: "+0.8s" },
    { text: "Schema history compared", at: "+1.4s" },
  ],
  cause: {
    column: "order_total",
    change: "changed from NUMBER to VARCHAR in",
    table: "raw.shopify_orders",
  },
  confidence: "94%",
  fix: "CAST(order_total AS NUMBER)",
} as const;
