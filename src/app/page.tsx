import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      <main className="text-center p-8">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50">Hello, world!</h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Welcome to my simple landing page.</p>
      </main>
    </div>
  );
}

