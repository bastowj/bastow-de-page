# CLAUDE.md

Next.js App Router personal website/blog for Julian Bastow (bastow.de).

```bash
pnpm dev        # Dev server (Turbopack)
pnpm build      # Production build
pnpm lint       # eslint . --max-warnings 0 && prettier --check .
pnpm typecheck  # content-collections build && tsc --noEmit
pnpm format     # Prettier write
pnpm test       # Jest
```

Warnings fail `lint`; to accept one, scope the rule off in `eslint.config.mjs`. `typecheck` needs the `content-collections build` prefix because `.content-collections/generated` is gitignored, and it is a separate gate because `next build` does not typecheck test files. A pre-commit hook runs `lint`, `typecheck` and `test`.

After changing dependencies, run `pnpm audit` and record fixes or accepted findings in `CVE.log`. Raise transitive pins with `pnpm.overrides` in `package.json`.

## Structure

- MDX content in `/content/`, compiled by `content-collections.ts` into `allTexts` / `allPages`. `src/lib/blog.ts` and `pages.ts` wrap those; `MDXContent.tsx` renders a body.
- `BlogPost` and `StaticPage` are flat: `post.title`, not `post.frontmatter.title`.
- Posts at `/texts/[slug]`, categories at `/texts/category/[category]`. Static pages delegate to `StaticPage`.
- `src/constants/config.ts` holds site-wide URLs and identifiers — put new ones there. `navigation.ts` holds `navItems` and `legalNavItems`; `sitemap.ts` derives static routes from both, so don't hardcode a list.
- Icons: `@heroicons/react/24/outline` via `src/lib/icons.ts`. No custom SVG components.
- `@/*` → `src/*`.

## Rules

- `output: "standalone"` is for the Docker image only, and `next.config.ts` gates it off when `NEXT_ADAPTER_PATH` or `VERCEL` is set. Next runs the standalone copy step after a build adapter's `onBuildComplete`, and the `next-server.js.nft.json` it needs is gone by then, so enabling both fails the build. Keep the gate.
- New dynamic route over build-time content: set `generateStaticParams` and `dynamicParams = false`, else it renders on demand.
- Category URLs use `categorySlug()` / `getCategoryBySlug()`. Never percent-encode a category param — `generateMetadata` and the page component get different encoding levels of the same param.
- Post slugs are MDX filenames, used verbatim and validated. Unsafe filenames and colliding category slugs fail the build by design; rename the content.
- Component styles go in the `@layer components` block in `globals.css` as named classes, not inline utilities in JSX.
- Tailwind variants (`group`, `peer`) in `@apply` are a v4 build error. Use `.image-card:hover .image-card-img { @apply opacity-60; }`.
- Theme tokens declared in `@theme inline` (`background`, `surface`, `foreground`, `foreground-muted`, `foreground-btn`, `link`, `link-hover`, `primary-subtle`, `primary-strong`) take the shorthand: `bg-background`. Others (`--primary`, `--primary-hover`, `--border`, `--hover-bg`) need `text-[color:var(--primary)]`.
- Themes are `light`, `dark`, `vaporwave` with `defaultTheme="system"` — branch on `resolvedTheme`, since `theme` is `"system"` until the user picks.

## Tests

Live in `__tests__/` next to what they cover. `jest.config.ts` splits by extension: `.test.ts` → Node, `.test.tsx` → jsdom.

`content-collections` doesn't resolve outside a build. Mock it virtually; for a module importing it use a factory mock, since an automock still loads the real one.

```ts
jest.mock("content-collections", () => ({ allTexts: [], allPages: [] }), {
  virtual: true,
});
```

For routing or data-fetching changes, run `pnpm build && pnpm start` and request the routes — a passing build isn't enough. Check the build's route markers: `ƒ` on a content route means it lost static generation.
