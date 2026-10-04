export const SITE = {
  company: "Convalesce",
  product: "Convalesce",
  domain: "https://convalesce.io",
  tagline: "Self-healing data infrastructure.",
  description:
    "Convalesce self-heals your data infrastructure. Agents pick up a failed run, trace its blast radius, and return a fix with the evidence behind it.",
  email: "v.joshi@convalesce.io",
  app: "https://app.convalesce.io",
  docs: "https://docs.convalesce.io",
} as const;

/** A link that leaves the site opens beside it, so the page being read stays. */
export const outside = (href: string) =>
  href.startsWith("http") ? ({ target: "_blank", rel: "noopener noreferrer" } as const) : {};

export const mailto = (subject: string) =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;

export const CTA = {
  primary: { label: "Get started", href: SITE.app },
  secondary: { label: "See the evidence trail", href: "#how-it-works" },
} as const;

export const NAV_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Context", href: "/#context" },
  { label: "Integrations", href: "/#integrations" },
  { label: "Docs", href: SITE.docs },
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
  body: "Agents pick up the failed run, trace its blast radius, and open a pull request with the fix and the evidence. Convalesce reads the shape of your data, never the rows.",
  /* The share card carries one supporting line under the headline, so it gets
     its own sentence rather than a slice of the body. */
  sub: "Agents pick up the failed run, trace its blast radius, and return a fix with the evidence behind it.",
} as const;

export const STACK = [
  "Airflow",
  "Snowflake",
  "dbt",
  "Databricks",
  "Spark",
  "Prefect",
  "Postgres",
  "Kafka",
  "OpenLineage",
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
    footnote: "Your environment → Convalesce",
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
    body: "Convalesce combines runtime evidence with metadata, lineage, the code behind the run, and context from the tools already connected to it.",
    footnote: "Lineage + code + schema history",
    artifact: {
      caption: "Incident bundle",
      rows: [
        ["runtime", "task state, retries, exit codes"],
        ["lineage", "upstream cause, downstream blast radius"],
        ["metadata", "schema, types, freshness, row counts"],
        ["code", "the query, the model, the commit that changed it"],
      ],
    },
  },
  {
    n: "03",
    title: "Resolve and heal",
    body: "Agents reason over a scoped incident bundle, then open a pull request with the fix and the evidence trail attached, so an engineer can verify before it ships.",
    footnote: "Cause → evidence → action",
    artifact: {
      caption: "Evidence trail",
      rows: [
        ["+0.2s", "Task exception captured"],
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
    name: "Your repositories",
    question: "What code ran, and what changed in it?",
    reads: "queries · models · commits",
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
  run: "CV-2847",
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

/* Each tool's own mark, served from public/logos. */
export const TOOL_LOGOS: Record<string, string> = {
  Airflow: "airflow.svg",
  Dagster: "dagster.svg",
  Prefect: "prefect.svg",
  dbt: "dbt.svg",
  Spark: "spark.svg",
  Snowflake: "snowflake.svg",
  Databricks: "databricks.png",
  Postgres: "postgres.svg",
  "AWS Glue": "glue.svg",
  "Amazon S3": "s3.svg",
  Fivetran: "fivetran.png",
  "Great Expectations": "great-expectations.png",
  Tableau: "tableau.png",
  OpenLineage: "openlineage.svg",
  BigQuery: "bigquery.svg",
  "Google Cloud Storage": "gcs.svg",
  Dataplex: "dataplex.svg",
  "Vertex AI": "vertexai.png",
  Looker: "looker.svg",
};

export type Integration = {
  name: string;
  kind: string;
  status: "live" | "soon";
};

export const INTEGRATIONS: readonly Integration[] = [
  { name: "Airflow", kind: "Orchestrator", status: "live" },
  { name: "Dagster", kind: "Orchestrator", status: "live" },
  { name: "Prefect", kind: "Orchestrator", status: "live" },
  { name: "dbt", kind: "Transformation", status: "live" },
  { name: "Spark", kind: "Processing", status: "live" },
  { name: "Snowflake", kind: "Warehouse", status: "live" },
  { name: "Databricks", kind: "Lakehouse", status: "live" },
  { name: "Postgres", kind: "Database", status: "live" },
  { name: "AWS Glue", kind: "Catalogue and jobs", status: "live" },
  { name: "Amazon S3", kind: "Storage", status: "live" },
  { name: "Kafka", kind: "Streaming", status: "live" },
  { name: "Great Expectations", kind: "Data quality", status: "live" },
  { name: "Tableau", kind: "Dashboards", status: "live" },
  { name: "GitHub", kind: "Code and pull requests", status: "live" },
  { name: "OpenLineage", kind: "Lineage", status: "live" },
  { name: "BigQuery", kind: "Warehouse", status: "soon" },
  { name: "Google Cloud Storage", kind: "Storage", status: "soon" },
  { name: "Dataplex", kind: "Catalogue", status: "soon" },
  { name: "Vertex AI", kind: "Machine learning", status: "soon" },
  { name: "Looker", kind: "Dashboards", status: "soon" },
  { name: "Fivetran", kind: "Ingestion", status: "soon" },
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
    body: "Start with the tools you already run, then connect more context as you need it.",
    proof: "one tool · your environment · nothing else",
  },
] as const;

export const FAQ = [
  {
    q: "Does Convalesce apply fixes on its own?",
    a: "No. The most it does is open a pull request against your repository, with the evidence attached. You review it and you merge it.",
  },
  {
    q: "What does Convalesce need access to?",
    a: "Read access to your run metadata and your information schema. Convalesce reads the shape of your data: schemas, types, row counts, lineage. Not the rows themselves. Access to your code is a separate step you choose, by installing the GitHub app on the repositories you pick.",
  },
  {
    q: "Does our data leave our environment?",
    a: "Only the incident bundle does, and only what the investigation needs. Context is scoped to the failed run rather than mirrored wholesale into another system.",
  },
  {
    q: "How long does setup take?",
    a: "Sign in with GitHub or Google, answer three short questions, and connect the tools you want. Convalesce starts building context on the next failed run.",
  },
  {
    q: "Which tools are supported?",
    a: "The integrations listed above are live today, and more are on the way. The docs have a setup guide for each. If you run something that isn't there, tell us what.",
  },
] as const;

export const CLOSER = {
  head: "Stop reconstructing failures.",
  body: "Sign in with GitHub or Google, connect a tool, and see your next failed run explained.",
  cta: { label: "Get started", href: SITE.app },
} as const;
