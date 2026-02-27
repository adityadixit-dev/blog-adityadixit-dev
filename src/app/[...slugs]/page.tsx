import type { ComponentType } from "react";
import Link from "next/link";
import { getAllPostMetadata, normalizeTag, type PostMetadataWithSlug } from "@/lib/content/get-all-post-metadata";

type SlugsPageProps = {
  params: Promise<{ slugs: string[] }>;
};

export default async function SlugsPage({ params }: SlugsPageProps) {
  const { slugs } = await params;
  const slugPath = slugs.join("/");

  if (!slugPath) {
    return (
      <article className="prose dark:prose-invert mx-auto py-8">
        <p>This is the root index for the catch-all route.</p>
      </article>
    );
  }

  const postModule = await import(`@/content/${slugPath}.md`);
  const Post = postModule.default as ComponentType;
  const frontmatter = (postModule.frontmatter ?? postModule.metadata ?? {}) as PostMetadataWithSlug["metadata"];
  const dateDisplay = formatPostDate(frontmatter.date);
  const sidebarTags = Array.isArray(frontmatter.tags)
    ? frontmatter
        .tags
        .map((tag) => normalizeTag(String(tag)))
        .filter(Boolean)
    : [];

  return (
    <article className="mx-auto grid max-w-6xl gap-10 px-4 py-8 lg:grid-cols-[3fr_1fr]">
      <section className="prose dark:prose-invert space-y-10">
        <div className="space-y-4 border-b border-white/10 pb-6">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground/70">{dateDisplay}</p>
          {frontmatter.summary ? (
            <p className="text-lg text-muted-foreground">{frontmatter.summary}</p>
          ) : null}
        </div>
        <Post />
      </section>
      <aside className="self-start space-y-4 rounded-2xl border border-white/10 bg-card/60 p-6 text-muted-foreground max-w-[220px]">
        <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground/60">Tags</p>
        {sidebarTags.length ? (
          <div className="flex flex-col gap-2">
            {sidebarTags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="inline-flex w-full items-center rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white hover:text-white"
              >
                {tag}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground/80">This post has no tags yet.</p>
        )}
      </aside>
    </article>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPostMetadata();
  return posts.map((post) => ({ slugs: post.slugSegments }));
}

export const dynamicParams = false;

function formatPostDate(value: PostMetadataWithSlug["metadata"]["date"]) {
  if (!value) {
    return "Date TBD";
  }

  if (value instanceof Date) {
    return value.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const parsed = Date.parse(value.toString());
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return value.toString();
}
