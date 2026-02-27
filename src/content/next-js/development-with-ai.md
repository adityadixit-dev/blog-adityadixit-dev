---
title: "NextJS for use with AI Agents"
date: "25-Feb-2026"
summary: "In this we create a brief skeleton of a NextJS project to be used alongside OpenCode and CodeCompanion(nvim)"
tags: ["nextjs", "opencode", "nvim", "codecompanion", "drizzle"]
---

# NextJS for use with AI Agents

## Stack used

- [NextJS](https://nextjs.org/)
- [Tailwind Typography](https://github.com/tailwindlabs/tailwindcss-typography)
- [ShadCn](https://ui.shadcn.com/)
- [MDX in NextJS](https://nextjs.org/docs/app/guides/mdx)
- [Drizzle ORM](https://orm.drizzle.team/docs/get-started)

## NextJS

- Create a new [NextJS Project](https://nextjs.org/docs/app/guides/ai-agents)

```bash
npx create-next-app@canary .
```

- Enable NextJS [MCP Server](https://nextjs.org/docs/app/guides/mcp)

```json title=".mcp.json" caption="Add .mcp.json to the root of your project"
{
  "mcpServers": {
    "next-devtools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"]
    }
  }
}
```

- You may have to create `opencode.json` in the root of your project.

```json title="opencode.json" caption="Allow opencode to connect to your next mcp server. ShadCn MCP server installed later"
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "shadcn": {
      "type": "local",
      "command": ["npx", "shadcn@latest", "mcp"],
      "enabled": true
    },
    "next-devtools": {
      "type": "local",
      "command": ["npx", "-y", "next-devtools-mcp@latest"],
      "enabled": true
    }
  }
}
```

## Tailwind Typography

```bash caption="Install Tailwind Typography"
npm install -D @tailwindcss/typography
```

- For the `@plugin` should be after the `@import "tailwindcss"` or else you might get an error

```css title="globals.css" caption="Add typography to the main CSS file"
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
```

## ShadCn

```bash caption="Install ShadCn"
npx shadcn@latest init
```

```bash caption="Add some commonly used components"
npx shadcn@latest add button separator sonner
```

```bash caption="Setup the MCP server to connect to OpenCode"
npx shadcn@latest mcp init --client opencode
```

## Next MDX

```bash caption="Install dependencies for MDX"
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

```ts title="next.config.ts" caption="update so that .md and .mdx files are displayed"
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.(md|mdx)$/,
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
```

```tsx title="mdx-components.tsx" caption="Add this file to the root of your project. Inside src folder if you have one"
import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
```

## MDX plugins

```bash caption="Install remark-frontmatter amd remark-mdx-frontmatter"
npm install remark-frontmatter remark-mdx-frontmatter
```

- Add plugin to `next.config.ts` file. Note the correct method depending on if you are using [Turbopack](https://nextjs.org/docs/app/guides/mdx#using-plugins-with-turbopack)

```ts title="next.config.ts" caption="Add frontmatter plugins"
const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-mdx-frontmatter"],
    rehypePlugins: [],
  },
});
```

- We use `remark-mdx-frontmatter` so that we can easily import the metadata

```tsx
const { default: Post, frontmatter } = await import(`@/content/${slugPath}.md`);
```

- Make code blocks look good with [Rehype Pretty Code](https://rehype-pretty.pages.dev/#installation)

```bash caption="Dont forget to add the plugin to next.config.ts"
npm install rehype-pretty-code shiki
```

## Rehype Slug and Table of Contents

- [Rehype Slug](https://github.com/rehypejs/rehype-slug)
- [Rehype Extract TOC](https://github.com/stefanprobst/rehype-extract-toc)

```bash caption="Install Rehype Slug and Rehype Extract TOC"
npm install rehype-slug
npm i @stefanprobst/rehype-extract-toc
```
