import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { loadPost } from "@/components/blog/post-content";
import { PostView } from "@/components/blog/post-view";
import { JsonLd } from "@/components/page-shell";
import { POSTS, bySlug, neighbours, related } from "@/lib/blog";
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

export default async function Page({ params }: { params: Promise<Params> }) {
  const post = bySlug((await params).slug);
  if (!post) notFound();
  return (
    <>
      <PostView post={post} data={await loadPost(post)} {...neighbours(post)} others={related(post)} />
      <JsonLd data={postJsonLd(post)} />
    </>
  );
}
