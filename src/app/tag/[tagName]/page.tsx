import type { Metadata } from "next";

import LatestPosts from "@/components/blog/latest-posts";
import { getAllPostMetadata } from "@/lib/content/get-all-post-metadata";

type TagPageProps = {
  params: Promise<{
    tagName: string;
  }>;
};

export async function generateStaticParams() {
  const posts = await getAllPostMetadata();
  const tagSet = new Set<string>();

  for (const post of posts) {
    for (const tag of post.normalizedTags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).map((tag) => ({ tagName: tag }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tagName } = await params;
  const title = `Tag: ${tagName}`;
  return {
    title,
    description: `Posts tagged with ${tagName}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tagName } = await params;
  const requestedTag = tagName.toLowerCase();
  const posts = await getAllPostMetadata();
  const matchingPosts = posts.filter((post) =>
    post.normalizedTags.includes(requestedTag),
  );
  const previewPosts = matchingPosts.slice(0, 5);

  return (
    <div className="min-h-screen ">
      <div className="mx-auto flex max-w-6xl flex-col gap-10  px-4 py-16 sm:px-6 lg:px-8">
        <LatestPosts posts={previewPosts} />

        {!matchingPosts.length && (
          <p className="rounded-2xl border border-white/10 bg-card/60 p-6 text-sm text-muted-foreground">
            No posts exist for this tag yet.
          </p>
        )}

        <footer className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Showing the latest {previewPosts.length} articles tagged with{" "}
            {requestedTag}.
          </p>
        </footer>
      </div>
    </div>
  );
}
