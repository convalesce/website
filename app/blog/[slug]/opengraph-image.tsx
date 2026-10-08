import { POSTS, bySlug } from "@/lib/blog";
import { HERO, SITE } from "@/lib/content";
import { shareCard } from "@/lib/share-card";

type Params = { slug: string };

export const alt = `${SITE.company} blog`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams(): Params[] {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export default async function PostImage({ params }: { params: Promise<Params> }) {
  const post = bySlug((await params).slug);
  return shareCard({ head: post?.title ?? HERO.head, sub: post?.description ?? HERO.sub, headSize: 60 });
}
