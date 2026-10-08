import { PostList } from "@/components/blog/post-list";
import { TagFilter } from "@/components/blog/tags";
import { JsonLd, PageShell } from "@/components/page-shell";
import { POSTS } from "@/lib/blog";
import { SITE } from "@/lib/content";
import { blogMetadata, pageJsonLd } from "@/lib/seo";

export const metadata = blogMetadata();

export default function Page() {
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: POSTS.map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: post.title,
      url: post.url,
    })),
  };
  return (
    <>
      <PageShell
        index="/blog"
        label="Blog"
        home={SITE.domain}
        title="What a data incident is really like."
        intro="Each post takes one failure and walks through it: what went red, where the time went, who was waiting, and what would have shortened it."
      >
        <TagFilter />
        <div className="mt-10">
          <PostList posts={POSTS} />
        </div>
      </PageShell>
      <JsonLd data={pageJsonLd("/blog")} />
      <JsonLd data={list} />
    </>
  );
}
