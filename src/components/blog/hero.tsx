import Link from "next/link";

type BlogHeroProps = {
  readonly heading: string;
  readonly subheading: string;
  readonly description: string;
  readonly ctaLabel: string;
  readonly ctaHref?: string;
};

export default function BlogHero({
  heading,
  subheading,
  description,
  ctaLabel,
  ctaHref,
}: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0b111c] via-[#04060d] to-[#0f121a] p-10 shadow-[0_35px_80px_rgba(5,8,20,0.75)]">
      <div className="absolute inset-0 opacity-60" aria-hidden>
        <div className="pointer-events-none h-full w-full rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.35),_transparent_40%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.3),_transparent_45%)]" />
      </div>
      <div className="relative z-10 space-y-6">
        <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground/70">Mission</p>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-sky-400">{subheading}</p>
          <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{heading}</h1>
        </div>
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">{description}</p>
        {ctaHref ? (
          <Link
            href={ctaHref}
            className="inline-flex rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/20"
          >
            {ctaLabel}
          </Link>
        ) : (
          <span className="inline-flex rounded-full border border-white/10 px-6 py-2 text-sm font-semibold text-muted-foreground">
            {ctaLabel}
          </span>
        )}
      </div>
    </section>
  );
}
