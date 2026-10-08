import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostMeta } from "@/components/blog/post-list";
import { TagList } from "@/components/blog/tags";
import { Footer } from "@/components/footer";
import { Section } from "@/components/frame";
import { Nav } from "@/components/nav";
import { JsonLd } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { POSTS, bySlug, formatDay, neighbours, related, type Post } from "@/lib/blog";
import { CLOSER, CTA, SITE } from "@/lib/content";
import { postJsonLd, postMetadata } from "@/lib/seo";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const post = bySlug((await params).slug);
  return post ? postMetadata(post) : {};
}

const secondary =
  "border-ink/25 bg-bg/60 text-ink hover:border-ink/40 hover:bg-ink/[0.06] inline-flex h-11 items-center gap-2 rounded-md border px-5 text-small font-medium whitespace-nowrap transition-colors";

function Contents({ post }: { post: Post }) {
  if (post.headings.length < 2) return null;
  return (
    <aside className="hidden lg:block">
      <nav aria-labelledby="contents" className="sticky top-24">
        <p id="contents" className="mono-label">On this page</p>
        <ol className="border-line mt-4 border-l">
          {post.headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className="text-muted hover:border-ink hover:text-ink text-small -ml-px block border-l border-transparent py-1.5 pl-4 text-pretty transition-colors"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}

/* Previous is the post before this one in time, next the one after. */
function Neighbour({ post, way }: { post: Post; way: "Previous" | "Next" }) {
  return (
    <Link
      href={post.path}
      className={`border-line hover:bg-ink/[0.03] block rounded-lg border p-5 transition-colors ${way === "Next" ? "sm:col-start-2 sm:text-right" : ""}`}
    >
      <span className="mono-label block">{way} post</span>
      <span className="text-h3 mt-2 block text-balance">{post.title}</span>
    </Link>
  );
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = bySlug(slug);
  if (!post) notFound();

  const { default: Body } = await import(`@/content/blog/${slug}.mdx`);
  const { newer, older } = neighbours(post);
  const others = related(post);

  return (
    <>
      <Nav home={SITE.domain} />
      <main id="main">
        <Section index="/blog" label="Post" pad="tight">
          <nav aria-label="Breadcrumb" className="text-small text-faint flex pt-8">
            <Link href="/blog" className="hover:text-ink transition-colors">
              Blog
            </Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="text-muted truncate">{post.title}</span>
          </nav>

          <header className="pt-8 pb-12 lg:pt-12 lg:pb-16">
            <h1 className="font-display text-display max-w-[24ch] text-balance">{post.title}</h1>
            <p className="text-muted mt-6 max-w-[62ch] text-pretty">{post.description}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <PostMeta post={post} />
              <TagList tags={post.tags} />
            </div>
            {post.updated && post.updated !== post.date ? (
              <p className="text-faint text-small mt-3">
                Updated <time dateTime={post.updated}>{formatDay(post.updated)}</time>
              </p>
            ) : null}
          </header>

          <div className="border-line grid gap-x-16 border-t pt-10 lg:grid-cols-[minmax(0,68ch)_minmax(0,16rem)] lg:justify-between lg:pt-14">
            <article className="max-w-[68ch] min-w-0">
              <Body />
            </article>
            <Contents post={post} />
          </div>

          {newer || older ? (
            <nav aria-label="Previous and next posts" className="border-line mt-16 grid gap-3 border-t pt-10 sm:grid-cols-2">
              {older ? <Neighbour post={older} way="Previous" /> : null}
              {newer ? <Neighbour post={newer} way="Next" /> : null}
            </nav>
          ) : null}

          {others.length > 0 ? (
            <section aria-labelledby="related" className="border-line mt-16 border-t pt-10">
              <h2 id="related" className="font-display text-h3">Related posts</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link href={other.path} className="border-line hover:bg-ink/[0.03] block h-full rounded-lg border p-5 transition-colors">
                      <span className="text-h3 block text-balance">{other.title}</span>
                      <span className="text-muted text-small mt-2 block text-pretty">{other.description}</span>
                      <PostMeta post={other} className="mt-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="start" className="border-line bg-surface mt-16 rounded-lg border p-7 sm:p-9 lg:p-10">
            <h2 id="start" className="font-display text-h2 max-w-[22ch] text-balance">{CLOSER.head}</h2>
            <p className="text-muted mt-4 max-w-[52ch] text-pretty">{CLOSER.body}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button href={CTA.primary.href} beta event="open_app" label={CTA.primary.label}>
                {CTA.primary.label}
              </Button>
              <a href={`${SITE.domain}/${CTA.secondary.href}`} className={secondary}>
                {CTA.secondary.label}
              </a>
            </div>
          </section>
        </Section>
      </main>
      <Footer home={SITE.domain} />
      <JsonLd data={postJsonLd(post)} />
    </>
  );
}
