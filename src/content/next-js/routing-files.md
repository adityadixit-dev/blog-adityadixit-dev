---
title: "Routing Files in NextJS"
date: "25-Feb-2026"
summary: "In this we create a brief skeleton of a NextJS project to be used alongside OpenCode and CodeCompanion(nvim)"
tags: ["nextjs"]
---

# NextJS Routing Files

- Simple templates for special next JS files at the root layout

## [loading.tsx](https://nextjs.org/docs/app/api-reference/file-conventions/loading)

```tsx
import { RefreshCw } from "lucide-react";

const loading = () => {
  return (
    <div className="h-screen w-screen absolute top-0 left-0 z-50 bg-secondary opacity-10">
      <div className="flex h-full justify-center items-center ">
        <RefreshCw className="animate-spin" size={64} />
      </div>
    </div>
  );
};

export default loading;
```

## [not-found.tsx](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

```tsx
const MainNotFound = () => {
  return (
    <div className="h-screen flex flex-col gap-y-8 items-center justify-center">
      <h2 className="text-xl">404 - Not Found</h2>
      <p className="text-3xl">
        The Page You were looking for could not be found
      </p>
    </div>
  );
};

export default MainNotFound;
```

## [error.tsx](https://nextjs.org/docs/app/api-reference/file-conventions/error)

```tsx
"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { toast } from "sonner";

export default function MainErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    toast.error(error.message);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```
