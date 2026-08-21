import { Circle } from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiApacheairflow,
  SiDatabricks,
  SiGooglebigquery,
  SiOpentelemetry,
  SiPostgresql,
  SiSnowflake,
} from "react-icons/si";

import { Section } from "@/components/frame";
import { Cell, Grid } from "@/components/ui/grid";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { INTEGRATIONS } from "@/lib/content";

/* dbt, OpenLineage and Dagster publish no mark in any icon set; they ride on
   the wordmark alone, same as in the marquee. */
const LOGOS: Record<string, IconType> = {
  Airflow: SiApacheairflow,
  Snowflake: SiSnowflake,
  OpenTelemetry: SiOpentelemetry,
  BigQuery: SiGooglebigquery,
  Databricks: SiDatabricks,
  Postgres: SiPostgresql,
};

const chip = "mono-label border-line inline-flex items-center gap-1.5 rounded-sm border px-2 py-1";

export function Integrations() {
  return (
    <Section id="integrations" index="05" label="Integrations">
      <SectionHeader
        eyebrow="Connected surface"
        heading="Start with the orchestrator and warehouse you already run."
        body="Convalesce reads run metadata and schema shape. Add context sources as your needs grow. Tell us which one you need next."
      />

      <Reveal className="mt-14 lg:mt-24">
        <Grid cols={3}>
          {INTEGRATIONS.map((integration) => {
            const live = integration.status === "live";
            const Logo = LOGOS[integration.name];
            return (
              <Cell
                key={integration.name}
                className={`flex items-center justify-between gap-4 ${live ? "" : "opacity-60"}`}
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  {Logo ? (
                    <Logo aria-hidden="true" className="text-muted size-5 shrink-0" />
                  ) : (
                    <span aria-hidden="true" className="bg-line size-5 shrink-0 rounded-full" />
                  )}
                  <div className="min-w-0">
                    <h3 className="text-h3 truncate">{integration.name}</h3>
                    <p className="text-faint text-small mt-0.5">{integration.kind}</p>
                  </div>
                </div>
                {live ? (
                  <span className={`${chip} text-accent-text border-accent/30 shrink-0`}>
                    <Circle aria-hidden="true" className="size-2 fill-current" />
                    Live
                  </span>
                ) : (
                  <span className={`${chip} shrink-0`}>Soon</span>
                )}
              </Cell>
            );
          })}
        </Grid>
      </Reveal>
    </Section>
  );
}
