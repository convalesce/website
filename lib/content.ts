export const SITE = {
  company: "Convalesce",
  product: "Convalesce",
  domain: "https://convalesce.io",
  tagline: "Self-healing data infrastructure.",
  description:
    "Convalesce self-heals your data infrastructure. Agents pick up a failed run, trace its blast radius, and return a fix with the evidence behind it.",
  /** Where a question about the product or an account goes. */
  email: "support@convalesce.io",
  /** Where a question about personal data goes; the legal pages name it too. */
  privacyEmail: "privacy@convalesce.io",
  app: "https://app.convalesce.io",
  docs: "https://docs.convalesce.io",
} as const;

/* The blog is served from its own host: the list at the root, a post at
   /<slug>. Inside the app the routes stay under /blog, and the host rules in
   next.config.ts and vercel.ts map one onto the other. Change the address
   here, and in the two redirects in vercel.ts, which must be literals. */
export const BLOG = {
  url: "https://blog.convalesce.io",
  title: "Convalesce blog",
} as const;

/* Every page besides the home page, listed once. The sitemap, the LLM index
   and each page's own metadata all read this, so a new page is added here and
   nowhere else. `updated` is the day its content last changed. */
export const PAGES = [
  {
    path: "/integrations",
    title: "Integrations",
    description:
      "The orchestrators, warehouses, lakes, streams and dashboards Convalesce connects to, with a setup guide for each.",
    updated: "2026-10-06",
    priority: 0.8,
  },
  {
    path: "/blog",
    title: "Blog",
    description:
      "What a data incident looks like from the inside: where the time goes, who waits, and what shortens it, one real failure at a time.",
    updated: "2026-10-08",
    priority: 0.7,
  },
  {
    path: "/changelog",
    title: "Changelog",
    description:
      "What changed in each release of the Convalesce plugins for Airflow, Dagster, Prefect, Great Expectations and Spark.",
    updated: "2026-10-06",
    priority: 0.6,
  },
  {
    path: "/about",
    title: "About",
    description:
      "Why Convalesce exists, what it believes about incidents and evidence, and how it handles your data.",
    updated: "2026-10-06",
    priority: 0.6,
  },
  {
    path: "/contact",
    title: "Contact",
    description:
      "Ask about the product, request an integration, get help with an account, or make a privacy request.",
    updated: "2026-10-06",
    priority: 0.7,
  },
  {
    path: "/privacy",
    title: "Privacy policy",
    description:
      "What personal data Convalesce collects, why, how long it is kept, who it is shared with, and the rights you have over it.",
    updated: "2026-10-05",
    priority: 0.3,
  },
  {
    path: "/terms",
    title: "Terms of service",
    description:
      "The terms that cover your use of Convalesce during the free beta: accounts, acceptable use, your data, and liability.",
    updated: "2026-10-05",
    priority: 0.3,
  },
  {
    path: "/dpa",
    title: "Data processing addendum",
    description:
      "How Convalesce processes personal data on a customer's behalf: roles, subprocessors, security measures, transfers, and deletion.",
    updated: "2026-10-05",
    priority: 0.3,
  },
] as const;

export type PagePath = (typeof PAGES)[number]["path"];

/** A page's public address. Every page lives on the main host except the blog. */
export const pageUrl = (path: PagePath) => (path === "/blog" ? `${BLOG.url}/` : `${SITE.domain}${path}`);

/** A link that leaves the site opens beside it, so the page being read stays. */
export const outside = (href: string) =>
  href.startsWith("http")
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};

export const mailto = (subject: string) =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;

export const CTA = {
  primary: { label: "Get started", href: SITE.app },
  secondary: { label: "See the evidence trail", href: "#how-it-works" },
} as const;

export const NAV_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Integrations", href: "/integrations" },
  { label: "Changelog", href: "/changelog" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
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
  body: "Agents pick up the failed run, trace its blast radius, and open a pull request with the fix and the evidence. Convalesce reads the shape of your data, and only looks at rows to confirm a cause.",
  /* The share card carries one supporting line under the headline, so it gets
     its own sentence rather than a slice of the body. */
  sub: "Agents pick up the failed run, trace its blast radius, and return a fix with the evidence behind it.",
} as const;

/* What the product actually holds at this stage, shown as key/value mono. */
export type Artifact = {
  caption: string;
  rows: readonly (readonly [string, string])[];
  /** the change itself, where the stage ends in one */
  diff?: {
    file: string;
    lines: readonly { kind: "same" | "cut" | "add"; code: string }[];
  };
  /** how the stage ends, in a few words */
  outcome: string;
};

export type Step = {
  n: string;
  title: string;
  body: string;
  artifact: Artifact;
};

