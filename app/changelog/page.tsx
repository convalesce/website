import { JsonLd, PageShell } from "@/components/page-shell";
import { CHANGELOG, PACKAGES, releaseUrl } from "@/lib/changelog";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/changelog");

const link = "text-ink underline underline-offset-4 hover:text-accent-text transition-colors";

const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export default function Page() {
  return (
    <>
      <PageShell
        index="/changelog"
        label="Plugins"
        title="What changed in the plugins."
        intro="Release notes for the Convalesce plugins that run beside your pipeline: Airflow, Dagster, Prefect, Great Expectations and the Spark listener. Each Python plugin is one pip install; Spark is two lines of config."
      >
        <section aria-labelledby="packages" className="border-line border-t pt-10">
          <h2 id="packages" className="font-display text-h3">Packages</h2>
          <ul className="mt-5 max-w-[72ch]">
            {PACKAGES.map((pkg) => (
              <li key={pkg.name} className="border-line grid gap-x-6 gap-y-0.5 border-b py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline">
                <a href={pkg.href} target="_blank" rel="noopener noreferrer" className={`${link} font-mono text-mono-sm break-all sm:text-mono`}>
                  {pkg.name}
                </a>
                <span className="text-faint text-small">{pkg.for}</span>
              </li>
            ))}
          </ul>
        </section>

        <ol className="border-line mt-14 border-t">
          {CHANGELOG.map((release) => (
            <li
              key={release.version}
              id={`v${release.version}`}
              className="border-line grid scroll-mt-24 gap-x-10 gap-y-3 border-b py-9 lg:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <div className="lg:sticky lg:top-24 lg:self-start">
                <h2 className="font-display text-h2 tabular-nums">{release.version}</h2>
                <time dateTime={release.date} className="text-faint text-small mt-1 block tabular-nums">
                  {day.format(new Date(release.date))}
                </time>
              </div>
              <div className="max-w-[68ch]">
                <p className="text-ink text-pretty">{release.summary}</p>
                <ul className="text-muted marker:text-faint mt-4 list-disc space-y-2 pl-5">
                  {release.changes.map((change) => (
                    <li key={change} className="pl-1 text-pretty">{change}</li>
                  ))}
                </ul>
                <p className="mt-5">
                  <a href={releaseUrl(release.version)} target="_blank" rel="noopener noreferrer" className={`${link} text-small`}>
                    Release {release.version} on GitHub
                  </a>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </PageShell>
      <JsonLd data={pageJsonLd("/changelog")} />
    </>
  );
}
