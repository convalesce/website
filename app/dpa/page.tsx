import { Legal } from "@/components/legal";
import { DPA } from "@/lib/legal";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/dpa");

export default function Page() {
  return (
    <>
      <Legal page={DPA} index="D" label="Data processing addendum" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd("/dpa")) }}
      />
    </>
  );
}
