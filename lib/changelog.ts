/* What each release of the plugins changed, read from the emit repository's GitHub releases. */
export type Release = {
  version: string;
  date: string;
  summary: string;
  changes: readonly string[];
};

import type { Source } from "@/lib/versions";

/** `tool` names the mark drawn beside the package. */
export type Package = {
  name: string;
  href: string;
  for: string;
  tool: string;
  source: Source;
};

const pypiUrl = (name: string) => `https://pypi.org/project/${name}/`;
const central = (artifact: string) =>
  `https://central.sonatype.com/artifact/io.convalesce/${artifact}`;

export const PACKAGES: readonly Package[] = [
  {
    name: "convalesce-emit",
    href: pypiUrl("convalesce-emit"),
    tool: "Python",
    source: { kind: "pypi", id: "convalesce-emit" },
    for: "Core client (Python)",
  },
  {
    name: "convalesce-emit-airflow",
    href: pypiUrl("convalesce-emit-airflow"),
    tool: "Airflow",
    source: { kind: "pypi", id: "convalesce-emit-airflow" },
    for: "Airflow",
  },
  {
    name: "convalesce-emit-dagster",
    href: pypiUrl("convalesce-emit-dagster"),
    tool: "Dagster",
    source: { kind: "pypi", id: "convalesce-emit-dagster" },
    for: "Dagster",
  },
  {
    name: "convalesce-emit-prefect",
    href: pypiUrl("convalesce-emit-prefect"),
    tool: "Prefect",
    source: { kind: "pypi", id: "convalesce-emit-prefect" },
    for: "Prefect",
  },
  {
    name: "convalesce-emit-gx",
    href: pypiUrl("convalesce-emit-gx"),
    tool: "Great Expectations",
    source: { kind: "pypi", id: "convalesce-emit-gx" },
    for: "Great Expectations",
  },
  {
    name: "io.convalesce:convalesce-emit-spark",
    href: central("convalesce-emit-spark"),
    tool: "Spark",
    source: { kind: "maven", id: "convalesce-emit-spark" },
    for: "Spark listener (Maven Central)",
  },
  {
    name: "io.convalesce:convalesce-emit-core",
    href: central("convalesce-emit-core"),
    tool: "Java",
    source: { kind: "maven", id: "convalesce-emit-core" },
    for: "Core client (Java)",
  },
];

export const releaseUrl = (version: string) =>
  `https://github.com/convalesce/emit/releases/tag/v${version}`;

const RELEASES =
  "https://api.github.com/repos/convalesce/emit/releases?per_page=100";
const REVALIDATE_SECONDS = 3600;
const TOOLS: Record<string, string> = {
  airflow: "Airflow",
  dagster: "Dagster",
  prefect: "Prefect",
  gx: "Great Expectations",
  spark: "Spark",
  core: "Core client",
  retry: "Retries",
};
// Only what changes how the plugins behave is shown; release, merge, CI and test work is not.
const SHOWN = /^(feat|fix|perf)(\(([^)]+)\))?!?:\s*(.+)$/i;
const NAMED = /^release\s+\d+\.\d+\.\d+:\s*(.+)$/i;

type RawRelease = {
  tag_name?: unknown;
  published_at?: unknown;
  body?: unknown;
  draft?: unknown;
  prerelease?: unknown;
};

const sentence = (text: string) => {
  const clean = text.replace(/\s*\(\d+\.\d+\.\d+\)\s*$/, "").trim();
  return `${clean.charAt(0).toUpperCase()}${clean.slice(1)}${/[.!?]$/.test(clean) ? "" : "."}`;
};

/* GitHub writes each release's notes as the pull requests it merged, one per
   line. A line someone wrote by hand is kept as written. */
function notesOf(body: string): Pick<Release, "summary" | "changes"> {
  const changes: string[] = [];
  let summary = "";
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (!/^[*-]\s/.test(line)) continue;
    const text = line
      .replace(/^[*-]\s+/, "")
      .replace(/\s+by @\S+ in https:\/\/\S+$/, "")
      .trim();
    const named = NAMED.exec(text);
    if (named) {
      summary ||= sentence(named[1]);
      continue;
    }
    const shown = SHOWN.exec(text);
    if (shown) {
      const tool = shown[3] ? TOOLS[shown[3].toLowerCase()] : undefined;
      changes.push(
        tool
          ? `${tool}: ${sentence(shown[4]).replace(/^./, (c) => c.toLowerCase())}`
          : sentence(shown[4]),
      );
    } else if (
      !/by @\S+ in https:/.test(line) &&
      !/^@\S+ made their first contribution/.test(text)
    ) {
      changes.push(sentence(text));
    }
  }
  return { summary, changes };
}

/** Every published release of the plugins, newest first, read from GitHub; empty when GitHub cannot be read. */
export async function releases(): Promise<Release[]> {
  try {
    const res = await fetch(RELEASES, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const raw = (await res.json()) as RawRelease[];
    const found = raw.flatMap((r) =>
      typeof r.tag_name === "string" &&
      typeof r.published_at === "string" &&
      !r.draft &&
      !r.prerelease
        ? [
            {
              version: r.tag_name.replace(/^v/, ""),
              date: r.published_at.slice(0, 10),
              ...notesOf(typeof r.body === "string" ? r.body : ""),
            },
          ]
        : [],
    );
    // The first release has nothing before it to change.
    const first = found.at(-1);
    if (first && !first.summary && first.changes.length === 0)
      first.summary = "First release.";
    return found;
  } catch {
    return [];
  }
}
