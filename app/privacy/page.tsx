import { Legal } from "@/components/legal";
import { PRIVACY } from "@/lib/legal";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/privacy");

export default function Page() {
  return (
    <>
      <Legal page={PRIVACY} index="P" label="Privacy policy" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageJsonLd("/privacy")),
        }}
      />
    </>
  );
}
