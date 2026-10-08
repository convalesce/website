import { Footer } from "@/components/footer";
import { Section } from "@/components/frame";
import { Nav } from "@/components/nav";
import { textLink } from "@/components/ui/text-link";
import { outside } from "@/lib/content";
import type { Block, LegalPage, Run } from "@/lib/legal";

/** An anchor for a heading, so a clause can be linked to: "2-1-customer-as-controller". */
function anchor(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Words({ runs }: { runs: readonly Run[] }) {
  return (
    <>
      {runs.map((run, i) => {
        const words = run.bold ? <strong className="text-ink font-semibold">{run.text}</strong> : run.text;
        return run.href ? (
          <a key={i} href={run.href} {...outside(run.href)} className={textLink}>
            {words}
          </a>
        ) : (
          <span key={i}>{words}</span>
        );
      })}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 id={anchor(block.text)} className="border-line font-display text-h2 mt-14 scroll-mt-24 border-t pt-10 text-balance first:mt-10">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 id={anchor(block.text)} className="font-display text-ink mt-9 scroll-mt-24 text-[1.1875rem] leading-snug font-semibold tracking-[-0.02em]">
          {block.text}
        </h3>
      );
    case "h4":
      return (
        <h4 id={anchor(block.text)} className="font-display text-h3 mt-7 scroll-mt-24">
          {block.text}
        </h4>
      );
    case "p":
      return (
        <p className="text-muted mt-4">
          <Words runs={block.runs} />
        </p>
      );
    case "ul":
      return (
        <ul className="text-muted marker:text-faint mt-4 list-disc space-y-2 pl-5">
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              <Words runs={item} />
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        // A wide table scrolls inside its own frame; the page never does.
        <div className="border-line mt-6 overflow-x-auto rounded-lg border" tabIndex={0} role="region" aria-label="Table, scrolls sideways">
          <table className="text-small w-full min-w-[44rem] border-collapse text-left align-top">
            <thead>
              <tr className="border-line border-b">
                {block.head.map((cell, i) => (
                  <th key={i} scope="col" className="text-ink px-4 py-3 align-top font-semibold">
                    <Words runs={cell.map((run) => ({ ...run, bold: false }))} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-line border-b last:border-b-0">
                  {row.map((cell, c) => (
                    <td key={c} className="text-muted px-4 py-3 align-top">
                      <Words runs={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

/* A legal page is read, not scanned: one measure of prose in the same frame
   as every other page, with nothing animating as it comes in. Its words come
   from the document's PDF as they stand (see lib/legal.ts). */
export function Legal({ page, index, label }: { page: LegalPage; index: string; label: string }) {
  return (
    <>
      <Nav />

      <main id="main">
        <Section index={index} label={label} pad="tight">
          <article className="max-w-[72ch] pt-12 pb-4 sm:pt-16 lg:pt-24">
            <h1 className="font-display text-h2 text-balance">{page.title}</h1>
            {page.blocks.map((block, i) => (
              <BlockView key={i} block={block} />
            ))}
          </article>
        </Section>
      </main>

      <Footer />
    </>
  );
}