export const STEPS: readonly Step[] = [
  {
    n: "01",
    title: "Capture the failure",
    body: "Convalesce's integration records the failed run: the exception, the task state, and what else was running at the time.",
    artifact: {
      caption: "Captured run",
      rows: [
        ["dag", "daily_orders"],
        ["task", "load_orders"],
        ["state", "failed at 09:42:18 UTC"],
        ["exception", "SnowflakeSQLException: invalid type"],
      ],
      outcome: "Sent from your environment to Convalesce",
    },
  },
  {
    n: "02",
    title: "Build the context",
    body: "It adds what your connected tools already know: table shapes, lineage, and the code behind the run.",
    artifact: {
      caption: "Incident bundle",
      rows: [
        ["runtime", "task state, retries, exit codes"],
        ["lineage", "upstream cause, downstream blast radius"],
        ["metadata", "schema, types, freshness, row counts"],
        ["code", "the query, the model, the commit that changed it"],
      ],
      outcome: "One bundle, scoped to this run",
    },
  },
  {
    n: "03",
    title: "Send the fix",
    body: "Agents work only from that bundle. They open a pull request with the fix and the evidence, so an engineer can check it before it ships.",
    artifact: {
      caption: "Pull request",
      rows: [
        [
          "cause",
          "order_total went from NUMBER to VARCHAR in raw.shopify_orders",
        ],
        ["reaches", "stg_orders, daily_orders, finance.daily_revenue"],
      ],
      diff: {
        file: "models/staging/stg_orders.sql",
        lines: [
          { kind: "same", code: "  order_id," },
          { kind: "cut", code: "  order_total," },
          {
            kind: "add",
            code: "  cast(order_total as number) as order_total,",
          },
          { kind: "same", code: "  customer_id," },
        ],
      },
      outcome: "Opened for review, with the evidence attached",
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
    reads: "task state, exceptions, retries",
  },
  {
    name: "Lineage",
    question: "What data is connected and impacted?",
    reads: "inputs, outputs, job runs",
  },
  {
    name: "Your repositories",
    question: "What code ran, and what changed in it?",
    reads: "queries, models, commits",
  },
  {
    name: "Metadata",
    question: "What changed in the tables underneath?",
    reads: "information_schema, row counts, freshness",
  },
  {
    name: "Convalesce instrumentation",
    question: "What did this run know at the moment it failed?",
    reads: "params, upstream versions, config",
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
  change: "order_total: NUMBER to VARCHAR",
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
  Lineage: "openlineage.svg",
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
  /** Its setup guide's path under SITE.docs; absent where the docs have no page for it. */
  docs?: string;
};

export const INTEGRATIONS: readonly Integration[] = [
  { name: "Airflow", kind: "Orchestrator", status: "live", docs: "transformation/airflow" },
  { name: "Dagster", kind: "Orchestrator", status: "live", docs: "transformation/dagster" },
  { name: "Prefect", kind: "Orchestrator", status: "live", docs: "transformation/prefect" },
  { name: "dbt", kind: "Transformation", status: "live", docs: "transformation/dbt" },
  { name: "Spark", kind: "Processing", status: "live", docs: "transformation/spark" },
  { name: "Snowflake", kind: "Warehouse", status: "live", docs: "data-warehouses/snowflake" },
  { name: "Databricks", kind: "Lakehouse", status: "live", docs: "data-warehouses/databricks" },
  { name: "Postgres", kind: "Database", status: "live", docs: "transactional-databases/postgres" },
  { name: "AWS Glue", kind: "Catalogue and jobs", status: "live", docs: "catalogs-and-metadata/glue" },
  { name: "Amazon S3", kind: "Storage", status: "live", docs: "data-lakes/s3" },
  { name: "Kafka", kind: "Streaming", status: "live", docs: "streaming/kafka" },
  { name: "Great Expectations", kind: "Data quality", status: "live", docs: "transformation/great-expectations" },
  { name: "Tableau", kind: "Dashboards", status: "live", docs: "business-intelligence/tableau" },
  { name: "GitHub", kind: "Code and pull requests", status: "live", docs: "collaboration/github" },
  { name: "Lineage", kind: "Inputs, outputs and runs", status: "live" },
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
    body: "Every conclusion links to what it was drawn from, so an engineer can check it before acting.",
    proof: "every conclusion cites its signals",
  },
  {
    name: "Only what the incident needs",
    body: "Convalesce collects the context an incident needs, not another copy of your data.",
    proof: "small read-only queries, capped and masked",
  },
  {
    name: "Fits the stack you have",
    body: "Start with the tools you already run, then connect more context as you need it.",
    proof: "one tool, your environment, nothing else",
  },
] as const;

export const FAQ = [
  {
    q: "Does Convalesce apply fixes on its own?",
    a: "No. The most it does is open a pull request against your repository, with the evidence attached. You review it and you merge it.",
  },
  {
    q: "What does Convalesce need access to?",
    a: "Read access to your run metadata and your tables. Convalesce reads the shape of your data all the time: schemas, types, row counts, lineage. While it investigates a failure it may also run small read-only queries to confirm a cause. Those are capped, personal columns are masked, the rows are never stored, and what comes back is sent to the AI model. You can switch reading off for any connection. Access to your code is a separate step you choose, by installing the GitHub app on the repositories you pick.",
  },
  {
    q: "Does our data leave our environment?",
    a: "Only the incident bundle does, and only what the investigation needs. It covers the failed run and nothing else. It is not a copy of your warehouse.",
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
