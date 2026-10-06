import { Legal } from "@/components/legal";
import { TERMS } from "@/lib/legal";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/terms");

export default function Page() {
  return (
    <>
      <Legal page={TERMS} index="T" label="Terms of service" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageJsonLd("/terms")),
        }}
      />
    </>
  );
}
