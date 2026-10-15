import { POSTS, bySlug } from "@/lib/blog";
import { coverArt } from "@/lib/cover-art";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return POSTS.map((post) => ({ slug: post.slug }));
}

/* A post's cover for Medium, whose pages are white: the brand's cubes on no background. */
export async function GET(_: Request, { params }: { params: Promise<Params> }) {
  const post = bySlug((await params).slug);
  if (!post) return new Response(null, { status: 404 });
  return coverArt({ seed: post.slug });
}
