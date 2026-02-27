type SlugsPageProps = {
  params: Promise<{ slugs: string[] }>;
};

export default async function SlugsPage({ params }: SlugsPageProps) {
  const { slugs } = await params;
  const slugPath = slugs.join("/");

  return (
    <article className="prose dark:prose-invert mx-auto py-8">
      {slugs.length ? (
        <p>
          Showing content for: <code>{slugPath}</code>
        </p>
      ) : (
        <p>This is the root index for the catch-all route.</p>
      )}
    </article>
  );
}
