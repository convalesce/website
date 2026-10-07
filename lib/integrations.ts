import { INTEGRATIONS, type Integration } from "@/lib/content";

/* What each integration page says. The sentences follow the setup guide on the
   docs site for the same tool, so the two never disagree. `pip` is set for a
   tool that connects by a plugin you install; the rest are read from outside
   by one read-only credential and install nothing. */
type Detail = {
  summary: string;
  reads: readonly string[];
  pip?: string;
  /** what the connection does not do, in the tool's own terms; defaults by how it connects */
  boundary?: string;
  /** replaces the default three steps where the tool connects differently */
  steps?: readonly [string, string, string];
};

export const slugOf = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const READ_ONLY = "Connects over HTTPS with one read-only credential. Nothing is installed on your side.";

export const DEFAULT_BOUNDARY = {
  plugin:
    "It forwards the tool's own output as it is. Secrets are redacted, and row values and parameters are withheld by default. A failed send never raises an error into your pipeline.",
  read: "Read-only. It reads shape and run metadata. While investigating a failure it may run small read-only queries: capped, masked, never stored, and switchable off per connection.",
} as const;

export const DEFAULT_STEPS = {
  plugin: ["Install the plugin where it runs", "Set your ingest key on every worker", "Run something and watch the first event arrive"],
  read: ["Open Integrations in the console and choose it", "Create the read-only credential the screen writes for you", "Test the connection and choose how often it is read"],
} as const;

const DETAIL: Record<string, Detail> = {
  Airflow: {
    summary:
      "A plugin that tells Convalesce about every dag run and task as it happens: started, succeeded, failed, and why. Nothing to add to your dags.",
    reads: ["Dag runs and task runs", "Failure reasons", "Task groups and assets"],
    pip: "convalesce-emit-airflow",
  },
  Dagster: {
    summary:
      "A plugin that tells Convalesce about every Dagster run when it finishes: what ran, how long each step took, and what it materialised. Two run-status sensors added to your definitions do the reporting.",
    reads: ["Runs and run steps", "Materialised assets", "Asset checks and groups"],
    pip: "convalesce-emit-dagster",
  },
  Prefect: {
    summary:
      "A plugin that tells Convalesce about your flow runs and task runs: started, finished, failed, and why. State hooks attached to your flows and tasks do the reporting.",
    reads: ["Flow runs and task runs", "Failure reasons", "Short results and launched runs"],
    pip: "convalesce-emit-prefect",
  },
  dbt: {
    summary:
      "Convalesce reads the artifact files dbt writes when it runs, from S3, Google Cloud Storage or an HTTPS URL. It never runs dbt and never touches your warehouse through this connection.",
    reads: ["Models and their dependencies (manifest.json)", "Columns and types (catalog.json)", "Run results"],
    boundary: "It never runs dbt and never touches your warehouse through this connection.",
    steps: ["Have dbt write its artifacts to S3, Google Cloud Storage or an HTTPS URL", "Point the connect screen at them", "Test the connection and choose how often they are read"],
  },
  Spark: {
    summary:
      "A listener that tells Convalesce about every application, job and SQL query as it runs, in Spark's own words. It reads none of your data and changes nothing about how a job runs.",
    reads: ["Applications, jobs and stages", "SQL queries", "Failures, including PySpark driver failures"],
    boundary: "It reads none of your data and changes nothing about how a job runs.",
    pip: "convalesce-emit-spark",
  },
  Snowflake: {
    summary:
      "Convalesce reads Snowflake through one role and one user that you create for it. The connect screen writes the SQL for both, and you choose how that user signs in.",
    reads: ["Schemas, tables and columns", "Optional: lineage, usage, tags, tasks and pipes"],
  },
  Databricks: {
    summary:
      "Convalesce reads Databricks through Unity Catalog, as a service principal or with a personal access token. The connect screen writes the grants for every catalog you list.",
    reads: ["Catalogs, schemas and tables", "Lineage and usage from the system tables, with a SQL warehouse"],
  },
  Postgres: {
    summary:
      "Convalesce reads your Postgres database through one read-only role that you create. It works with any Postgres that has a public address, from RDS and Aurora to Supabase and Neon.",
    reads: ["Schemas, tables and columns"],
  },
  "AWS Glue": {
    summary:
      "Convalesce reads the AWS Glue Data Catalog through one read-only IAM user in your own account, scoped to your region and buckets. Glue is regional, so each region is its own connection.",
    reads: ["Databases and tables in the catalogue", "Job definitions"],
  },
  "Amazon S3": {
    summary:
      "Convalesce reads the files in your bucket and turns them into datasets, using a path spec you write and one read-only IAM user.",
    reads: ["Datasets built from files, by path spec", "Paths, containers and schemas"],
  },
  Kafka: {
    summary:
      "Convalesce reads the topics on your Kafka cluster and, if you name a schema registry, the schema of each one. It connects as an ordinary client over an encrypted connection and knows Confluent Cloud, Amazon MSK, Azure Event Hubs, Redpanda and more.",
    reads: ["Topics", "Schemas from the schema registry"],
  },
  "Great Expectations": {
    summary:
      "A plugin that tells Convalesce the result of every checkpoint you run: which expectations passed, which failed, and on which table. It works as an action you add to your checkpoints, on GX Core 1.x and on 0.17 and 0.18.",
    reads: ["Checkpoint results", "Expectations that passed or failed", "The tables they ran on"],
    pip: "convalesce-emit-gx",
  },
  Tableau: {
    summary:
      "Convalesce reads your Tableau site as one user that you create for it, on Tableau Cloud or on a Tableau Server with a public address.",
    reads: ["Workbooks, dashboards and data sources", "Which tables feed them"],
  },
  GitHub: {
    summary:
      "Convalesce reads the code behind your pipelines to find the change that broke something. It opens an issue for the people who own that code and can propose a fix as a draft pull request. A person reviews and merges every one.",
    reads: ["Code in the repositories you choose", "Commits and pull requests"],
    boundary: "A person reviews and merges every pull request, under your repository's own rules.",
    steps: ["Install the Convalesce app on your GitHub account", "Choose all repositories or only the ones behind your pipelines", "Finish on GitHub and see them listed under Repositories"],
  },
  Lineage: {
    summary:
      "Describe the inputs, outputs and runs of your jobs in a lineage file, and Convalesce draws the table and column lineage from it.",
    reads: ["Table-level lineage", "Column-level lineage"],
  },
};

const FALLBACK: Detail = {
  summary: "On our list. Tell us you want it and what you would want it to show, and it moves up.",
  reads: [],
};

export type IntegrationPage = Integration & Detail & { slug: string };

export const INTEGRATION_PAGES: readonly IntegrationPage[] = INTEGRATIONS.map((i) => ({
  ...i,
  ...(DETAIL[i.name] ?? FALLBACK),
  slug: slugOf(i.name),
}));

export const byOne = (slug: string) => INTEGRATION_PAGES.find((i) => i.slug === slug);

export { READ_ONLY };
