import Link from "next/link";

import { ThemeToggle } from "@/components/blog/theme-toggle";
import { Footer } from "@/components/footer";
import { Section } from "@/components/frame";
import { Nav } from "@/components/nav";
import { VARIANTS, listPath, postPath } from "@/components/blog-lab/variants";

const view = "text-ink hover:text-accent-text text-small inline-flex min-h-11 items-center underline decoration-ink/30 underline-offset-4 transition-colors";

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main">
        <Section index="/blog-lab" label="Design lab" pad="tight">
          <header className="pt-12 sm:pt-16 lg:pt-24">
            <h1 className="font-display text-display max-w-[20ch] text-balance">Seven ways a post could be built.</h1>
            <p className="text-muted mt-6 max-w-[62ch] text-pretty">
              Each sample sets the same post and the same list a different way. Open two side by side, or step through them with the left and right arrow keys. Rows marked Sample stand in for posts not yet written.
            </p>
            <ThemeToggle className="border-line mt-6 rounded-md border p-1" />
          </header>
          <ol className="border-line mt-12 border-t lg:mt-16">
            {VARIANTS.map((variant, i) => (
              <li key={variant.slug} className="border-line grid gap-x-10 gap-y-2 border-b py-7 lg:grid-cols-[3rem_16rem_minmax(0,1fr)_auto] lg:items-baseline">
                <span aria-hidden="true" className="text-faint text-mono font-mono tabular-nums">{i + 1}</span>
                <h2 className="font-display text-h2">{variant.name}</h2>
                <p className="text-muted max-w-[58ch] text-pretty">{variant.idea}</p>
                <p className="flex gap-6">
                  <Link href={postPath(variant.slug)} className={view} aria-label={`${variant.name}: the post`}>Post</Link>
                  <Link href={listPath(variant.slug)} className={view} aria-label={`${variant.name}: the list`}>List</Link>
                </p>
              </li>
            ))}
          </ol>
        </Section>
      </main>
      <Footer />
    </>
  );
}
