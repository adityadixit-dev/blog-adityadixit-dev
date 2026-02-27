<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, tooling, and file layout may differ from every training corpus you know. Read `node_modules/next/dist/docs/` before touching app or server code and respect any deprecation notices that appear while the canary releases continue to evolve.
<!-- END:nextjs-agent-rules -->

## Purpose and Audience

- This file greets agentic contributors and documents how to safely explore, build, test, and extend this repo.
- Every instruction is scoped to the current setup: Next.js 16.2.0-canary.62, React 19.2, TypeScript 5, and Tailwind CSS 4 with `@tailwindcss/typography`.
- If you add or change infrastructure (a new test runner, lint plugin, or hosting target), update this document immediately so future agents obey the latest constraints, keep communications concise, and treat this document as living so future agents trust the onboarding.

## Repository Snapshot

- App directory entry: `src/app/layout.tsx` with Geist fonts wired via `next/font/google`, the sticky `SiteHeader`, and `viewport`/`metadata` exports that drive the dark experience.
- The landing page now renders a mission-driven hero plus a modular posts grid inside `src/app/page.tsx`, leveraging the card primitives (`src/components/ui/card.tsx`) and a static gradient that spans the viewport from `globals.css`.
- Global styling leans on Tailwind 4 macros (`@import "tailwindcss"`, `@theme inline`) and CSS custom properties for color / font tokens; body now uses the same layered background as the cards so the whole site matches the hero treatment.
- Content lives under `src/content`, with markdown guiding larger essays; a new helper at `src/lib/content/get-all-post-metadata.ts` recursively loads every markdown frontmatter and sorts it so pages can easily consume title/date/summary/tags plus slug data.

## NextJS AI Agent Stack

- `src/content/next-js/development-with-ai.md` documents the AI-agent-friendly bootstrap (OpenCode + CodeCompanion) and acts as the source of truth for how we leverage this repo alongside the agents.
- The referenced tech stack is NextJS, Tailwind Typography, ShadCn, and Drizzle ORM; keep those dependencies current and align new features with their patterns.
- Keep a `.mcp.json` pointing at `next-devtools-mcp` so the MCP server described in the content can launch whenever you need the AI agent experience locally.
- Mirror that setup in `opencode.json`; a `next-devtools` MCP entry (`npx -y next-devtools-mcp@latest`) ensures OpenCode can start the DevTools server automatically alongside the `shadcn` MCP task.

## Recent Additions

- `PageHero` and `LatestPosts` components (plus the existing card primitives) deliver a modular landing experience that features CTA, mission copy, and metadata-driven cards with every tag.
- The sticky `SiteHeader` now lives in `src/components/layout/header.tsx`, keeping nav live across routes.
- `getAllPostMetadata` centralizes markdown ingestion: it resolves every `.md`/`.mdx` file, pulls frontmatter, normalizes slugs, and sorts by date so other components can derive latest posts without touching `fs` themselves.
- Root-level CSS now layers the same gradients used by the cards across the entire viewport, and layout.tsx renders `<main>` plus the header so the sticky bar coexists with future pages.

## Environment Setup

- Run `npm install` (or `yarn`, `pnpm`, `bun`) from the repository root before invoking any script, and use Node 20+ as required by the Next 16 canary tools.
- Environment variables: none are defined yet, but if you introduce `.env*` files, ensure they live in `.env.local` (gitignored) and document them here.
- Confirm your local shell obeys the usual `PATH` and `NODE_ENV` expectations before running dev/build scripts, especially when switching between package managers, and commit the matching lockfile for the package manager you used to avoid mixing lockfiles.

## Getting Started Fast

