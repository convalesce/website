/* The version of each package a visitor can install today, read from the
   registry that serves it rather than typed here. PyPI and Maven Central are
   the sources of truth: a GitHub release can exist before its jars do.
   Pages that call these are rebuilt at most an hour after a release, and a
   registry that is down or answers oddly falls back to the last version known
   to be published, so a page never shows a blank or invented version. */

const REVALIDATE_SECONDS = 3600;
const VERSION = /^\d+\.\d+\.\d+$/;

export type Source =
  | { kind: "pypi"; id: string }
  | { kind: "maven"; id: string };

/** The last versions confirmed published; used only when a registry cannot be read. */
export const KNOWN_VERSION = "0.1.7";

async function pypi(name: string): Promise<string | null> {
  const res = await fetch(`https://pypi.org/pypi/${name}/json`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { info?: { version?: unknown } };
  const version = body.info?.version;
  return typeof version === "string" && VERSION.test(version) ? version : null;
}

async function maven(artifact: string): Promise<string | null> {
  const res = await fetch(
    `https://repo1.maven.org/maven2/io/convalesce/${artifact}/maven-metadata.xml`,
    { next: { revalidate: REVALIDATE_SECONDS } },
  );
  if (!res.ok) return null;
  const xml = await res.text();
  const version = /<release>([^<]+)<\/release>/.exec(xml)?.[1] ?? /<latest>([^<]+)<\/latest>/.exec(xml)?.[1];
  return version && VERSION.test(version) ? version : null;
}

export async function latestVersion(source: Source): Promise<string> {
  try {
    const version = source.kind === "pypi" ? await pypi(source.id) : await maven(source.id);
    return version ?? KNOWN_VERSION;
  } catch {
    return KNOWN_VERSION;
  }
}
