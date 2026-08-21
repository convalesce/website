import { Section } from "@/components/frame";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { CLOSER } from "@/lib/content";

export function Closer() {
  return (
    <Section index="08" label="Early access" pad="tight">
      <SectionHeader
        eyebrow={CLOSER.eyebrow}
        heading={CLOSER.head}
        body={CLOSER.body}
        action={
          <>
            <Button
              href={CLOSER.cta.href}
              event="request_early_access"
              trailing="↗"
              className="mt-7"
            >
              {CLOSER.cta.label}
            </Button>
            <p className="text-faint font-mono text-mono-sm mt-5">{CLOSER.note}</p>
          </>
        }
      />
    </Section>
  );
}
