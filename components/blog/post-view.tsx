import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { textLink } from "@/components/ui/text-link";
import { formatDay, type Post } from "@/lib/blog";
import { CLOSER, CTA, SITE } from "@/lib/content";

import { PostMeta } from "./post-list";
import { ThemeToggle } from "./theme-toggle";

const column = "mx-auto w-full max-w-[42rem] px-4 sm:px-6";
const secondary =
  "border-ink/25 bg-bg/60 text-ink hover:border-ink/40 hover:bg-ink/[0.06] inline-flex h-11 items-center gap-2 rounded-md border px-5 text-small font-medium whitespace-nowrap transition-colors";

export function PostView({ post, body, newer, older }: { post: Post; body: ReactNode; newer?: Post; older?: Post }) {
  const updated = post.updated && post.updated !== post.date ? post.updated : null;
  return (
    <>
      <Nav home={SITE.domain} current={post.path} />
      <main id="main" className="py-10 sm:py-14">
        <article className={column}>
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link href="/blog" className="text-muted hover:text-ink text-small inline-flex min-h-11 items-center gap-1.5 transition-colors">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Blog
            </Link>
            <ThemeToggle className="border-line rounded-md border p-1" />
          </div>
          <header className="border-line mb-10 border-b pb-8">
            <h1 className="font-display text-hero text-balance">{post.title}</h1>
            <p className="text-muted mt-4 text-pretty">{post.description}</p>
            <PostMeta post={post} className="mt-5" />
            {updated ? (
              <p className="text-faint text-small mt-1">
                Updated <time dateTime={updated}>{formatDay(updated)}</time>
              </p>
            ) : null}
          </header>
          {body}
        </article>

        {newer || older ? (
          <nav aria-label="Previous and next posts" className={`${column} mt-14 flex flex-wrap justify-between gap-4`}>
            {older ? <Link href={older.path} className={textLink}>← {older.title}</Link> : <span />}
            {newer ? <Link href={newer.path} className={textLink}>{newer.title} →</Link> : null}
          </nav>
        ) : null}

        <section aria-labelledby="start" className={`${column} mt-14`}>
          <div className="border-line border-t pt-10">
            <h2 id="start" className="font-display text-h3">{CLOSER.head}</h2>
            <p className="text-soft mt-2 text-pretty">{CLOSER.body}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button href={CTA.primary.href} event="open_app" label={CTA.primary.label}>
                {CTA.primary.label}
              </Button>
              <a href={`${SITE.domain}/${CTA.secondary.href}`} className={secondary}>
                {CTA.secondary.label}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer home={SITE.domain} />
    </>
  );
}
