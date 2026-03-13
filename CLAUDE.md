# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run lint     # ESLint + Prettier check
npm run format   # Auto-format with Prettier
npm test         # Run Jest tests
```

Tests live in `src/lib/__tests__/`. A pre-commit hook runs `lint` and `test` before every commit.

## Architecture

This is a **Next.js App Router** personal website/blog for Julian Bastow (bastow.de).

**Content system**: Blog posts and static pages live as MDX files in `/content/`. They are parsed at build time using `gray-matter` (frontmatter) and `next-mdx-remote`. Utility functions in `src/lib/` handle reading and parsing these files — `blog.ts` for posts, `pages.ts` for static pages, `mdx.ts` for MDX rendering.

**Routing**: All routes are under `src/app/` using the App Router. Blog posts are at `/texts/[slug]`. Static content pages (about, privacy, impressum) each have their own route that delegates to `StaticPage` component fed from `/content/pages/`.

**Styling**: Tailwind CSS v4 via PostCSS — no `tailwind.config.*` file, uses v4 defaults. Global styles in `src/app/globals.css`.

**Styling convention**: All component styles are defined as named classes in the `@layer components` block in `globals.css`. Do not use inline Tailwind utility classes directly in JSX for anything beyond trivial one-offs — extract them into a named class in `globals.css` instead. Use `color:var(--token)` syntax when referencing CSS custom properties (e.g. `text-[color:var(--foreground-btn)]`).

**Theming**: Dark/light mode via `next-themes`, wrapped in `src/components/providers/theme-provider.tsx` at the root layout.

**Site config**: `src/constants/config.ts` holds `baseUrl` and author metadata used for SEO (sitemap, robots, OpenGraph).

**Path alias**: `@/*` maps to `src/*`.
