import { ArrowLeft } from "lucide-react";
import { Fragment } from "react";

import { Footer } from "@/components/footer";
import { Section } from "@/components/frame";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Reveal, SplitText } from "@/components/ui/reveal";

/* The 404 states itself the way the product states an incident: a mono
   key/value block naming the failure, its cause and its fix. */
const ROWS = [
  ["status", "404 · not found"],
  ["cause", "the route has no upstream"],
  ["fix", "return to the homepage"],
] as const;

export default function NotFound() {
  return (
    <>
      <Nav />

      <main id="main">
        <Section index="404" label="Not found" top pad="tight">
          <div className="grid gap-10 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-6 lg:pt-24">
            <div className="lg:col-span-7">
              <p className="mono-label mono-eyebrow mb-6">Dead link</p>
              <Reveal mode="words">
                <h1 className="font-display text-h2 max-w-[22ch] text-balance">
                  <SplitText text="This page could not be resolved." />
                </h1>
              </Reveal>
            </div>

            <div className="lg:col-span-5 lg:col-start-8 lg:pt-[92px]">
              <Reveal delay={140}>
                <p className="text-muted max-w-[52ch]">
                  The link may be stale, or the page may never have existed. Everything
                  Convalesce has to show sits on one page.
                </p>

                <div className="border-line mt-8 border-y py-5">
                  <dl className="font-mono text-mono grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-1.5">
                    {ROWS.map(([key, value]) => (
                      <Fragment key={key}>
                        <dt className="text-faint">{key}</dt>
                        <dd className="text-ink/85 break-words">{value}</dd>
                      </Fragment>
                    ))}
                  </dl>
                </div>

                <Button href="/" className="mt-7" trailing={<ArrowLeft className="size-4" />}>
                  Back to the homepage
                </Button>
              </Reveal>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
