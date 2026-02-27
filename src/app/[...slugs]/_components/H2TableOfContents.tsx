import Link from "next/link";

interface TocEntry {
  value: string;
  depth: number;
  id?: string;
  children?: Array<TocEntry>;
}

export type Toc = Array<TocEntry>;

export type H2HeadingsType = Array<{
  id: string;
  value: string;
}>;

const H2TableOfContents = ({ toc }: { toc: Toc }) => {
  const h2s: H2HeadingsType = [];

  for (const h1 of toc) {
    if (!h1.children) {
      continue;
    }
    for (const currH2 of h1.children) {
      h2s.push({ id: currH2.id ?? "", value: currH2.value });
    }
  }

  return (
    <section>
      <h3>On This Page</h3>
      <ul>
        {h2s.map((h2) => (
          <li key={h2.id}>
            <Link href={`#${h2.id}`}>{h2.value}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default H2TableOfContents;
