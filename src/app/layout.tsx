import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/layout/header";
import Providers from "@/providers/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aditya Dixit · Notes on AI & Web",
  description:
    "Documenting Next.js 16, Tailwind Typography, and AI agents through reproducible posts and atmospheric showcases.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-y-auto h-screen ">
        <div>
          <Providers>
            <SiteHeader />
            <main className="flex-1 h-full no-scrollbar">{children}</main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
