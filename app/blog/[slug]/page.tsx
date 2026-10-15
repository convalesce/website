import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { PostView } from "@/components/blog/post-view";
import { JsonLd } from "@/components/page-shell";
import { POSTS, bySlug, neighbours } from "@/lib/blog";
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
  const { default: Body } = (await import(`@/content/blog/${post.slug}.mdx`)) as { default: () => ReactNode };
  return (
    <>
      <PostView post={post} body={<Body />} {...neighbours(post)} />
      <JsonLd data={postJsonLd(post)} />
    </>
  );
}
