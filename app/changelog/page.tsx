import { JsonLd, PageShell } from "@/components/page-shell";
import { CHANGELOG, PACKAGES, releaseUrl } from "@/lib/changelog";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/changelog");

export default function Page() {
  return (
    <>
      <PageShell
        index="C"
        label="Changelog"
        title="What changed in the plugins."
        intro="Release notes for the Convalesce plugins that run beside your pipeline: Airflow, Dagster, Prefect, Great Expectations, and the Spark listener. Each Python plugin is one pip install; Spark is two lines of config."
      >
        <section aria-labelledby="packages" className="mb-14 max-w-[72ch]">
          <h2 id="packages" className="font-display text-h3">Packages</h2>
          <ul className="border-line mt-5 rounded-lg border">
            {PACKAGES.map((pkg) => (
              <li key={pkg.name} className="border-line flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b px-4 py-3 last:border-b-0">
                <a href={pkg.href} target="_blank" rel="noopener noreferrer" className="text-ink font-mono text-small underline underline-offset-4">
                  {pkg.name}
                </a>
                <span className="text-faint text-small">{pkg.for}</span>
              </li>
            ))}
          </ul>
        </section>

        <ol className="max-w-[72ch]">
          {CHANGELOG.map((release) => (
            <li key={release.version} id={`v${release.version}`} className="border-line scroll-mt-24 border-t py-9 first:border-t-0 first:pt-0">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="font-display text-h3">{release.version}</h2>
                <time dateTime={release.date} className="mono-label">{release.date}</time>
              </div>
              <p className="text-ink mt-2">{release.summary}</p>
              <ul className="text-muted marker:text-faint mt-4 list-disc space-y-2 pl-5">
                {release.changes.map((change) => (
                  <li key={change} className="pl-1">{change}</li>
                ))}
              </ul>
              <p className="mt-4">
                <a href={releaseUrl(release.version)} target="_blank" rel="noopener noreferrer" className="text-ink text-small underline underline-offset-4">
                  Release {release.version} on GitHub
                </a>
              </p>
            </li>
          ))}
        </ol>
      </PageShell>
      <JsonLd data={pageJsonLd("/changelog")} />
    </>
  );
}
