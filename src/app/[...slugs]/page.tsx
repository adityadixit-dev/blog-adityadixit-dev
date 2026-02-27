import {
  getAllSlugsFromDir,
  SlugsStaticParamsReturnType,
} from "@/lib/content/get-all-slugs-from-content";

type SlugsPageProps = {
  params: Promise<{ slugs: string[] }>;
};

export default async function SlugsPage({ params }: SlugsPageProps) {
  const { slugs } = await params;
  const slugPath = slugs.join("/");
  const { default: Post, frontmatter } = await import(
    `@/content/${slugPath}.md`
  );

  console.log(frontmatter);

  return (
    <article className="prose dark:prose-invert mx-auto py-8">
      {slugs.length ? (
        <>
          <p>
            Showing content for: <code>{slugPath}</code>
          </p>
          <section>
            <Post />
          </section>
        </>
      ) : (
        <p>This is the root index for the catch-all route.</p>
      )}
    </article>
  );
}

export function generateStaticParams(): SlugsStaticParamsReturnType[] {
  const allSlugs = getAllSlugsFromDir("src/content");
  return allSlugs;
}

export const dynamicParams = false;
