import type { ComponentType } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import LatestPosts from "@/components/blog/latest-posts";
import {
  getAllPostMetadata,
  normalizeTag,
  type PostMetadataWithSlug,
} from "@/lib/content/get-all-post-metadata";

type SlugsPageParams = {
  slugs: string[];
};

type SlugsPageProps = {
  params: Promise<SlugsPageParams>;
};

export default async function SlugsPage({ params }: SlugsPageProps) {
  const { slugs } = await params;
  const slugSegments = slugs.filter((segment) => segment.length > 0);
  const slugPath = slugSegments.join("/");

  if (!slugSegments.length) {
    return (
      <article className="prose dark:prose-invert mx-auto py-8">
        <p>This is the root index for the catch-all route.</p>
      </article>
    );
  }

  const posts = await getAllPostMetadata();
  const matchingPost = posts.find((post) => post.slug === slugPath);

  if (matchingPost) {
    const postModule = await import(`@/content/${matchingPost.sourcePath}`);
    const Post = postModule.default as ComponentType;
    const frontmatter = (postModule.frontmatter ??
      postModule.metadata ??
      {}) as PostMetadataWithSlug["metadata"];
    const dateDisplay = formatPostDate(frontmatter.date);
    const sidebarTags = Array.isArray(frontmatter.tags)
      ? frontmatter.tags.map((tag) => normalizeTag(String(tag))).filter(Boolean)
      : [];

    return (
      <article className="mx-auto grid max-w-6xl gap-10 px-4 py-8 lg:grid-cols-[3fr_1fr]">
        <section className="prose dark:prose-invert space-y-10">
          <div className="space-y-4 border-b border-white/10 pb-6">
            <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground/70">
              {dateDisplay}
            </p>
            {frontmatter.summary ? (
              <p className="text-lg text-muted-foreground">
                {frontmatter.summary}
              </p>
            ) : null}
          </div>
          <Post />
        </section>
        <aside>
          <section className="self-start space-y-4 rounded-2xl border border-white/10 bg-card/60 p-6 text-muted-foreground max-w-[220px]">
            <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground/60">
              Tags
            </p>
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
              <p className="text-sm text-muted-foreground/80">
                This post has no tags yet.
              </p>
            )}
          </section>

          <section>
            <h3>On This Page</h3>
          </section>
        </aside>
      </article>
    );
  }

  const folderPosts = posts.filter((post) =>
    slugSegments.every(
      (segment, index) => post.slugSegments[index] === segment,
    ),
  );

  if (!folderPosts.length) {
    notFound();
  }

  const folderTitle = formatSegmentLabel(slugSegments);
  const description = `A living index of ${folderPosts.length} ${
    folderPosts.length === 1 ? "article" : "articles"
  } published beneath ${folderTitle}.`;

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/70">
            Archive
          </p>
          <h1 className="text-4xl font-semibold text-white">{folderTitle}</h1>
          <p className="max-w-3xl text-sm text-muted-foreground/80">
            {description}
          </p>
        </header>

        <LatestPosts posts={folderPosts} />

        <footer className="text-sm text-muted-foreground/70">
          Showing {folderPosts.length} descendant{" "}
          {folderPosts.length === 1 ? "article" : "articles"} for this path.
        </footer>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<SlugsPageParams>;
}): Promise<Metadata> {
  const { slugs } = await params;
  const slugSegments = slugs.filter((segment) => segment.length > 0);

  if (!slugSegments.length) {
    return {
      title: "Posts",
      description:
        "Explore the signal-driven dispatches archived on this site.",
    };
  }

  const posts = await getAllPostMetadata();
  const slugPath = slugSegments.join("/");
  const matchingPost = posts.find((post) => post.slug === slugPath);

  if (matchingPost) {
    return {
      title: matchingPost.metadata.title ?? slugPath,
      description:
        matchingPost.metadata.summary ??
        `Signal-driven notes covering ${matchingPost.slugSegments.at(-1) ?? slugPath}.`,
    };
  }

  const folderPosts = posts.filter((post) =>
    slugSegments.every(
      (segment, index) => post.slugSegments[index] === segment,
    ),
  );

  if (!folderPosts.length) {
    return {
      title: "Not Found",
      description: "No indexed posts exist at this path.",
    };
  }

  const folderTitle = formatSegmentLabel(slugSegments);
  return {
    title: `${folderTitle} · Signal Dispatches`,
    description: `Articles published beneath the ${folderTitle} path.`,
  };
}

export async function generateStaticParams() {
  const posts = await getAllPostMetadata();
  const seen = new Set<string>();
  const params: SlugsPageParams[] = [];

  for (const post of posts) {
    for (let depth = 1; depth <= post.slugSegments.length; depth += 1) {
      const prefix = post.slugSegments.slice(0, depth);
      const key = prefix.join("/");
      if (!seen.has(key)) {
        seen.add(key);
        params.push({ slugs: prefix });
      }
    }
  }

  return params;
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

function formatSegmentLabel(segments: string[]): string {
  return segments.map((segment) => humanizeSegment(segment)).join(" / ");
}

function humanizeSegment(segment: string) {
  return segment
    .split("-")
    .map((word) =>
      word.length
        ? `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
        : "",
    )
    .join(" ")
    .trim();
}
