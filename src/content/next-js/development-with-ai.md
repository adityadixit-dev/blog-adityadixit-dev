---
title: "Setup NextJS for use with AI Agents"
date: "25-Feb-2026"
summary: "In this we create a brief skeleton of a NextJS project to be used alongside OpenCode and CodeCompanion(nvim)"
tags: ["nextjs", "opencode", "nvim", "codecompanion"]
---

# NextJS for use with AI Agents

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
