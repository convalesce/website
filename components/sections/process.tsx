import { Section } from "@/components/frame";
import { StackMap } from "@/components/sections/stack-map";
import { SectionHeader } from "@/components/ui/section-header";

export function Process() {
  return (
    <Section id="how-it-works" index="02" label="How it works">
      <SectionHeader
        heading="How a failed run becomes a pull request."
        body="Convalesce collects the evidence, works out the cause, and sends your team a fix they can check."
      />
      <StackMap />
    </Section>
  );
}
