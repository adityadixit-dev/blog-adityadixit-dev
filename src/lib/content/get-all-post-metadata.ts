import fs from "fs";
import path from "path";

export type PostFrontmatter = {
  readonly title?: string;
  readonly date?: string | Date;
  readonly summary?: string;
  readonly tags?: readonly string[];
  readonly [key: string]: unknown;
};

export type PostMetadataWithSlug = {
  readonly slug: string;
  readonly slugSegments: readonly string[];
  readonly metadata: PostFrontmatter;
};

const markdownExtensions = [".md", ".mdx"] as const;

function isMarkdownFile(fileName: string): boolean {
  return markdownExtensions.includes(path.extname(fileName) as 
    (typeof markdownExtensions)[number]);
}

function collectMarkdownFiles(dir: string, collection: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const resolved = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      collectMarkdownFiles(resolved, collection);
      continue;
    }

    if (entry.isFile() && isMarkdownFile(entry.name)) {
      collection.push(resolved);
    }
  }

  return collection;
}

function normalizeSlugSegments(slug: string): string[] {
  return slug.split("/").filter((segment) => segment.length > 0);
}

function dateToTimestamp(value: unknown): number {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
}

export async function getAllPostMetadata(
  baseDir = "src/content",
): Promise<PostMetadataWithSlug[]> {
  const resolvedBaseDir = path.resolve(baseDir);
  const markdownFiles = collectMarkdownFiles(resolvedBaseDir);

  const metadataEntries = await Promise.all(
    markdownFiles.map(async (filePath) => {
      const relativePath = path
        .relative(resolvedBaseDir, filePath)
        .split(path.sep)
        .join("/");
      const bareSlug = relativePath.replace(/\.[^.]+$/, "");
      const module = await import(`@/content/${relativePath}`);
      const frontmatter = (module.frontmatter ?? module.metadata ?? {}) as PostFrontmatter;

      return {
        slug: bareSlug,
        slugSegments: normalizeSlugSegments(bareSlug),
        metadata: frontmatter,
      } as PostMetadataWithSlug;
    }),
  );

  return metadataEntries.sort((a, b) => {
    const delta = dateToTimestamp(b.metadata.date) - dateToTimestamp(a.metadata.date);
    if (delta !== 0) {
      return delta;
    }
    return a.slug.localeCompare(b.slug);
  });
}
