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
      if (currH2.id) {
        h2s.push({ id: currH2.id, value: currH2.value });
      }
    }
  }

  if (!h2s.length) {
    return null;
  }

  const headingId = "toc-heading";

  return (
    <section
      aria-labelledby={headingId}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/10 p-6 text-muted-foreground shadow-[0_35px_60px_-15px_rgba(15,23,42,0.85)] max-w-[220px] w-full mx-auto"
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-2 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60" />
      <div className="flex flex-col gap-2">
        <h3
          id={headingId}
          className="font-display text-lg leading-tight text-white"
        >
          On This Page
        </h3>
      </div>

      <ul className="mt-4 space-y-2 text-sm">
        {h2s.map((h2) => (
          <li key={h2.id}>
            <Link
              href={`#${h2.id}`}
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-left text-sm font-medium text-white/80 transition hover:border-white/40 hover:bg-white/10"
            >
              <span>{h2.value}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default H2TableOfContents;
