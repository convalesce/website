import { Section } from "@/components/frame";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { INTEGRATIONS } from "@/lib/content";

export function Integrations() {
  return (
    <Section id="integrations" index="06" label="Integrations">
      <SectionHeader
        eyebrow="Connected surface"
        heading="Start with the orchestrator and warehouse you already run."
        body="Heal reads run metadata and schema shape. Add context sources as your needs grow. Tell us which one you need next."
      />

      <Reveal className="mt-14 lg:mt-24">
        <div className="border-line grid border-t border-l sm:grid-cols-2 lg:grid-cols-3">
          {INTEGRATIONS.map((integration) => {
            const soon = integration.status === "soon";
            return (
              <div
                key={integration.name}
                className={`border-line flex items-center justify-between gap-4 border-r border-b p-5 lg:p-6 ${
                  soon ? "opacity-55" : ""
                }`}
              >
                <div className="min-w-0">
                  <h3 className="text-h3 truncate">{integration.name}</h3>
                  <p className="text-faint mt-1 text-[13px]">{integration.kind}</p>
                </div>
                {soon ? (
                  <span className="border-line text-faint font-mono shrink-0 rounded-sm border px-2 py-1 text-[9.5px] tracking-[0.12em] uppercase">
                    Coming soon
                  </span>
                ) : (
                  <span className="text-accent-text font-mono shrink-0 text-[9.5px] tracking-[0.12em] uppercase">
                    <span aria-hidden="true">● </span>Live
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </Reveal>
    </Section>
  );
}
