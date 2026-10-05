import { Footer } from "@/components/footer";
import { Section } from "@/components/frame";
import { Nav } from "@/components/nav";
import type { LegalPage } from "@/lib/legal";

/* A legal page is read, not scanned: one measure of prose in the same frame
   as every other page, with nothing animating as it comes in. */
export function Legal({ page, index }: { page: LegalPage; index: string }) {
  return (
    <>
      <Nav />

      <main id="main">
        <Section index={index} label={page.title} pad="tight">
          <div className="max-w-[68ch] pt-12 sm:pt-16 lg:pt-24">
            <h1 className="font-display text-h2 text-balance">{page.title}</h1>
            <p className="text-faint text-mono-sm mt-3 font-mono">Last updated {page.updated}</p>
            <p className="text-muted mt-8">{page.intro}</p>

            {page.clauses.map((clause) => (
              <section key={clause.heading} className="border-line mt-10 border-t pt-8">
                <h2 className="font-display text-h3">{clause.heading}</h2>
                {clause.points ? (
                  <ul className="text-muted mt-4 list-disc space-y-2 pl-5">
                    {clause.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : null}
                {clause.body?.map((paragraph) => (
                  <p key={paragraph} className="text-muted mt-4">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
