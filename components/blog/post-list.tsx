import Link from "next/link";

import { TagList } from "@/components/blog/tags";
import { formatDay, type Post } from "@/lib/blog";

/** When it was published and how long it takes to read, as one quiet line. */
export function PostMeta({ post, className = "" }: { post: Post; className?: string }) {
  return (
    <p className={`text-faint text-small tabular-nums ${className}`}>
      <time dateTime={post.date}>{formatDay(post.date)}</time>
      <span aria-hidden="true" className="mx-2">·</span>
      {post.minutes} min read
    </p>
  );
}

/** Posts as rows, in the order given: the date to the left, the post to the right. */
export function PostList({ posts }: { posts: readonly Post[] }) {
  return (
    <ol className="border-line border-t">
      {posts.map((post) => (
        <li key={post.slug} className="border-line grid gap-x-10 gap-y-3 border-b py-9 lg:grid-cols-[11rem_minmax(0,1fr)]">
          <PostMeta post={post} className="lg:pt-1.5" />
          <div className="max-w-[68ch]">
            <h2 className="font-display text-h2 text-balance">
              <Link href={post.path} className="hover:text-accent-text transition-colors">
                {post.title}
              </Link>
            </h2>
            <p className="text-muted mt-3 text-pretty">{post.description}</p>
            <div className="mt-5">
              <TagList tags={post.tags} />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
