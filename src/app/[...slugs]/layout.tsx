import React from "react";
import type { ReactNode } from "react";

interface SlugsLayoutProps {
  readonly children: ReactNode;
  readonly params: { slugs?: string[] };
}

export default function SlugsLayout({ children }: SlugsLayoutProps) {
  return (
    <div className="">
      <main className="">{children}</main>
    </div>
  );
}


