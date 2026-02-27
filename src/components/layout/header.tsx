"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/", label: "Blog" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-3xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.4em] text-white/70 transition hover:text-white"
        >
          adityadixit.dev
        </Link>
        <nav className="flex items-center gap-4 text-xs font-semibold tracking-[0.25em] text-white/70">
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className={cn(
                "transition hover:text-white",
                pathname === link.href ? "text-white" : ""
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
