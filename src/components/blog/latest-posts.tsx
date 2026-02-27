import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  normalizeTag,
  type PostMetadataWithSlug,
} from "@/lib/content/get-all-post-metadata";

type LatestPostsProps = {
  readonly posts: PostMetadataWithSlug[];
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatDate(value: PostMetadataWithSlug["metadata"]["date"]) {
  if (!value) {
    return "Date TBD";
  }

  if (value instanceof Date) {
    return dateFormat.format(value);
  }

  const parsed = Date.parse(value.toString());
  if (!Number.isNaN(parsed)) {
    return dateFormat.format(parsed);
  }

  return value.toString();
}

export default function LatestPosts({ posts }: LatestPostsProps) {
  if (!posts.length) {
    return (
      <section className="space-y-4 rounded-2xl border border-white/10 bg-card p-6">
        <p className="text-sm font-semibold text-muted-foreground">
          No posts have been published yet.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground/70">
            Latest Work
          </p>
          <h2 className="text-2xl font-semibold text-white">Spotlighted Articles</h2>
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
          {posts.length} total
        </span>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => {
          const href = post.slug ? `/${post.slug}` : "/";

          return (
            <Card
              key={post.slug}
              className="group transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle>
                  <Link
                    href={href}
                    className="text-lg font-semibold text-white transition hover:text-sky-300"
                  >
                    {post.metadata.title ?? post.slug}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {formatDate(post.metadata.date)}
                </CardDescription>
              </CardHeader>
              {post.metadata.summary ? (
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {post.metadata.summary}
                  </p>
                </CardContent>
              ) : null}
              {post.metadata.tags?.length ? (
                <CardContent className="flex flex-wrap gap-2">
                  {post.metadata.tags.map((tag) => {
                    const normalized = normalizeTag(String(tag));
                    return (
                      <Link
                        key={normalized}
                        href={`/tag/${encodeURIComponent(normalized)}`}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground transition hover:border-white hover:text-white"
                      >
                        {tag}
                      </Link>
                    );
                  })}
                </CardContent>
              ) : null}
              <CardFooter>
                <Link
                  href={href}
                  className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80 transition hover:text-white"
                >
                  Read Article
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
