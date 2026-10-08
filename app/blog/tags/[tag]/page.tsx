import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostList } from "@/components/blog/post-list";
import { TagFilter } from "@/components/blog/tags";
import { PageShell } from "@/components/page-shell";
import { TAGS, byTag } from "@/lib/blog";
import { SITE } from "@/lib/content";
import { tagMetadata } from "@/lib/seo";

type Params = { tag: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return TAGS.map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  return tagMetadata((await params).tag);
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { tag } = await params;
  const posts = byTag(tag);
  if (posts.length === 0) notFound();
  return (
    <PageShell
      index={`/blog/tags/${tag}`}
      label="Blog"
      home={SITE.domain}
      title={`Posts tagged ${tag}.`}
      intro={posts.length === 1 ? "One post carries this tag so far." : `${posts.length} posts carry this tag, newest first.`}
    >
      <TagFilter active={tag} />
      <div className="mt-10">
        <PostList posts={posts} />
      </div>
    </PageShell>
  );
}
