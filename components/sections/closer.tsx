import { ArrowUpRight } from "lucide-react";

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
          <Button
            href={CLOSER.cta.href}
            event="request_early_access"
            trailing={<ArrowUpRight className="size-4" />}
            className="mt-7"
          >
            {CLOSER.cta.label}
          </Button>
        }
      />
    </Section>
  );
}
