/* What each release of the emit libraries changed, in a customer's words.
   Source: the tagged releases of the emit repository. Newest first. */
export type Release = {
  version: string;
  date: string;
  summary: string;
  changes: readonly string[];
};

import type { Source } from "@/lib/versions";

export type Package = { name: string; href: string; for: string; source: Source };

const pypiUrl = (name: string) => `https://pypi.org/project/${name}/`;
const central = (artifact: string) =>
  `https://central.sonatype.com/artifact/io.convalesce/${artifact}`;

export const PACKAGES: readonly Package[] = [
  { name: "convalesce-emit", href: pypiUrl("convalesce-emit"), source: { kind: "pypi", id: "convalesce-emit" }, for: "Core client (Python)" },
  { name: "convalesce-emit-airflow", href: pypiUrl("convalesce-emit-airflow"), source: { kind: "pypi", id: "convalesce-emit-airflow" }, for: "Airflow" },
  { name: "convalesce-emit-dagster", href: pypiUrl("convalesce-emit-dagster"), source: { kind: "pypi", id: "convalesce-emit-dagster" }, for: "Dagster" },
  { name: "convalesce-emit-prefect", href: pypiUrl("convalesce-emit-prefect"), source: { kind: "pypi", id: "convalesce-emit-prefect" }, for: "Prefect" },
  { name: "convalesce-emit-gx", href: pypiUrl("convalesce-emit-gx"), source: { kind: "pypi", id: "convalesce-emit-gx" }, for: "Great Expectations" },
  { name: "io.convalesce:convalesce-emit-spark", href: central("convalesce-emit-spark"), source: { kind: "maven", id: "convalesce-emit-spark" }, for: "Spark listener (Maven Central)" },
  { name: "io.convalesce:convalesce-emit-core", href: central("convalesce-emit-core"), source: { kind: "maven", id: "convalesce-emit-core" }, for: "Core client (Java)" },
];

export const releaseUrl = (version: string) =>
  `https://github.com/convalesce/emit/releases/tag/v${version}`;

export const CHANGELOG: readonly Release[] = [
  {
    version: "0.1.7",
    date: "2026-10-07",
    summary: "Retries sign in the way each tool expects.",
    changes: [
      "Airflow, Dagster and Prefect: the retry executors now sign in to each tool's own API the way that tool expects.",
      "The retry job itself is no longer reported as a run.",
    ],
  },
  {
    version: "0.1.6",
    date: "2026-10-02",
    summary: "Prefect and Airflow send more of what a run did.",
    changes: [
      "Prefect: a task's short result and the runs it launched now travel with the event.",
      "Prefect 2: results are read from the cache Prefect 2 actually keeps.",
      "Airflow: a task's group id is sent.",
    ],
  },
  {
    version: "0.1.5",
    date: "2026-09-25",
    summary: "Every tool tested back through its older versions, and values stay private by default.",
    changes: [
      "A PySpark driver-failure plugin (convalesce-emit-pyspark) was added to the source; it is not published to PyPI yet.",
      "Spark: every listener event is delivered.",
      "Great Expectations: column values are redacted by default and every datasource type is named correctly.",
      "Prefect: parameter values are withheld by default, secrets are redacted and assets are forwarded.",
      "Airflow and Dagster: asset checks and column lineage are forwarded, Airflow 3.2 events are fixed, and listener secrets are redacted.",
      "Dagster: asset groups and asset query metadata for SQL lineage.",
      "Backward-coverage tests for each tool run in CI, including Airflow 3.2 and Dagster 1.9 to 1.13.24.",
    ],
  },
  {
    version: "0.1.4",
    date: "2026-09-23",
    summary: "A bad value or a down network never breaks your pipeline.",
    changes: [
      "Batches that cannot be delivered wait on disk and go out after the next send that works; refused batches are split and kept aside.",
      "Spark events are flushed in the background.",
      "Failed tasks are forwarded.",
      "An unreadable value costs that one field, not the whole event, and the library never raises into the tool.",
    ],
  },
  {
    version: "0.1.3",
    date: "2026-09-13",
    summary: "Version string fix.",
    changes: ["The Java client reports the right version."],
  },
  {
    version: "0.1.2",
    date: "2026-09-13",
    summary: "Retries, and bigger payloads.",
    changes: [
      "Retry executors for Airflow, Dagster and Prefect: an approved fix can clear a task, re-execute a run from failure, or reschedule a flow run.",
      "A payload too large for one request is split, and the pieces share one id.",
      "Airflow: asset events are forwarded.",
      "Operation and assertion outcomes can be recorded explicitly.",
    ],
  },
  {
    version: "0.1.1",
    date: "2026-09-11",
    summary: "Each tool names its run, task and group.",
    changes: [
      "Airflow: events name the DAG and run they belong to.",
      "Dagster: the run, its events and what the run points at.",
      "Prefect: a task run says which flow and run it belongs to.",
      "Spark: the run is sent rather than every task, and every event names its application.",
      "Batches are capped by size and nesting is counted the way each tool nests.",
    ],
  },
  {
    version: "0.1.0",
    date: "2026-09-11",
    summary: "First release.",
    changes: [
      "Plugins for Airflow, Dagster, Prefect and Great Expectations, and a Spark listener.",
      "Each forwards the tool's own output unchanged; the client has no dependencies of its own.",
    ],
  },
] as const;