- `npm run dev`: launches `next dev` with fast refresh on port 3000; open [http://localhost:3000](http://localhost:3000) to confirm the page renders and keep the server running while you iterate so the router can handle optimistic navigation.
- `npm run build`: runs `next build`; use this to verify production readiness and to bootstrap `next start`.
- `npm run start`: serves the compiled application; use this locally after a successful `build` to validate the production bundle.
- `npm run lint`: executes `eslint` with `eslint-config-next`; use it before pushing changes.

## Testing & Single-Test Flow

- There is currently no `test` script defined, but when you add one (Vitest, Jest, Playwright, etc.) keep this pattern in mind: `npm run test -- --runTestsByPath src/app/__tests__/Home.test.tsx` or `npx vitest run --runTestsByPath src/app/__tests__/Home.test.tsx`/`npx jest src/app/__tests__/Home.test.tsx`; prefer `--runTestsByPath`/`--runInBand` for single-file runs and document the new runner + its setup in `package.json`/`tsconfig.json` so future agents have a traceable reference.

## Linting & Quality Gates

- `npm run lint` calls `eslint` with `eslint-config-next`. Keep files within the rules enforced by that config unless you have a very strong justification (and document overrides in `.eslintrc` or `eslint.config.mjs`), and when you need file-level diagnostics run `npm run lint -- path/to/file.tsx`.
- If you add TypeScript path aliases, register them in both `tsconfig.json` and `next.config.ts` while keeping ESLint aware of the alias via `eslint-import-resolver-typescript` or similar.

## General Code Style

### Imports & Module Structure

- Order imports as follows: built-in/Node, React/Next, third-party, then local modules. Keep an empty line between each group.
- Prefer named exports for hooks/utilities, default exports for page-level React components (e.g., the `Home` component in `page.tsx`).
- Always use double quotes for string literals in TypeScript/JSX files to stay consistent with the existing code.
- For Next-specific helpers (`next/image`, `next/font`, `next/navigation`), destructure the named exports you need rather than importing whole modules when possible.
- Avoid wildcard imports; list the things you use explicitly to keep tree-shaking reliable.

### Formatting & Layout

- Follow the formatting rules inherent to `eslint-config-next` and the default Prettier styles that ship with it; do not introduce conflicting Prettier configs unless there is a compelling reason (and then document it).
- Break complex JSX across multiple lines with one prop per line once a component exceeds 3 props.
- Keep JSX children readable: prefer semantic HTML (e.g., `<main>`, `<section>`, `<article>`) and use Tailwind utility classes intentionally.
- Avoid trailing commas inside JSX props until your formatter insists; Tailwind class strings can stay on a single line if the entire class list is manageable (≤ 3 utility groups) otherwise break them by utility category.

### Tailwind & Styling

- Whenever possible, rely on Tailwind CSS classes instead of crafting ad-hoc CSS rules. Use the `@theme inline` tokens for colors and fonts to keep consistency with global theming.
- For repeated patterns, define custom utility classes inside `globals.css` or create small presentational components that accept class overrides via `className`.
- Keep `globals.css` focused on theme tokens, base resets, and high-level layouts; avoid sprinkling component-specific rules in that file.
- Use `className` composition with `cn` helpers (if you add one); keep Tailwind groupings human-readable and consistent across components.

### TypeScript & Types

- Always type component props explicitly. Use `interface` or `type` declarations outside the component body and name them with the component name plus `Props` (e.g., `HomeProps`).
- Favor `Readonly` wrappers for props objects (as seen in `layout.tsx`) to communicate immutability.
- Avoid `any`. When you need a loose type for gradual migration, prefer `unknown` plus refinement cascades.
- Lean on Next.js-provided types (`Metadata`, `NextPage`, `MetadataRoute`) and built-in `React` types (`React.ReactNode`, `React.ComponentProps`) so the type space stays aligned with frameworks.
- Define utility types (e.g., `type ApiResponse<T> = { data: T; }`) near the feature that needs them, and keep them exported if they cross module boundaries.

### Naming Conventions & Structure

- Component files and exports should use `PascalCase` (e.g., `RootLayout`, `HomeHero`).
- Hooks and helpers should use `camelCase` (e.g., `useHoverIntent`, `buildMetadata`).
- Constants stay uppercase when they are module-level config values (`const DEFAULT_DELAY_MS = 200`).
- Keep folder names lowercase kebab-case (e.g., `src/content`, `src/app`), matching Next folder naming expectations.
- Data-fetching utilities or APIs go under `src/lib` or `src/server` when they interact with runtime services; keep UI logic within `src/app` to preserve the app-router mindset.

### React & App-Directory Patterns

- Default to server components unless you need client-only behaviors (state, effects, event listeners). Add `'use client'` at the top of the file when required and keep it to the smallest scope possible.
- Server components should fetch data via `fetch` at the module level or use server actions; keep `useEffect` and client state out of them.
- Wrap layout-level styles / fonts with `html`/`body` tags in `layout.tsx` to ensure global theming is centralized.
- Use the `metadata` export to declare SEO defaults; override them locally inside `page.tsx` via `generateMetadata`/`metadata` exports if you need page-specific strings.

### Data Fetching & Side Effects

- Prefer `fetch` with `next: { revalidate: ... }` inside server components for static-friendly data.
- Always tag asynchronous functions with `async` and document the contract (e.g., response shape) in code comments if the return type is not obvious.
- Keep caching headers, revalidation intervals, and error handling explicit in the same module as the request logic.
- When hitting external APIs, wrap the call in a helper (e.g., `lib/api.ts`) and export a typed function so you can reuse it across server components.

### Error Handling

- Handle error states explicitly in UI: show fallback markup, log the issue, and avoid letting the entire page crash if a fetch fails.
- Use `try/catch` blocks around `await fetch` calls (or rely on `ErrorBoundary` components) so that runtime exceptions surface in a controlled manner.
- When throwing custom errors, extend `Error` and expose a `status` property if you plan to use it inside Next `notFound`/`redirect` helpers.
- For network or server errors, prefer a helper like `throw new FetchError("message", { status: 500 })` to keep the error handling consistent and searchable.

## Frontend Design Guidelines

- Strive for intentional, varied layouts with a clear visual direction; avoid purple-on-white defaults and the boredom of boilerplate patterns.
- Let Geist tokens drive the typography system, keep CSS variables documented, and keep global styles inside `globals.css` whenever possible.
- Add meaning through restrained motion (page-load, staggered reveals) and atmospheric backgrounds that mix gradients, shapes, or subtle patterns without bulk.
- If you are working inside an existing design system, preserve its established structure, tokens, and visual language rather than reinventing the look.

## Accessibility & UX

- Use semantic HTML, supplement interactive elements with `alt` text or `aria` labels, and document accessibility rationales for unusual layouts.
- Preserve focus states or replace them with custom accessible outlines, and verify keyboard navigation (tab order, enter/space) works end-to-end.
- Validate color combinations against WCAG AA relative to the CSS custom properties defined in `globals.css` before shipping.
- Keep assistive-language decisions explicit in PRs so future agents understand why certain ARIA hooks or overrides exist.

## Deployment & Observability

- The easiest way to deploy the app is Vercel; use the official docs when adding new hosting targets, keep telemetry optional, and document infra changes (env vars, redirects, headers) in `next.config.ts` plus this file so future agents understand why the settings exist.
- Provide short release notes for major UI or behavioral updates, mentioning new env vars, revalidation windows, or build flags you touched.

## Troubleshooting & Debugging

- `npm run lint` is a quick way to surface missing imports, type errors, or stylistic violations; rerun after refactors, and when `next build` fails inspect the stack trace for the first non-Next.js file and check for default exports, unsupported syntax, or missing dependencies.
- Use `npm run dev` and the browser console/network tab to validate fetch calls; Next's new stack traces usually point to the server component that failed.
- If you add telemetry, keep it optional and toggleable via a feature flag; never ship extra runtime log noise unless it is aggregated externally.

## Communication & Handoff

- Summarize your key changes in every PR description; keep it lightweight (2–3 bullet points) and reference this AGENTS file if you touch infra.
- When leaving work unfinished, mention what you tried, what broke, and any reproducer steps so the next agent can pick up quickly.
- Record any surprising decisions (e.g., deviating from Tailwind, introducing a new hook) directly in this file so the shared knowledge base stays current.

## Operational Notes

- Cursor rules or Copilot instructions were not detected: there is no `.cursor/rules/` directory, no `.cursorrules`, and no `.github/copilot-instructions.md`. If such rules appear in the future, add them verbatim to this section and honor their order of precedence.
- Keep dependencies up-to-date. When bumping `next`, `react`, `tailwind`, or TypeScript, re-run `npm run lint` and `npm run build` before committing, and document any new global CSS variables you add inside `src/app/globals.css` while preserving the dark-mode overrides already configured there.
- When introducing new agents (scheduler hooks, GitHub workflows, etc.), mention them here so other agents can read them before executing operations.

## Final Tips for Agents

- Always re-check the `next/dist/docs/` directory after upgrading Next or tailwind; the canary branch is fast-moving and may introduce new conventions.
- Prefer defensive coding: log, validate, and keep operations idempotent. Small localized tests (component snapshots, storybook entries, etc.) help uncover regressions quickly.
- Before you finish, run `npm run lint` and describe any remaining warnings or skipped checks in your final message. If you add tests later, note which ones you expect the next agent to run.
