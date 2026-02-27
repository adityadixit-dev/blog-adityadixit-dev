import { getAllPostMetadata } from "@/lib/content/get-all-post-metadata";
import BlogHero from "@/components/blog/hero";
import LatestPosts from "@/components/blog/latest-posts";

export default async function HomePage() {
  const posts = await getAllPostMetadata();
  const previewPosts = posts.slice(0, 6);
  const heroCtaSlug = previewPosts[0]?.slug;

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8">
        <BlogHero
          heading="Aditya’s Signal-Driven Notes"
          subheading="Mission: Explain how agents + the web can coexist"
          description="These dispatches document how I stitch Next.js 16, Tailwind 4, MDX, and AI agents together into production-ready experiments. Every post emphasises clarity, reproducibility, and a dark-mode-first aesthetic."
          ctaLabel="Read the latest dispatch"
          ctaHref={heroCtaSlug ? `/${heroCtaSlug}` : undefined}
        />

        <div className="grid gap-10">
          <LatestPosts posts={previewPosts} />
        </div>
      </div>
    </div>
  );
}
