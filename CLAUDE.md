# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev         # Start dev server with Turbopack
pnpm build       # Production build
pnpm lint        # ESLint only — see below
pnpm format      # Auto-format with Prettier
pnpm test        # Run Jest tests
```

`lint` runs `eslint .` and does **not** check formatting. `eslint-config-prettier` only switches off rules that would fight Prettier; it never runs Prettier. Nothing in `lint`, the pre-commit hook or CI would catch an unformatted file, so run `pnpm format` (or `pnpm exec prettier --check .`) yourself.

Tests live in `__tests__/` directories anywhere under `src/` — currently `src/lib/`, `src/components/`, `src/app/` and `src/app/feed.xml/`. `jest.config.ts` runs two projects, split by extension: `.test.ts` under Node, `.test.tsx` under jsdom. Put a test in the `__tests__` directory next to what it covers; narrower globs previously caused two test files to be silently collected by neither project.

A pre-commit hook runs `lint` and `test` before every commit.

Modules that import `content-collections` cannot be loaded directly in tests — the alias only resolves through the Next build. Mock it (`jest.mock("content-collections", () => ({ allTexts: [...], allPages: [...] }), { virtual: true })`), or use a factory mock for the module under test so the real one is never loaded. An automock is not enough: it still imports the real module to read its exports.

## Architecture

This is a **Next.js App Router** personal website/blog for Julian Bastow (bastow.de).

**Content system**: Blog posts and static pages live as MDX files in `/content/`. `content-collections.ts` compiles them at build time with Zod-validated frontmatter and exposes `allTexts` and `allPages` through the `content-collections` alias. `src/lib/blog.ts` and `src/lib/pages.ts` wrap those collections; `src/components/MDXContent.tsx` renders a compiled body as an RSC.

`BlogPost` and `StaticPage` are **flat** — `post.title`, `post.date`, `post.categories`, not `post.frontmatter.title`. The nested `frontmatter` shape was a leftover from `gray-matter` and is gone.

**Routing**: All routes are under `src/app/` using the App Router. Blog posts are at `/texts/[slug]`, category listings at `/texts/category/[category]`. Static content pages (about, contact, privacy, impressum) each have their own route that delegates to the `StaticPage` component fed from `/content/pages/`.

Both dynamic routes set `generateStaticParams` and `dynamicParams = false`, so every post and category is prerendered and an unknown param 404s without invoking the page. If you add a dynamic route over build-time content, do the same — without `generateStaticParams` the route silently renders on demand (`ƒ` rather than `●` in the build output).

**URL safety**: Category names are free text, so routes use a slug from `categorySlug()` and `getCategoryBySlug()` resolves it back to the real name. Do not percent-encode a category into a URL instead: Next hands `generateMetadata` and the page component _different_ encoding levels of the same param, so no fixed number of `decodeURIComponent` calls is correct in both. Post slugs are MDX filenames used verbatim, so they are validated rather than slugified — an unsafe filename fails the build instead of moving a published URL.

**Styling**: Tailwind CSS v4 via PostCSS — no `tailwind.config.*` file, uses v4 defaults. Global styles in `src/app/globals.css`.

**Styling convention**: All component styles are defined as named classes in the `@layer components` block in `globals.css`. Do not use inline Tailwind utility classes directly in JSX for anything beyond trivial one-offs — extract them into a named class in `globals.css` instead.

Tailwind variant classes (`group`, `group-hover`, `peer`, etc.) cannot be used inside `@apply` in Tailwind v4 — they will cause a build error. Use native CSS selectors instead (e.g. `.image-card:hover .image-card-img { @apply opacity-60; }`).

**Referencing theme tokens**: which form you need depends on whether the token is declared in the `@theme inline` block in `globals.css`.

- Declared there (`background`, `surface`, `foreground`, `foreground-muted`, `foreground-btn`, `link`, `link-hover`, `primary-subtle`, `primary-strong`): the shorthand is fine and preferred — `bg-background`, `text-foreground-muted`, `text-link`.
- Not declared there (`--primary`, `--primary-hover`, `--border`, `--hover-bg`): no shorthand exists, so reference the property directly — `text-[color:var(--primary)]`.

`@theme inline` inlines the token's _reference_, not its resolved value, so a shorthand compiles to a runtime `var()` and the `.dark` / `.vaporwave` overrides still apply. Verified by compiling probe classes: `text-link` → `color:var(--primary)`, `text-foreground-muted` → `color:var(--foreground-muted)`, `bg-surface` → `background-color:var(--surface)`. `globals.css` relies on this itself in `body { @apply bg-background text-foreground; }`.

This would not hold under a plain `@theme` block, which emits resolved values — that is the case the earlier "never use shorthand, it breaks dark mode" rule was guarding against. If the block ever loses `inline`, revisit this.

**Theming**: Three themes — `light`, `dark`, `vaporwave` — via `next-themes`, wrapped in `src/components/providers/theme-provider.tsx` at the root layout. `defaultTheme` is `system`, so read `resolvedTheme` rather than `theme` when branching on the current theme; `theme` is the literal string `"system"` until the user picks one.

**Site config**: `src/constants/config.ts` holds `baseUrl`, author metadata, and site-wide constants (`SITE_CONFIG`, the `PIXELFED` object, `PIXELFED_PROFILE` derived from it). Add any new site-wide URLs or identifiers here rather than inlining them in page or lib files.

`src/constants/navigation.ts` holds `navItems` and `legalNavItems`. `src/app/sitemap.ts` derives its static route list from both, so adding a page to the nav adds it to the sitemap — don't reintroduce a hardcoded list there.

**Path alias**: `@/*` maps to `src/*`.

**Icons**: Always use `@heroicons/react/24/outline` for icons. Export new icons via `src/lib/icons.ts`. Do not create custom SVG icon components.
